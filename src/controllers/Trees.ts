import { Prisma as P } from "@prisma/client";
import { Prisma } from "../services/prisma";

class Trees {
  static async deleteAll() {
    return await Prisma.tree.deleteMany();
  };

  static async createMany(data: P.Enumerable<P.TreeCreateManyInput>) {
    return await Prisma.tree.createMany({
      skipDuplicates: true,
      data
    });
  };
};

export { Trees };

