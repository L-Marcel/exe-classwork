import { Namespace } from "socket.io";
import { v4 as uuid } from "uuid";
import { ProcessNotFoundInQueueError } from "../errors/ProcessNotFoundInQueueError";
import { api } from "../services/api";
import { Commit, Directory, Progress } from "./Directory";
import { RateLimit } from "./GithubApp";
import { Users } from "./Users";

class RepositoryQueue {
  public progressTarget: number = 0;
  public progressValue: number = 0;
  public requestedAt: Date;
  public uuid: string;

  constructor(
    private server: Namespace,
    public fullname: string,
    public repositoryId: string,
    public token: string,
    public appToken: string,
    public userId: string,
    public isForced: boolean = true,
    public isRunning: boolean = false
  ) {
    this.uuid = uuid();
    this.requestedAt = new Date();
  };

  private onProgressUpdate(namespace: string, progress: Progress) {
    let newProgressValue = {
      ...progress,
      name: this.fullname,
      status: "REQUESTED"
    }; 

    this.progressTarget += (progress?.target || 0);
    this.progressValue += (progress?.value || 0);

    const user = Users.getUser(namespace);
    let inProgressValue = user?.updateProgress(newProgressValue);

    const isRunning = user?.alreadyRunningInQueue(this.uuid);
 
    if(!isRunning) {
      newProgressValue = {
        value: -this.progressValue,
        target: -this.progressTarget,
        name: this.fullname,
        status: "REQUESTED"
      }; 

      inProgressValue = user?.updateProgress(newProgressValue);
      this.server.emit("progress", inProgressValue);

      throw new ProcessNotFoundInQueueError(this.fullname);
    };

    this.server.emit("progress", inProgressValue);
  };

  private onUpdaterateLimit(rateLimit: RateLimit) {
    this.server.emit("rate_limit", rateLimit);
  };

  load(namespace: string, onFinish: () => void) {
    Directory.getRepositoryCommits(
      this.userId, 
      this.fullname, 
      this.appToken, 
      this.onUpdaterateLimit, 
      (progress) => this.onProgressUpdate(namespace, progress)
    ).then(async(commits) => {
      for(let c = 0; c <= Math.ceil(commits.length/10); c++) {
        const pieceOfCommits = commits.slice((c*10), (c*10) + 10);

        await api.post(`user/repository/socket/commits?token=${this.token}`, {
          fullname: this.fullname,
          id: this.repositoryId,
          commits: pieceOfCommits,
          isFinished: c >= Math.ceil(commits.length/10),
          count: commits.length
        }).then(() => {
          let newProgressValue = {
            target: -pieceOfCommits.length,
            value: -pieceOfCommits.length,
            name: this.fullname,
            status: "REQUESTED"
          };

          const user = Users.getUser(namespace);
          let inProgressValue = user?.updateProgress(newProgressValue);

          const isRunning = user?.alreadyRunningInQueue(this.uuid);

          if(!isRunning) {
            newProgressValue = {
              value: -this.progressValue,
              target: -this.progressTarget,
              name: this.fullname,
              status: "REQUESTED"
            }; 

            inProgressValue = user?.updateProgress(newProgressValue);
            this.server.emit("progress", inProgressValue);
            throw new ProcessNotFoundInQueueError(this.fullname);
          };

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
  };
};

export { RepositoryQueue };

