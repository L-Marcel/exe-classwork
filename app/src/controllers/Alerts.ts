import { Prisma as P } from "@prisma/client";
import { Prisma } from "../services/prisma";
import { getApiAlertsType, getApiQuery } from "../utils/getApiQuery";
import { getIsBeta } from "../utils/getIsBeta";

export class Alerts {
  static async create(type: AlertTypes, data: Omit<P.AlertUncheckedCreateInput, "type">) {
    const isBeta = getIsBeta();

    if(isBeta) {
      return;
    };

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

  static async deleteAllByTeam(teamId: string) {
    return await Prisma.alert.deleteMany({
      where: {
        teamId
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
            title: true,
            id: true
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

  static async getByUserInClassroom(userId: string, classroomId: string, {
    page = 0,
    query = "",
    updateVisualizedBy = false
  }) {
    const alerts = await Prisma.alert.findMany({
      take: 12,
      skip: 12 * page,
      orderBy: {
        createdAt: "desc",
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
          },
          {
            classroomId
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
            title: true,
            id: true
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

  static async countByUserInClassroom(userId: string, classroomId: string, {
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
          },
          {
            classroomId
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

  static async countNotVisualizedByUserInClassroom(userId: string, classroomId: string, {
    query = ""
  }) {
    //Prisma aggregate is not return the current count...
    //So I make a query to get the count to filter the alerts
    const alerts = await this.getByUser(userId, { query });
    return alerts.filter(a => !a.visualizedBy.includes(userId) && a.classroom.id === classroomId).length;
  };
};