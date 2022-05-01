import { Github } from "../../../../../../services/github";
import { apiHandle } from "../../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../../utils/api/middlewares/withUser";

async function repositories(req: Req, res: Res) {
  const { id } = req.query;

  const repositories = await Github.getAllRepositoriesByClassroomMembers(id?.toString());

  return res.status(200).json(repositories);
};


export default apiHandle({
  "GET": withUser(repositories)
});