import { Prisma as P, User } from "@prisma/client";
import { AlreadyLinkedError } from "../errors/api/AlreadyLinkedError";
import { UnauthorizedError } from "../errors/api/UnauthorizedError";
import { Prisma } from "../services/prisma";
import { Alerts } from "./Alerts";

export class ClassroomRelations {
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
        role: true
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
          teams: true,
          repository: true,
          title: true,
          users: true
        };
      case "OBSERVER":
        return {
          id: true,
          alerts: true,
          subject: true,
          description: true,
          teams: true,
          repository: true,
          title: true,
          users: true
        };
      case "STUDENT":
        return {
          id: true,
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
            where: {
              users: {
                some: {
                  userId
                }
              }
            }
          },
          repository: {
            where: {
              ownerId: userId
            }
          },
          subject: true,
          description: true,
          title: true,
          users: true
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