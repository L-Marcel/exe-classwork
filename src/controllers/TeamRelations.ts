import { Prisma as P, User } from "@prisma/client/edge";
import { AlreadyLinkedError } from "../errors/api/AlreadyLinkedError";
import { Prisma } from "../services/prisma";
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
};