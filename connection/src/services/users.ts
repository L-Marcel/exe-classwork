import { Progress } from "../controllers/Directory";

export type UserProgress = {
  target: number;
  value: number;
  all: Progress[];
};
export type UserData = {
  namespace: string;
  inProgress: UserProgress;
};

class Users {
  static users: UserData[] = [];

  static addConnectedUser(namespace: string, inProgress: UserProgress) {
    const user = this.getUser(namespace);

    if(!user) {
      this.users.push({
        namespace,
        inProgress
      });
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

  static updateUser(user: UserData) {
    const index = this.users.findIndex(u => u.namespace === user.namespace);

    if(index !== -1) {
      this.users[index] = user;
    };
  };

  static getUserProgress(user: UserData | undefined, progressName: string) {
    let progress: Progress | undefined;

    if(user) {
      progress = user.inProgress.all.find(p => p.name === progressName);;
    };

    return progress;
  };

  static updateUserProgress(namespace: string, data: Progress) {
    const user = this.getUser(namespace);
    let progress = this.getUserProgress(user, data.name);

    if(user) {
      user.inProgress = {
        target: Math.max(user.inProgress.target + (data.target || 0), 0),
        value: Math.max(user.inProgress.value + (data.value || 0), 0),
        all: progress? user.inProgress.all.map(n => {
          if(n.name === data?.name) {
            n = {
              ...n,
              status: (data?.status || n?.status || "LOADED"),
              target: Math.max((n?.target || 0) + (data.target || 0), 0),
              value: Math.max((n?.value || 0) + (data.value || 0), 0),
            };
          };

          return n;
        }):[ ...user.inProgress.all, data ]
      };

      this.updateUser(user);

      return user.inProgress;
    };

    return undefined;
  };
};

export { Users };

