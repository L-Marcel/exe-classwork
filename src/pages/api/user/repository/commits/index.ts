/* */

import { Prisma as P } from "@prisma/client";
import { Alerts } from "../../../../../controllers/Alerts";
import { Commits } from "../../../../../controllers/Commits";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";

async function createCommits(req: Req, res: Res) {
  const { commits, id, fullname } = req.body;

  console.log("Sending commits to database");
  const commitsCount = await Commits.createMany(commits.map((c: Commit) => {
    return {
      ...c,
      repositoryId: id,
      userGithubId: c.userGithubId,
      tree: undefined
    } as P.CommitCreateManyInput;
  }) as P.Enumerable<P.CommitCreateManyInput>);

  await Alerts.create("REPOSITORY", {
    description: `Repository ${fullname} was been loaded (${commitsCount?.count} commits).`,
    repositoryId: id
  });

  console.log("Repository is loaded: ", fullname, " - in: ", new Date().toString());
  return res.status(200).send("");
};

export default apiHandle({
  "POST": withUser(createCommits)
});
