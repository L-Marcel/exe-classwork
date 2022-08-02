import { Prisma as P, User } from "@prisma/client";
import { NotFoundError } from "../errors/api/NotFoundError";
import { Prisma } from "../services/prisma";
import { getApiQuery } from "../utils/getApiQuery";
import { Alerts } from "./Alerts";
import { ClassroomRelations } from "./ClassroomRelations";
import { TeamRelations } from "./TeamRelations";

export class Teams {
  static async get(id: string, select?: P.TeamSelect, canReturnFalse: boolean = false): Promise<any> {
    const team = await Prisma.team.findUnique({
      where: {
        id
      },
      select
    });

    if(!team && !canReturnFalse) {
      throw new NotFoundError();
    } else if(!team) {
      return false;
    };

    return team;
  };

  static async update(user: User, id: string, members: TeamRelation[], data: P.TeamUpdateInput) {
    await TeamRelations.havePermissionsToUpdateTeam(id, user.id);

    const updatedTeam = await Prisma.team.update({
      data: {
        ...data,
        updatedAt: new Date(),
        updatedBy: user.username
      },
      where: {
        id
      }
    });

    await Alerts.create("TEAM", {
      description: `Team was been updated by ${user.username}.`,
      avatarUrl: user.avatarUrl,
      classroomId: updatedTeam.classroomId,
      teamId: updatedTeam.id
    });
      
    const relations = await Promise.all(members.map(async(m) => {
      return await TeamRelations.update(m.role, m.user, updatedTeam.id, updatedTeam.classroomId, {
        teamId: updatedTeam.id,
        userId: m.user.id
      }, false);
    }));

    return { team: updatedTeam, relations };
  };

  static async delete(user: User, id: string) {
    await TeamRelations.havePermissionsToDeleteTeam(id, user.id);

    const deletedTeam = await Prisma.team.delete({
      where: {
        id
      },
      select: {
        classroomId: true,
        title: true
      }
    });

    await Alerts.create("TEAM", {
      description: `Team ${deletedTeam.title} was been updated by ${user.username}.`,
      avatarUrl: user.avatarUrl,
      classroomId: deletedTeam.classroomId,
    });

    await Alerts.deleteAllByTeam(id);
  };

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
      }, false);
    }));

    return { team: createdTeam, relations };
  };

  static async getAllByClassroomId(classroomId: string) {
    const teams = await Prisma.team.findMany({
      include: {
        repository: {
          select: {
            name: true,
            fullname: true,
            status: true,
            _count: {
              select: {
                commits: true
              }
            }
          }
        },
        users: {
          include: {
            user: true
          }
        }
      },
      where: { 
        classroomId
      }
    });

    if(!teams) {
      throw new NotFoundError("Teams");
    };

    return teams;
  };

  static async getByClassroom(classroomId: string, userId: string, {
    query = "",
    page = 0,
    take = 12
  }) {
    const classroomRelation = await ClassroomRelations.get(
      classroomId,
      userId
    );

    const teamsAreRestricted = classroomRelation.classroom.teamsAreRestricted &&
    classroomRelation.role !== "OWNER" && classroomRelation.role !== "ADMIN";

    const relation = await Prisma.team.findMany({
      take,
      skip: 12 * page,
      include: {
        repository: {
          select: {
            name: true,
            fullname: true,
            status: true,
            homepage: true,
            _count: {
              select: {
                commits: true
              }
            }
          }
        },
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
          },
          teamsAreRestricted? {
            OR: [
              {
                users: {
                  some: {
                    userId
                  }
                }
              },
              {
                classroom: {
                  users: {
                    some: {
                      userId,
                      role: {
                        not: "STUDENT"
                      }
                    }
                  }
                }
              }
            ]
          }:undefined
        ]
      },
    });

    if(!relation) {
      throw new NotFoundError("Teams");
    };

    return relation;
  };

  static async countByClassroom(classroomId: string, userId: string, {
    query = ""
  }) {
    const classroomRelation = await ClassroomRelations.get(
      classroomId,
      userId
    );

    const teamsAreRestricted = classroomRelation.classroom.teamsAreRestricted &&
    classroomRelation.role !== "OWNER" && classroomRelation.role !== "ADMIN";

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
          },
          teamsAreRestricted? {
            OR: [
              {
                users: {
                  some: {
                    userId
                  }
                }
              },
              {
                classroom: {
                  users: {
                    some: {
                      userId,
                      role: {
                        not: "STUDENT"
                      }
                    }
                  }
                }
              }
            ]
          }:undefined
        ]
      },
    });
  };
};