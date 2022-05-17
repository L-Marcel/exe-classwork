import { EventEmitter } from "stream";
import { Repositories } from "../controllers/Repositories";

declare global {
  var emitter: EventEmitter | undefined;
};

const emitter = global.emitter || new EventEmitter();


if(!global.emitter) {
  emitter.on("@commits:refresh", async(authUserId: string, repositoryFullname: string) => {
    await Repositories.sync(authUserId, repositoryFullname, true);
  });
};

class Tasks {
  private static emitter = emitter;

  static emit(event: TaskEventTypes, ...args: any) {
    this.emitter.emit(event, ...args);
  };

  static refreshCommit(authUserId: string, repositoryFullname: string) {
    this.emitter.emit("@commits:refresh", authUserId, repositoryFullname);
  };
};

export { Tasks };

