import { Repositories } from "../../../../controllers/Repositories";
import { RepositoryValidation } from "../../../../services/api/validations/RepositoryValidation";
import { ServerSocket } from "../../../../services/serverSocket";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { validate } from "../../../../utils/api/middlewares/validate";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function createRepository(req: Req, res: Res) {
  const data = req.body;
  const user = req.user;
  
  const repository = await Repositories.create({ ...data, 
    owner: undefined,
    ownerId: data?.owner?.id 
  });
  
  await ServerSocket.getSocket(user.id, req.token)
  .then(socket => {
    console.log("Socket created: ", socket.id);
    socket.emit("@repostory/commits/refresh", {
      repositoryFullname: repository.fullname,
      token: req.token,
      userId: user.id
    });
  }).catch(err => console.log(err));

  return res.status(201).send("");
};

export default apiHandle({
  "POST": withUser(
    validate(RepositoryValidation.create, createRepository)
  )
});
