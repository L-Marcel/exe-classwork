import { Repositories } from "../../../../../controllers/Repositories";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";

async function refreshCommits(req: Req, res: Res) {
  const user = req.user;
  const token = req.token;

  const { repositoryFullname } = req.body;

  console.log(user.id, token, repositoryFullname);
  await Repositories.sync(user.id, token, String(repositoryFullname), true);

  return res.status(200).send("");
};

export default apiHandle({
  "POST": withUser(refreshCommits)
});
