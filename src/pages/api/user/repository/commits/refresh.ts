import { Repositories } from "../../../../../controllers/Repositories";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";

async function refreshCommits(req: Req, res: Res) {
  const { repositoryFullname } = req.body;

  const id = await Repositories.sync(String(repositoryFullname), true);

  return res.status(200).json({
    id
  });
};

export default apiHandle({
  "POST": withUser(refreshCommits)
});
