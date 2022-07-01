import { PrismaClient } from "@prisma/client/edge";
import { serialize } from "../utils/serialize";
import { SocketApi } from "./api/socketApi";

declare global {
  var prisma: PrismaClient | undefined;
};

const client = global.prisma || new PrismaClient();

if(!global.prisma) {
  client.$use(async(params, next) => {
    let result = await next(params);
    return serialize(result);
  });

  client.$use(async(params, next) => {
    let result = await next(params);

    if(
      (params.action === "create" || params.action === "createMany")
      && params.model === "Alert"
    ) {
      await SocketApi.post("alerts/new")
      .then(() => console.log("Alert created"))
      .catch(err => console.log(err));
    };

    return result;
  });
};

if(process.env.NODE_ENV !== "production") {
  global.prisma = client;
};

export class Prisma {
  private static client = client;

  static user = this.client.user;
  static classroom = this.client.classroom;
  static classroomRelation = this.client.classroomRelation;
  static team = this.client.team;
  static teamRelation = this.client.teamRelation;
  static repository = this.client.repository;
  static commit = this.client.commit;
  static alert = this.client.alert;
};