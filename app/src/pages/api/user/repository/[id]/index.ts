import { Repositories } from "../../../../../controllers/Repositories";
import { UnauthorizedError } from "../../../../../errors/api/UnauthorizedError";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";


async function getRepository(req: Req, res: Res) {
  const id = req.query.id;
  const user = req.user;
  
  const repository = await Repositories.get(String(id));

  if(repository && repository.ownerId === user.id) {
    return res.status(200).send(repository);
  };

  throw new UnauthorizedError();
};

export default apiHandle({
  "GET": withUser(getRepository)
});
