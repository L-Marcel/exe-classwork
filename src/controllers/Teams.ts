import { Prisma as P, User } from "@prisma/client";
import { Prisma } from "../services/prisma";
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
};