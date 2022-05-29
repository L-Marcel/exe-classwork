import { Repositories } from "../../../../../controllers/Repositories";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";

async function getRepository(req: Req, res: Res) {
  const { id } = req.query;

  const repository = await Repositories.get(id?.toString());

  return res.status(200).json(repository);
};

export default apiHandle({
  "GET": withUser(getRepository)
});
