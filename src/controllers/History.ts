import { AxiosRequestConfig } from "axios";
import { Prisma } from "../services/prisma";

class Histories {
  static async create(operation: string, data: any, config: AxiosRequestConfig<any>, user: User) {
    return await Prisma.history.create({
      data: {
        data: JSON.parse(JSON.stringify(data)),
        oldRequest: JSON.parse(JSON.stringify(config)),
        title: operation,
        userId: user.id
      }
    });
  };
};

export { Histories };

