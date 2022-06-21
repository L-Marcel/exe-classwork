import { Prisma as P } from "@prisma/client";
import { Alerts } from "../../../../../../controllers/Alerts";
import { Classrooms } from "../../../../../../controllers/Classrooms";
import { Commits } from "../../../../../../controllers/Commits";
import { Repositories } from "../../../../../../controllers/Repositories";
import { apiHandle } from "../../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../../utils/api/middlewares/withUser";


async function createCommits(req: Req, res: Res) {
  const { commits, id, fullname, isFinished, count } = req.body;

  console.log("Sending commits to database");
  await Commits.createMany(commits.map((c: Commit) => {
    return {
      ...c,
      repositoryId: id,
      userGithubId: c.userGithubId,
      userGithubLogin: c.userGithubLogin,
      commitedAt: c.commitedAt,
      order: c.order
    } as P.CommitCreateManyInput;
  }) as P.Enumerable<P.CommitCreateManyInput>).then(r => r).catch(e => console.log(e));

  if(isFinished) {
    await Repositories.changeStatus(id, "LOADED");
    await Alerts.create("REPOSITORY", {
      description: `Repository ${fullname} was been loaded (${count} commits).`,
      repositoryId: id
    });
    
    console.log("Repository is loaded: ", fullname, " - in: ", new Date().toString());

    const classrooms = await Classrooms.getByRepository(id);

    res.unstable_revalidate(`/repositories/${fullname?.toLocaleLowerCase()}`)
    .then(() => console.log("Repository revalidated: " + fullname))
    .catch(err => console.log(err));

    for(let c in classrooms) {
      const classroom = classrooms[c];

      res.unstable_revalidate(`/app/classrooms/${classroom.id}`)
      .then(() => console.log("Classroom revalidated: " + classroom.id))
      .catch(err => console.log(err));
    };
  };

  return res.status(200).send("");
};

export default apiHandle({
  "POST": withUser(createCommits)
});
