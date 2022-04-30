import { Prisma as P, User } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { NotFoundError } from "../errors/api/NotFoundError";
import { Prisma } from "../services/prisma";
import { getApiQuery } from "../utils/getApiQuery";
import { Alerts } from "./Alerts";
import { ClassroomRelations } from "./ClassroomRelations";

export class Classrooms {
  static async get(id: string, select?: P.ClassroomSelect, canReturnFalse: boolean = false) {
    const classroom = await Prisma.classroom.findUnique({
      where: {
        id
      },
      select
    });

    if(!classroom && !canReturnFalse) {
      throw new NotFoundError();
    } else if(!classroom) {
      return false;
    };

    return classroom;
  };

  static async create(user: User, data: P.ClassroomCreateInput) {
    const createdClassroom = await Prisma.classroom.create({
      data
    });

    await ClassroomRelations.create("OWNER", user, {
      classroomId: createdClassroom.id,
      userId: user.id
    });

    await Alerts.create("CLASSROOM", {
      description: `Classroom was been created by ${user.username}.`,
      avatarUrl: user.avatarUrl,
      classroomId: createdClassroom.id
    });
      
    return createdClassroom;
  };

  static async update(user: User, id: string, data: P.ClassroomUpdateInput) {
    await ClassroomRelations.havePermissionsToUpdateClassrroom(id, user.id);

    const updatedClassroom = await Prisma.classroom.update({
      data: {
        ...data,
        updatedAt: new Date(),
        updatedBy: user.username
      },
      where: {
        id
      }
    });

    await Alerts.create("CLASSROOM", {
      description: `Classroom was been updated by ${user.username}.`,
      avatarUrl: user.avatarUrl,
      classroomId: updatedClassroom.id
    });
      
    return updatedClassroom;
  };

  static async delete(user: User, id: string) {
    await Promise.all([
      ClassroomRelations.havePermissionsToDeleteClassrroom(id, user.id),
      Prisma.classroom.delete({
        where: {
          id
        }
      }),
      Alerts.deleteAllByClassroom(id)
    ]);
  };

  static async generateInviteCode(user: User, id: string) {
    await ClassroomRelations.havePermissionsToGenerateClassrroomInviteCode(id, user.id);

    const data = await Prisma.classroom.update({
      data: {
        inviteCode: uuid(),
        updatedAt: new Date(),
        updatedBy: user.username
      },
      where: {
        id
      },
      select: {
        id: true,
        inviteCode: true
      }
    });

    await Alerts.create("CLASSROOM", {
      description: `New invite code was generated by ${user.username}.`,
      avatarUrl: user.avatarUrl,
      classroomId: data.id
    });

    return data;
  };

  static async getByInviteCode(inviteCode: string) {
    const classroom = await Prisma.classroom.findUnique({
      where: {
        inviteCode
      },
      select: {
        id: true
      }
    });

    if(!classroom) {
      throw new NotFoundError("Classroom");
    };

    return classroom;
  };

  static async getByUser(userId: string, {
    page = 0,
    query = ""
  }) {
    return await Prisma.classroom.findMany({
      take: 12,
      skip: 12 * page,
      where: {
        AND: [
          {
            OR: [
              {
                title: getApiQuery(query)
              },
              {
                subject: getApiQuery(query)
              }
            ]
          },
          {
            users: {
              some: {
                userId
              }
            }
          }
        ]
      },
      select: {
        description: true,
        id: true,
        subject: true,
        title: true,
        alerts: {
          select: {
            id: true
          },
          where: {
            OR: [
              {
                repository: {
                  ownerId: userId
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
              },
              {
                type: "CLASSROOM_RELATION",
                classroom: {
                  users: {
                    some: {
                      OR: [
                        {
                          userId,
                          role: "OWNER"
                        },
                        {
                          userId,
                          role: "ADMIN"
                        },
                        {
                          userId,
                          role: "OBSERVER"
                        }
                      ]
                    }
                  }
                }
              },
              {
                type: "CLASSROOM",
                classroom: {
                  users: {
                    some: {
                      userId
                    }
                  }
                }
              }
            ]
          }
        }
      }
    });
  };

  static async countByUser(userId: string, {
    query = ""
  }) {
    return await Prisma.classroom.aggregate({
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
                subject: getApiQuery(query)
              }
            ]
          },
          {
            users: {
              some: {
                userId
              }
            }
          }
        ]
      },
    });
  };
};