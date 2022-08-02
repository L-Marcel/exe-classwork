import { Progress } from "./Directory";
import { RepositoryQueue } from "./RepositoryQueue";

export type UserProgress = {
  target: number;
  value: number;
  all: Progress[];
};

class User {
  constructor(
    readonly namespace: string,
    public inProgress: UserProgress,
    public repositoriesInQueue: RepositoryQueue[] = []
  ) {};

  getProgress(progressName: string) {
    return this.inProgress.all.find(p => p.name === progressName);
  };

  updateProgress(data: Progress) {
    let progress = this.getProgress(data.name);

    this.inProgress = {
      target: Math.max(this.inProgress.target + (data.target || 0), 0),
      value: Math.max(this.inProgress.value + (data.value || 0), 0),
      all: progress? this.inProgress.all.map(n => {
        if(n.name === data?.name) {
          n = {
            ...n,
            status: (data?.status || n?.status || "LOADED"),
            target: Math.max((n?.target || 0) + (data.target || 0), 0),
            value: Math.max((n?.value || 0) + (data.value || 0), 0),
          };
        };

        return n;
      }):[ ...this.inProgress.all, data ]
    };

    Users.updateUser(this);

    return this.inProgress;
  };

  addInQueue(queue: RepositoryQueue) {
    if(queue.isForced) {
      this.repositoriesInQueue = [
        ...this.repositoriesInQueue.filter(
          r => r.fullname !== queue.fullname
        ),
        queue
      ];

    } else {
      this.repositoriesInQueue = [
        ...this.repositoriesInQueue,
        queue
      ];
    };

    this.nextInQueue(queue.fullname);
    Users.updateUser(this);
  };

  nextInQueue(fullname: string) {
    const repositoryQueue = this.repositoriesInQueue.filter(
      r => r.fullname === fullname
    ); 

    if(repositoryQueue.length <= 0) {
      return;
    };

    const haveOneInExecution = repositoryQueue.some(
      r => r.isRunning
    );

    if(haveOneInExecution) {
      return;
    };

    const nextRequestInQueue = repositoryQueue[0];
    
    this.repositoriesInQueue = this.repositoriesInQueue.map(r => {
      if(r.id === nextRequestInQueue.id) {;
        r.isRunning = true;
      };

      return r;
    });

    Users.updateUser(this);

    nextRequestInQueue.load(this.namespace, () => {
      this.finishRequestInQueue(nextRequestInQueue.uuid);
      this.nextInQueue(fullname);
    });
  };

  alreadyRunningInQueue(uuid: string) {
    const someIsRunning = this.repositoriesInQueue.some(
      r => r.uuid === uuid && r.isRunning === true
    );

    return someIsRunning;
  };

  finishRequestInQueue(uuid: string) {
    this.repositoriesInQueue = [
      ...this.repositoriesInQueue.filter(
        r => r.uuid !== uuid
      ),
    ];

    Users.updateUser(this);
  };
};

class Users {
  static users: User[] = [];

  static addConnectedUser(namespace: string, inProgress: UserProgress) {
    const user = this.getUser(namespace);

    if(!user) {
      const newUser = new User(
        namespace,
        inProgress
      );

      this.users.push(newUser);
    };
  };

  static getUser(namespace: string) {
    return this.users.find(user => user.namespace === namespace);
  };

  static removeUser(namespace: string) {
    this.users = this.users.filter(user => user.namespace !== namespace);
  };

  static getUsers() {
    return this.users;
  };

  static updateUser(user: User) {
    const index = this.users.findIndex(u => u.namespace === user.namespace);

    if(index !== -1) {
      this.users[index] = user;
    };
  };
};

export { Users };