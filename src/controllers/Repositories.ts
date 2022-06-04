import { Prisma as P } from "@prisma/client";
import { NotFoundError } from "../errors/api/NotFoundError";
import { Prisma } from "../services/prisma";
import { getApiQuery } from "../utils/getApiQuery";
import { Alerts } from "./Alerts";

export class Repositories {
  static async link({
    repository,
    classroomId,
    teamId
  }: RepositoriesLinkInput) {
    const repositoryAlreadyExists = await Prisma.repository.findFirst({
      where: {
        OR: [
          {
            id: repository.id || ""
          },
          {
            fullname: repository.fullname || ""
          }
        ]
      },
      select: {
        id: true
      }
    });

    if(repositoryAlreadyExists) {
      return await Prisma.repository.update({
        data: {
          classroom: classroomId? {
            connect: {
              id: classroomId
            }
          }:undefined,
          teams: teamId? {
            connect: {
              id: teamId
            }
          }:undefined
        },
        where: {
          id: repositoryAlreadyExists.id
        }
      });
    } else {
      return await this.create({
        ...repository,
        classroom: classroomId? {
          connect: {
            id: classroomId
          }
        }:undefined,
        teams: teamId? {
          connect: {
            id: teamId
          }
        }:undefined
      });
    };
  };

  static async create(data: P.RepositoryCreateInput) {
    return await Prisma.repository.create({
      data
    }).then(async(res) => {
      try {
        await Alerts.create("REPOSITORY", {
          description: `Repository ${res.fullname} was been required by server.`,
          repositoryId: res.id
        });
      } catch (error) {};

      return res;
    });
  };

  static async getInfoToRefreshCommits(repositoryFullname: string) {
    const repository = await Prisma.repository.findUnique({
      where: {
        fullname: repositoryFullname
      },
      select: {
        id: true,
        status: true,
        fullname: true
      }
    });

    if(!repository) {
      throw new NotFoundError("Repository");
    };

    return {
      ...repository
    };
  };

  static async getByUser(userId: string, {
    page = 0,
    query = ""
  }) {
    return await Prisma.repository.findMany({
      take: 12,
      skip: 12 * page,
      orderBy: {
        createdAt: "desc"
      },
      where: {
        AND: [
          {
            OR: [
              {
                classroom: {
                  title: getApiQuery(query)
                }
              },
              {
                teams: {
                  some: {
                    title: getApiQuery(query)
                  }
                }
              },
              {
                fullname: getApiQuery(query)
              },
              {
                name: getApiQuery(query)
              }
            ]
          },
          {
            OR: [
              {
                ownerId: userId
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        description: true,
        fullname: true,
        name: true,
        updatedAt: true,
        updatedBy: true,
        teams: {
          select: {
            title: true,
            id: true
          }
        },
        classroom: {
          select: {
            title: true,
            id: true
          }
        }
      }
    });
  };

  static async countByUser(userId: string, {
    query = ""
  }) {
    return await Prisma.repository.aggregate({
      _count: {
        _all: true
      },
      where: {
        AND: [
          {
            OR: [
              {
                classroom: {
                  title: getApiQuery(query)
                }
              },
              {
                teams: {
                  some: {
                    title: getApiQuery(query)
                  }
                }
              },
              {
                fullname: getApiQuery(query)
              },
              {
                name: getApiQuery(query)
              }
            ]
          },
          {
            OR: [
              {
                ownerId: userId
              }
            ]
          }
        ]
      },
    });
  };

  static async get(id: string, canReturnFalse: boolean = false) {
    const repository = await Prisma.repository.findUnique({
      where: {
        id
      },
      include: {
        alerts: {
          take: 10
        },
        teams: {
          take: 10
        }
      }
    });

    if(!repository && !canReturnFalse) {
      throw new NotFoundError();
    } else if(!repository) {
      return false;
    };

    return repository;
  };

  static async getByFullname(fullname: string) {
    return await Prisma.repository.findFirst({
      where: {
        fullname: {
          contains: fullname,
          mode: "insensitive"
        }
      }
    }).then(res => res).catch((err) => {
      throw new NotFoundError("Repository");
    });
  };

  static async changeStatus(id: string, status: RepositoryStatus) {
    return await Prisma.repository.update({
      where: {
        id
      },
      data: {
        status
      }
    });
  };
};