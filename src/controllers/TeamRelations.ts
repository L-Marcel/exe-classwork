import { Prisma as P, User } from "@prisma/client";
import { AlreadyLinkedError } from "../errors/api/AlreadyLinkedError";
import { NotFoundError } from "../errors/api/NotFoundError";
import { UnauthorizedError } from "../errors/api/UnauthorizedError";
import { Prisma } from "../services/prisma";
import { getApiQuery, getApiTeamRole } from "../utils/getApiQuery";
import { Alerts } from "./Alerts";

export class TeamRelations {
  static async isAlreadyLinked(user: User, teamId: string) {
    const currentRelation = await Prisma.teamRelation.findFirst({
      where: {
        userId: user.id,
        teamId
      }
    });

    if(!currentRelation) {
      return false;
    };

    throw new AlreadyLinkedError("team");
  };

  static async create(
    role: TeamRoles,
    user: User,
    classroomId: string,
    data: Omit<P.TeamRelationUncheckedCreateInput, "role">,
    needAlert = false
  ) {
    await this.isAlreadyLinked(user, data.teamId);

    const relation = await Prisma.teamRelation.create({
      data: {
        ...data,
        role
      }
    });

    if(needAlert) {
      await Alerts.create("TEAM_RELATION", {
        description: `Team have a new ${role.toLowerCase()}: Welcome, ${user?.username}!`,
        avatarUrl: user?.avatarUrl,
        teamId: relation.teamId,
        classroomId
      });
    };

    return relation;
  };

  static async update(
    role: TeamRoles,
    user: User,
    teamId: string,
    classroomId: string,
    data: Omit<P.TeamRelationUncheckedCreateInput, "role">,
    needAlert = false
  ) {
    const relation = await Prisma.teamRelation.update({
      data: {
        ...data,
        role
      },
      where: {
        teamId_userId: {
          userId: user.id,
          teamId
        }
      }
    });


    try {
      await this.isAlreadyLinked(user, data.teamId);
      
      if(needAlert) {
        await Alerts.create("TEAM_RELATION", {
          description: `Team have a new ${role.toLowerCase()}: Welcome, ${user?.username}!`,
          avatarUrl: user?.avatarUrl,
          teamId: relation.teamId,
          classroomId
        });
      };
    } catch(err) {};

    return relation;
  };

  static async getByTeam(teamId: string, classroomId: string, {
    query = "",
    page = 0,
    take = 12
  }) {
    const relation = await Prisma.teamRelation.findMany({
      take,
      skip: 12 * page,
      select: {
        role: true,
        createdAt: true,
        updatedAt: true,
        updatedBy: true,
        user: true
      },
      where: {
        AND: [
          {
            OR: [
              {
                role: getApiTeamRole(query)
              },
              {
                user: {
                  name: getApiQuery(query)
                }
              },
              {
                user: {
                  username: getApiQuery(query)
                }
              },
              {
                user: {
                  email: getApiQuery(query)
                }
              }
            ]
          },
          { teamId, team: {
            classroomId
          } }
        ]
      },
    });

    if(!relation) {
      throw new NotFoundError("Members");
    };

    return relation;
  };

  static async countByTeam(teamId: string, classroomId: string, {
    query = ""
  }) {
    return await Prisma.teamRelation.aggregate({
      _count: {
        _all: true
      },
      where: {
        AND: [
          {
            OR: [
              {
                role: getApiTeamRole(query)
              },
              {
                user: {
                  name: getApiQuery(query)
                }
              },
              {
                user: {
                  username: getApiQuery(query)
                }
              },
              {
                user: {
                  email: getApiQuery(query)
                }
              }
            ]
          },
          { teamId, team: {
            classroomId
          } }
        ]
      },
    });
  };

  static async havePermissionsToUpdateTeam(
    teamId: string,
    userId: string
  ) {
    const relation = await Prisma.teamRelation.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                role: "LEADER"
              },
              {
                team: {
                  classroom: {
                    users: {
                      some: {
                        role: "OWNER",
                        userId
                      }
                    }
                  }
                }
              },
              {
                team: {
                  classroom: {
                    users: {
                      some: {
                        role: "ADMIN",
                        userId
                      }
                    }
                  }
                }
              }
            ]
          },
          {
            userId,
            teamId
          }
        ]
      }
    });

    if(!relation) {
      throw new UnauthorizedError();
    };

    return true;
  };

  static async havePermissionsToDeleteTeam(
    teamId: string,
    userId: string
  ) {
    const relation = await Prisma.teamRelation.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                role: "LEADER"
              },
              {
                team: {
                  classroom: {
                    users: {
                      some: {
                        role: "OWNER",
                        userId
                      }
                    }
                  }
                }
              },
              {
                team: {
                  classroom: {
                    users: {
                      some: {
                        role: "ADMIN",
                        userId
                      }
                    }
                  }
                }
              }
            ]
          },
          {
            userId,
            teamId
          }
        ]
      }
    });

    if(!relation) {
      throw new UnauthorizedError();
    };

    return true;
  };

};