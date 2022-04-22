import { Prisma as P } from "@prisma/client";
import { Prisma } from "../services/prisma";

export class Alerts {
  static async create(type: AlertTypes, data: Omit<P.AlertUncheckedCreateInput, "type">) {
    return await Prisma.alert.create({
      data: {
        ...data,
        type
      }
    });
  };
  
  static async deleteAllByClassroom(classroomId: string) {
    return await Prisma.alert.deleteMany({
      where: {
        classroomId
      }
    });
  };
};