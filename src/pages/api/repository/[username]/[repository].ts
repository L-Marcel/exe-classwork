import { Repositories } from "../../../../controllers/Repositories";
import { apiHandle } from "../../../../utils/api/apiHandle";

async function getRepository(req: Req, res: Res) {
  const { username, repository: name, justLoaded } = req.query;

  const repository = await Repositories.getByFullname(`${username?.toString()}/${name?.toString()}`);

  if(new Boolean(justLoaded) && repository.status !== "LOADED") {
    return res.status(404).json({});
  };

  return res.status(200).json(repository);
};

export default apiHandle({
  "GET": getRepository
});
