import { Namespace } from "socket.io";
import { v4 as uuid } from "uuid";
import { ProcessNotFoundInQueueError } from "../errors/ProcessNotFoundInQueueError";
import { api } from "../services/api";
import { Directory } from "./Directory";
import { Users } from "./Users";

class RepositoryQueue {
  //0 - forced load
  //1 - first load
  //2 - simultaneous load
  //3 - incremental 
  readonly uuid: string = uuid();
  public progressTarget: number = 0;
  public progressValue: number = 0;

  constructor(
    private server: Namespace,
    public fullname: string,
    public id: string,
    public token: string,
    public appToken: string,
    public userId: string,
    public currentStatus: string = "NOT_REQUESTED",
    public isForced: boolean = false,
    public isRunning: boolean = false
  ) {};

  load(namespace: string, onFinish: () => void) {
    if(!this.currentStatus || this.currentStatus === "NOT_REQUESTED" || this.isForced) {
      Directory.getRepositoryCommits(this.userId, this.fullname, this.appToken, (rateLimit) => {
        this.server.emit("rate_limit", rateLimit);
      }, (progress) => {
        let newProgressValue = {
          ...progress,
          name: this.fullname,
          status: "REQUESTED"
        }; 

        this.progressTarget += (progress?.target || 0);
        this.progressValue += (progress?.value || 0);

        const user = Users.getUser(namespace);
        const inProgressValue = user?.updateProgress(newProgressValue);

        const isRunning = user?.alreadyRunningInQueue(this.id);

        if(!isRunning) {
          newProgressValue = {
            value: -this.progressValue,
            target: -this.progressTarget,
            name: this.fullname,
            status: "REQUESTED"
          }; 
          
          this.server.emit("progress", inProgressValue);
          throw new ProcessNotFoundInQueueError(this.fullname);
        };

        this.server.emit("progress", inProgressValue);
      }).then(async(commits) => {
        for(let c = 0; c <= Math.ceil(commits.length/10); c++) {
          const pieceOfCommits = commits.slice((c*10), (c*10) + 10);

          await api.post(`user/repository/socket/commits?token=${this.token}`, {
            fullname: this.fullname,
            id: this.id,
            commits: pieceOfCommits,
            isFinished: c >= Math.ceil(commits.length/10),
            count: commits.length
          }).then((res) => {
            const newProgressValue = {
              target: -pieceOfCommits.length,
              value: -pieceOfCommits.length,
              name: this.fullname,
              status: "REQUESTED"
            };

            const user = Users.getUser(namespace);
            const inProgressValue = user?.updateProgress(newProgressValue);

            const isRunning = user?.alreadyRunningInQueue(this.id);

            if(!isRunning) {
              throw new ProcessNotFoundInQueueError(this.fullname);
            };

            this.server.emit("progress", inProgressValue);

            this.server.emit("progress", inProgressValue);
          }).catch((err) => console.log("Error on update commits: ", err.message));
        };

        const endProgressValue = {
          target: 0,
          value: 0,
          name: this.fullname,
          status: "LOADED"
        };

        const user = Users.getUser(namespace);
        const inProgressValue = user?.updateProgress(endProgressValue);

        this.server.emit("progress", inProgressValue);
        
        console.log("Repository loaded: " + this.fullname);
        onFinish();
      }).catch((err) => { 
        console.log("Error on load commits: ", err.message);
        onFinish();
      });
    } else if(this.currentStatus && this.currentStatus  === "REQUESTED") {
      //onFinish();
    } else if(this.currentStatus === "LOADED") {
      //onFinish();
    };
  };
};

export { RepositoryQueue };

