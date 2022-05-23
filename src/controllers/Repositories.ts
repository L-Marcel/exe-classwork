import { CodeAnalytic } from "@lmarcel/exe-code-analytics";
import { Prisma as P } from "@prisma/client";
import { NotFoundError } from "../errors/api/NotFoundError";
import { Directory } from "../services/directory";
import { Prisma } from "../services/prisma";
import { blobToString } from "../utils/blobToString";
import { Commits } from "./Commits";
import { Trees } from "./Trees";

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
        const commits = await Directory.getRepositoryCommits(authUserId, repositoryFullname);
        const commitsWithfiles = await Directory.getCommitsFiles(authUserId, repositoryFullname, commits);

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

        const allFiles = commitsWithfiles.reduce((prev, cur) => {
          prev = [ ...prev, ...cur ];

          return prev;
        }, []);

        console.log("Starting code analytic...");

        const analytics = new CodeAnalytic<Partial<Tree>>(allFiles.map(f => {
          return {
            content: blobToString(f.blob, f.encoding),
            path: f.path,
            blob: f.blob,
            commitSha: f.commitSha,
            encoding: f.encoding,
            sha: f.sha,
            type: f.type,
            url: f.url
          };
        }));

        const analyticResult = analytics.execute();

        console.log("Starting create files function...");

        if(process.env.NODE_ENV === "development") {
          await Trees.createMany(analyticResult.map(f => {
            //Typescript problems
            return {
              commitSha: f.commitSha,
              path: f.path,
              sha: f.sha,
              type: f.type,
              url: f.url,
              blob: f.blob,
              churn: f.churn,
              classes: f.classes.all,
              complexity: f.complexity,
              encoding: f.encoding,
              methods: f.methods.all,
              sloc: f.sloc
            };
          }));
        };
      };

      console.log("Repository is loaded: ", repositoryFullname, " - in: ", new Date().toString());
    } catch (error) {
      console.log(error);
    };
  };
};