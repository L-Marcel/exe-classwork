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
  }).then(res => res).catch(err => {
    console.log(err);
    return null;
  });

  if(!repository) {
    return res.status(403).send("");
  };

  console.log("Creating socket...");
  
  await ServerSocket.getSocket(user.id, req.token)
  .then(socket => {
    console.log("Socket created: ", socket.id);
    repository?.fullname && socket.emit("@repostory/commits/refresh", {
      repositoryFullname: repository?.fullname,
      token: req.token,
      userId: user.id,
      isForced: true
    });
  }).catch(err => console.log(err));

  return res.status(201).send("");
};

export default apiHandle({
  "POST": withUser(
    validate(RepositoryValidation.create, createRepository)
  )
});
