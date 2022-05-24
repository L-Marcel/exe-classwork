import { Prisma as P } from "@prisma/client";

function getApiQuery(query: string = ""): P.StringFilter {
  return {
    contains: query.toLowerCase() ?? "",
    mode: "insensitive" as any
  };
};

export { getApiQuery };

