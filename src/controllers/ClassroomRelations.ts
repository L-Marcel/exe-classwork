import { Prisma as P, User } from "@prisma/client";
import { AlreadyLinkedError } from "../errors/api/AlreadyLinkedError";
import { NotFoundError } from "../errors/api/NotFoundError";
import { UnauthorizedError } from "../errors/api/UnauthorizedError";
import { Prisma } from "../services/prisma";
import { getApiQuery } from "../utils/getApiQuery";
import { Alerts } from "./Alerts";

export class ClassroomRelations {
  static async get(classroomId: string, userId: string) {
    const relation = await Prisma.classroomRelation.findUnique({
      where: {
        classroomId_userId: {
          classroomId,
          userId
        }
      },
      select: {
        classroom: true,
        user: true,
        role: true
      }
    });


    if(!relation) {
      throw new NotFoundError("Member");
    };

    return relation;
  };

  static async getByClassroom(classroomId: string, userId: string, {
    query = "",
    page = 0,
    take = 12
  }) {
    const classroomRelation = await Prisma.classroomRelation.findUnique({
      where: {
        classroomId_userId: {
          classroomId,
          userId
        }
      },
      select: {
        classroom: {
          select: {
            rolesAreRestricted: true
          }
        },
        role: true
      }
    });

    const rolesAreRestricted = classroomRelation.classroom.rolesAreRestricted &&
    classroomRelation.role !== "OWNER" && classroomRelation.role !== "ADMIN";

    const relation = await Prisma.classroomRelation.findMany({
      take,
      skip: 12 * page,
      select: {
        role: !rolesAreRestricted,
        createdAt: true,
        updatedAt: true,
        updatedBy: true,
        user: true
      },
      where: {
        AND: [
          {
            OR: [
              !rolesAreRestricted? {
                role: getApiQuery(query)
              }:undefined,
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
          { classroomId }
        ]
      },
    });

    if(!relation) {
      throw new NotFoundError("Members");
    };

    return relation;
  };

  static async countByClassroom(classroomId: string, {
    query = ""
  }) {
    return await Prisma.classroomRelation.aggregate({
      _count: {
        _all: true
      },
      where: {
        AND: [
          {
            OR: [
              {
                role: getApiQuery(query)
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
          { classroomId }
        ]
      },
    });
  };

  static async isAlreadyLinked(user: User, classroomId: string) {
    const currentRelation = await Prisma.classroomRelation.findFirst({
      where: {
        userId: user.id,
        classroomId
      }
    });

    if(!currentRelation) {
      return false;
    };

    throw new AlreadyLinkedError("classroom");
  };

  static async create(
    role: ClassroomRoles,
    user: User,
    data: Omit<P.ClassroomRelationUncheckedCreateInput, "role">
  ) {
    await this.isAlreadyLinked(user, data.classroomId);

    const relation = await Prisma.classroomRelation.create({
      data: {
        ...data,
        role
      }
    });

    if(role !== "OWNER") {
      await Alerts.create("CLASSROOM_RELATION", {
        description: `Classroom have a new ${role.toLowerCase()}: Welcome, ${user?.username}!`,
        avatarUrl: user?.avatarUrl,
        classroomId: relation.classroomId
      });
    };

    return relation;
  };

  static async havePermissionsToSelectClassrroomValues(
    classroomId: string,
    userId: string
  ): Promise<P.ClassroomSelect> {
    const relation = await Prisma.classroomRelation.findFirst({
      where: {
        userId,
        classroomId
      },
      select: {
        role: true,
        classroom: {
          select: {
            inviteCodeIsRestricted: true,
            teamsAreRestricted: true,
            rolesAreRestricted: true,
            repositoriesAreRestricted: true
          }
        }
      }
    });

    if(!relation) {
      throw new UnauthorizedError();
    };

    switch(relation.role as ClassroomRoles) {
      case "OWNER":
      case "ADMIN":
        return {
          id: true,
          inviteCode: true,
          createdAt: true,
          updatedAt: true,
          updatedBy: true,
          alerts: true,
          subject: true,
          description: true,
          repositories: true,
          title: true,
          inviteCodeIsRestricted: true,
          rolesAreRestricted: true,
          teamsAreRestricted: true,
          repositoriesAreRestricted: true,
          teams: {
            select: {
              users: {
                select: {
                  user: true,
                  role: true,
                  createdAt: true,
                  updatedAt: true,
                  updatedBy: true
                }
              },
              createdAt: true,
              updatedAt: true,
              updatedBy: true
            }
          },
          users: {
            select: {
              user: true,
              role: true,
              createdAt: true,
              updatedAt: true,
              updatedBy: true
            }
          }
        };
      case "OBSERVER":
        return {
          id: true,
          alerts: true,
          subject: true,
          description: true,
          repositories: true,
          inviteCode: !relation.classroom.inviteCodeIsRestricted,
          inviteCodeIsRestricted: true,
          rolesAreRestricted: true,
          teamsAreRestricted: true,
          repositoriesAreRestricted: true,
          title: true,
          teams: {
            select: {
              users: {
                select: {
                  user: true,
                  role: true,
                  createdAt: true,
                  updatedAt: true,
                  updatedBy: true
                }
              },
              createdAt: true,
              updatedAt: true,
              updatedBy: true
            }
          },
          users: {
            select: {
              user: true,
              role: !relation.classroom.rolesAreRestricted,
              createdAt: true,
              updatedAt: true,
              updatedBy: true
            }
          }
        };
      case "STUDENT":
        return {
          id: true,
          inviteCode: !relation.classroom.inviteCodeIsRestricted,
          inviteCodeIsRestricted: true,
          rolesAreRestricted: true,
          teamsAreRestricted: true,
          repositoriesAreRestricted: true,
          alerts: {
            where: {
              OR: [
                {
                  repository: {
                    ownerId: userId
                  }
                },
                {
                  repository: {
                    team: {
                      users: {
                        some: {
                          userId
                        }
                      }
                    }
                  }
                },
                {
                  team: {
                    users: {
                      some: {
                        userId
                      }
                    }
                  }
                }
              ]
            }
          },
          teams: {
            select: {
              users: {
                select: {
                  user: true,
                  role: true,
                  createdAt: true,
                  updatedAt: true,
                  updatedBy: true
                }
              },
              createdAt: true,
              updatedAt: true,
              updatedBy: true
            },
            where: relation.classroom.teamsAreRestricted? {
              users: {
                some: {
                  userId
                }
              }
            }:undefined
          },
          repositories: !relation.classroom.repositoriesAreRestricted || {
            where: {
              ownerId: userId
            }
          },
          subject: true,
          description: true,
          title: true,
          users: {
            select: {
              user: true,
              role: !relation.classroom.rolesAreRestricted,
              createdAt: true,
              updatedAt: true,
              updatedBy: true
            }
          }
        };
      default:
        throw new UnauthorizedError();
    };
  };

  static async havePermissionsToUpdateClassrroom(
    classroomId: string,
    userId: string
  ) {
    const relation = await Prisma.classroomRelation.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                role: "OWNER" as ClassroomRoles
              },
              {
                role: "ADMIN" as ClassroomRoles
              }
            ]
          },
          {
            userId,
            classroomId
          }
        ]
      }
    });

    if(!relation) {
      throw new UnauthorizedError();
    };

    return true;
  };

  static async havePermissionsToDeleteClassrroom(
    classroomId: string,
    userId: string
  ) {
    const relation = await Prisma.classroomRelation.findFirst({
      where: {
        role: "OWNER" as ClassroomRoles,
        userId,
        classroomId
      }
    });

    if(!relation) {
      throw new UnauthorizedError();
    };

    return true;
  };

  static async havePermissionsToGenerateClassrroomInviteCode(
    classroomId: string,
    userId: string
  ) {
    const relation = await Prisma.classroomRelation.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                role: "OWNER" as ClassroomRoles
              },
              {
                role: "ADMIN" as ClassroomRoles
              }
            ]
          },
          {
            userId,
            classroomId
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