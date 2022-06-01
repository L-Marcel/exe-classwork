import { Repositories } from "../../../../../controllers/Repositories";
import { apiHandle } from "../../../../../utils/api/apiHandle";

async function getRepository(req: Req, res: Res) {
  const { id } = req.query;

  const repository = await Repositories.get(id?.toString());

  return res.status(200).json(repository);
};

export default apiHandle({
  "GET": getRepository
});
