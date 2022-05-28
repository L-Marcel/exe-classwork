import { EventEmitter } from "stream";
import { Repositories } from "../controllers/Repositories";

const emitter = new EventEmitter();

emitter.on("@commits:refresh", (userId: string, token: string, repositoryFullname: string) => {
  console.log("Task required: commit refresh");
  Repositories.sync(userId, token, repositoryFullname, true);
});

function emit(event: TaskEventTypes, ...args: any) {
  emitter.emit(event, ...args);
};

function refreshCommit(userId: string, token: string, repositoryFullname: string) {
  emit("@commits:refresh", userId, token, repositoryFullname);
};

export { emit, refreshCommit, emitter };

