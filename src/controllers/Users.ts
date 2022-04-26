import { Prisma as P } from "@prisma/client";
import { AuthUserNotFoundError } from "../errors/api/AuthUserNotFoundError";
import { NotFoundError } from "../errors/api/NotFoundError";
import { Cookies } from "../services/cookies";
import { Github } from "../services/github";
import { Prisma } from "../services/prisma";

export class Users {
  static async getAll() {
    return await Prisma.user.findMany({
      select: {
        id: true
      },
    });
  };
  static async get(id: string, canReturnFalse: boolean = false) {
    const user = await Prisma.user.findUnique({
      where: {
        id
      }
    });

    if(!user && !canReturnFalse) {
      throw new NotFoundError("User");
    } else if(!user) {
      return false;
    };

    return user;
  };
  
  static async create(data: P.UserCreateInput) {
    return await Prisma.user.create({
      data,
    });
  };

  static async update(id: string, data: P.UserUpdateInput) {
    return await Prisma.user.update({
      where: {
        id
      },
      data
    });
  };

  static async getByGithubId(githubId: string) {
    return await Prisma.user.findUnique({
      where: {
        githubId
      }
    });
  };

  static async getById(id: string) {
    return await Prisma.user.findUnique({
      where: {
        id
      }
    });
  };
  
  static async getUserByToken({ req, res }: ServerCookieParams, token?: string) {
    if(!token) {
      token = Cookies.get("token", { req, res });
    };

    const data = await Github.checkIfTokenIsValid(token);

    const user = await Prisma.user.findUnique({
      where: {
        githubId: data?.id?.toString() ?? ""
      }
    });

    if(!user) {
      throw new AuthUserNotFoundError(data);
    };

    return user;
  };

  static async updateInstallation(where: P.UserWhereUniqueInput, installationId: string) {
    return await Prisma.user.update({
      where,
      data: {
        installationId
      }
    });
  };
};
