import { Prisma as P } from "@prisma/client";
import { NotFoundError } from "../errors/api/NotFoundError";
import { Directory } from "../services/directory";
import { Prisma } from "../services/prisma";
import { getApiQuery } from "../utils/getApiQuery";
import { Alerts } from "./Alerts";
import { Commits } from "./Commits";

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
          team: teamId? {
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
        team: teamId? {
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

  static async sync(authUserId: string, repositoryFullname: string, force = false) {
    try {
      if(force) {
        const commits = await Directory.getRepositoryCommits(authUserId, repositoryFullname);

        const repository = await Prisma.repository.findUnique({
          where: {
            fullname: repositoryFullname
          },
          select: {
            id: true,
            fullname: true
          }
        });

        if(!repository) {
          throw new NotFoundError("Repository");
        };

        console.log("Sending to database");

        const commitsCount = await Commits.createMany(commits.map((c: Commit) => {
          return {
            ...c,
            repositoryId: repository.id,
            userGithubId: c.userGithubId,
            tree: undefined
          } as P.CommitCreateManyInput;
        }) as P.Enumerable<P.CommitCreateManyInput>);

        await Alerts.create("REPOSITORY", {
          description: `Repository ${repository.fullname} was been loaded (${commitsCount?.count} commits).`,
          repositoryId: repository.id
        });
      };

      console.log("Repository is loaded: ", repositoryFullname, " - in: ", new Date().toString());
    } catch (error) {
      console.log(error);
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
                team: {
                  title: getApiQuery(query)
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
        team: {
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
                team: {
                  title: getApiQuery(query)
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
      }
    });

    if(!repository && !canReturnFalse) {
      throw new NotFoundError();
    } else if(!repository) {
      return false;
    };

    return repository;
  };
};