import { Prisma as P, User } from "@prisma/client";
import { NotFoundError } from "../errors/api/NotFoundError";
import { Prisma } from "../services/prisma";
import { getApiQuery } from "../utils/getApiQuery";
import { Alerts } from "./Alerts";
import { TeamRelations } from "./TeamRelations";

export class Teams {
  static async create(
    user: User,
    classroomId: string,
    members: TeamRelation[],
    data: P.TeamCreateInput
  ) {
    const createdTeam = await Prisma.team.create({
      data: {
        ...data,
        classroom: {
          connect: {
            id: classroomId
          }
        }
      }
    });

    await Alerts.create("TEAM", {
      description: `Team was been created by ${user.username}.`,
      avatarUrl: user.avatarUrl,
      classroomId,
      teamId: createdTeam.id
    });

    const relations = await Promise.all(members.map(async(m) => {
      return await TeamRelations.create(m.role, m.user, classroomId, {
        teamId: createdTeam.id,
        userId: m.user.id
      });
    }));

    return { createdTeam, relations };
  };

  static async getByClassroom(classroomId: string, {
    query = "",
    page = 0,
    take = 12
  }) {
    const relation = await Prisma.team.findMany({
      take,
      skip: 12 * page,
      include: {
        users: {
          include: {
            user: true
          }
        }
      },
      where: {
        AND: [
          {
            OR: [
              {
                title: getApiQuery(query)
              },
              {
                repository: {
                  name: getApiQuery(query)
                }
              },
              {
                users: {
                  some: {
                    role: "LEADER",
                    user: {
                      name: getApiQuery(query),
                    }
                  }
                }
              },
              {
                users: {
                  some: {
                    role: "LEADER",
                    user: {
                      username: getApiQuery(query),
                    }
                  }
                }
              }
            ]
          },
          { 
            classroomId
          }
        ]
      },
    });

    if(!relation) {
      throw new NotFoundError("Teams");
    };

    return relation;
  };

  static async countByClassroom(classroomId: string, {
    query = ""
  }) {
    return await Prisma.team.aggregate({
      _count: {
        _all: true
      },
      where: {
        AND: [
          {
            OR: [
              {
                title: getApiQuery(query)
              },
              {
                repository: {
                  name: getApiQuery(query)
                }
              },
              {
                users: {
                  some: {
                    role: "LEADER",
                    user: {
                      name: getApiQuery(query),
                    }
                  }
                }
              },
              {
                users: {
                  some: {
                    role: "LEADER",
                    user: {
                      username: getApiQuery(query),
                    }
                  }
                }
              }
            ]
          },
          { 
            classroomId
          }
        ]
      },
    });
  };
};