import { Prisma as P } from "@prisma/client";
import { Prisma } from "../services/prisma";

class Commits {
  static async createMany(data: P.Enumerable<P.CommitCreateManyInput>) {
    return await Prisma.commit.createMany({
      skipDuplicates: true,
      data
    }).then(res => res).catch(err => {
      console.log(err);
      return {
        count: 0
      };
    });
  };
};

export { Commits };

