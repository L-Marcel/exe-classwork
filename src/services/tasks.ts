import { EventEmitter } from "stream";
import { Repositories } from "../controllers/Repositories";

const emitter = new EventEmitter();

emitter.on("@commits:refresh", (authUserId: string, repositoryFullname: string) => {
  console.log("Task required: commit refresh");
  Repositories.sync(authUserId, repositoryFullname, true);
});

function emit(event: TaskEventTypes, ...args: any) {
  emitter.emit(event, ...args);
};

function refreshCommit(authUserId: string, repositoryFullname: string) {
  emit("@commits:refresh", authUserId, repositoryFullname);
};

export { emit, refreshCommit, emitter };

