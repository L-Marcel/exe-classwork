import { PrismaClient } from "@prisma/client";
import { serialize } from "../utils/serialize";

const client = new PrismaClient();

client.$use(async(params, next) => {
  let result = await next(params);
  return serialize(result);
})

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