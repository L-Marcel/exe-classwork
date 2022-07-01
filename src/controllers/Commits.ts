import { Prisma as P } from "@prisma/client/edge";
import { Prisma } from "../services/prisma";

class Commits {
  static async deleteMany(where: P.CommitWhereInput) {
    return await Prisma.commit.deleteMany({
      where
    }).then(res => res).catch(err => {
      console.log(err);
      return {
        count: 0
      };
    });
  };

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

  static async get(repositoryId: string, page = 0, take = 12) {
    return await Prisma.commit.findMany({
      where: {
        repositoryId
      },
      take,
      skip: take * page,
      orderBy: {
        order: "asc"
      }
    });
  };

  static async count(repositoryId: string) {
    return await Prisma.commit.aggregate({
      where: {
        repositoryId
      },
      _count: true
    });
  };
};

export { Commits };

