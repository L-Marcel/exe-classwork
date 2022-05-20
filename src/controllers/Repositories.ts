import { Prisma as P } from "@prisma/client";
import { NotFoundError } from "../errors/api/NotFoundError";
import { GithubCommits } from "../services/commits";
import { Prisma } from "../services/prisma";
import { writeLog } from "../utils/writeLog";
import { Commits } from "./Commits";

export class Repositories {
  static async link({
    repository,
    classroomId,
    teamId
  }: RepositoriesLinkInput) {
    const repositoryAlreadyExists = await Prisma.repository.findFirst({
      where: {
        OR: [
          {
            id: repository.id || ""
          },
          {
            fullname: repository.fullname || ""
          }
        ]
      },
      select: {
        id: true
      }
    });

    if(repositoryAlreadyExists) {
      return await Prisma.repository.update({
        data: {
          classroom: classroomId? {
            connect: {
              id: classroomId
            }
          }:undefined,
          team: teamId? {
            connect: {
              id: teamId
            }
          }:undefined
        },
        where: {
          id: repositoryAlreadyExists.id
        }
      });
    } else {
      return await this.create({
        ...repository,
        classroom: classroomId? {
          connect: {
            id: classroomId
          }
        }:undefined,
        team: teamId? {
          connect: {
            id: teamId
          }
        }:undefined
      });
    };
  };

  static async create(data: P.RepositoryCreateInput) {
    return await Prisma.repository.create({
      data
    });
  };

  static async sync(authUserId: string, repositoryFullname: string, force = false) {
    try {
      if(force) {
        const ghCommits = new GithubCommits("sync", { authUserId, repositoryFullname });

        const commits = await ghCommits.getRepositoryCommits(authUserId, repositoryFullname);
        const files = await ghCommits.getCommitsFiles(authUserId, repositoryFullname, commits);
        writeLog({ name: "files", files });

        const repository = await Prisma.repository.findUnique({
          where: {
            fullname: repositoryFullname
          },
          select: {
            id: true
          }
        });

        if(!repository) {
          throw new NotFoundError("Repository");
        };

        await Commits.createMany(commits.map((c: Commit) => {
          return {
            ...c,
            repositoryId: repository.id,
            userGithubId: c.userGithubId,
            tree: undefined
          } as P.CommitCreateManyInput;
        }) as P.Enumerable<P.CommitCreateManyInput>);
      };

      console.log("Repository is loaded: ", repositoryFullname, " - in: ", new Date().toString());
    } catch (error) {
      console.log(error);
    };
  };
};