import { Prisma as P } from "@prisma/client/edge";
import { Prisma } from "../services/prisma";
import { getApiAlertsType, getApiQuery } from "../utils/getApiQuery";

export class Alerts {
  static async create(type: AlertTypes, data: Omit<P.AlertUncheckedCreateInput, "type">) {
    return await Prisma.alert.create({
      data: {
        ...data,
        type
      }
    });
  };
  
  static async deleteAllByClassroom(classroomId: string) {
    return await Prisma.alert.deleteMany({
      where: {
        classroomId
      }
    });
  };

  static async getByUser(userId: string, {
    page = 0,
    query = "",
    updateVisualizedBy = false
  }) {
    const alerts = await Prisma.alert.findMany({
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
                commit: {
                  message: getApiQuery(query)
                }
              },
              {
                repository: {
                  name: getApiQuery(query)
                }
              },
              {
                repository: {
                  fullname: getApiQuery(query)
                }
              },
              {
                team: {
                  title: getApiQuery(query)
                }
              },
              {
                description: getApiQuery(query)
              },
              {
                type: getApiAlertsType(query)
              }
            ]
          },
          {
            OR: [
              {
                classroom: {
                  users: {
                    some: {
                      userId,
                      role: "OWNER"
                    }
                  }
                }
              },
              {
                classroom: {
                  users: {
                    some: {
                      userId,
                      role: "ADMIN"
                    }
                  }
                }
              },
              {
                classroom: {
                  users: {
                    some: {
                      userId,
                      role: "OBSERVER"
                    }
                  }
                }
              },
              {
                commit: {
                  repository: {
                    ownerId: userId
                  }
                }
              },
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
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        description: true,
        avatarUrl: true,
        createdAt: true,
        type: true,
        visualizedBy: true,
        team: {
          select: {
            title: true
          }
        },
        repository: {
          select: {
            fullname: true
          }
        },
        classroom: {
          select: {
            title: true
          }
        },
        commit: {
          select: {
            message: true
          }
        }
      }
    });

    if(updateVisualizedBy) {
      await Prisma.alert.updateMany({
        data: {
          visualizedBy: {
            push: userId
          }
        },
        where: {
          id: {
            in: alerts.filter(a => !a.visualizedBy.includes(userId)).map(a => a.id)
          },
        }
      }).then(res => res).catch(err => console.log(err));
    };

    return alerts;
  };

  static async countByUser(userId: string, {
    query = ""
  }) {
    return await Prisma.alert.aggregate({
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
                commit: {
                  message: getApiQuery(query)
                }
              },
              {
                repository: {
                  name: getApiQuery(query)
                }
              },
              {
                repository: {
                  fullname: getApiQuery(query)
                }
              },
              {
                team: {
                  title: getApiQuery(query)
                }
              },
              {
                description: getApiQuery(query)
              },
              {
                type: getApiAlertsType(query)
              }
            ]
          },
          {
            OR: [
              {
                classroom: {
                  users: {
                    some: {
                      userId,
                      role: "OWNER"
                    }
                  }
                }
              },
              {
                classroom: {
                  users: {
                    some: {
                      userId,
                      role: "ADMIN"
                    }
                  }
                }
              },
              {
                classroom: {
                  users: {
                    some: {
                      userId,
                      role: "OBSERVER"
                    }
                  }
                }
              },
              {
                commit: {
                  repository: {
                    ownerId: userId
                  }
                }
              },
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
              }
            ]
          }
        ]
      },
    });
  };

  static async countNotVisualizedByUser(userId: string, {
    query = ""
  }) {
    //Prisma aggregate is not return the current count...
    //So I make a query to get the count to filter the alerts
    const alerts = await this.getByUser(userId, { query });
    return alerts.filter(a => !a.visualizedBy.includes(userId)).length;
  };
};