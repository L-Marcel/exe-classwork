import { Prisma } from "../services/prisma";

class RequestHistories {
  static async create(operation: string, data: any, user: User) {
    return await Prisma.requestHistory.create({
      data: {
        oldData: JSON.stringify(data),
        title: operation,
        userId: user.id
      }
    });
  };
};

export { RequestHistories };
