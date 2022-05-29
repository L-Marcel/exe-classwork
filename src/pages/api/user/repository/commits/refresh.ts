import { Repositories } from "../../../../../controllers/Repositories";
import { Github } from "../../../../../services/github";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";

async function refreshCommits(req: Req, res: Res) {
  const { repositoryFullname } = req.body;

  const id = await Repositories.sync(String(repositoryFullname), true);
  const appToken = await Github.generateAppAccessToken(req.user.installationId);

  return res.status(200).json({
    id,
    appToken
  });
};

export default apiHandle({
  "POST": withUser(refreshCommits)
});
