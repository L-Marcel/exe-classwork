import { Prisma as P } from "@prisma/client";
import { Prisma } from "../services/prisma";

class Commits {
  static async createMany(data: P.Enumerable<P.CommitCreateManyInput>) {
    return await Prisma.commit.createMany({
      skipDuplicates: true,
      data
    });
  };
};

export { Commits };

