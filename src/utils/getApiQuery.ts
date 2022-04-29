import { Prisma as P } from "@prisma/client";

function getApiQuery(query: string = ""): P.StringFilter {
  if(process.env.NODE_ENV === "production") {
    return {
      contains: query.toLowerCase() ?? "",
      mode: "insensitive" as any
    };
  };

  return {
    contains: query.toLowerCase() ?? ""
  };
};

export { getApiQuery };

