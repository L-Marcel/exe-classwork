import { Repositories } from "../../../../controllers/Repositories";
import { apiHandle } from "../../../../utils/api/apiHandle";

async function getRepository(req: Req, res: Res) {
  const { username, repository: name } = req.query;

  const repository = await Repositories.getByFullname(`${username?.toString()}/${name?.toString()}`);

  return res.status(200).json(repository);
};

export default apiHandle({
  "GET": getRepository
});
