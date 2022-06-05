import { Github } from "../../../../services/github";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function repositories(req: Req, res: Res) {
  const user = req.user;

  const github = new Github(req, res);

  const repositories = await github.getAllRepositoriesByUser(user);

  return res.status(200).json(repositories);
};


export default apiHandle({
  "GET": withUser(repositories)
});