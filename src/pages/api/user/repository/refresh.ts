import { Commits } from "../../../../controllers/Commits";
import { Repositories } from "../../../../controllers/Repositories";
import { NotFoundError } from "../../../../errors/api/NotFoundError";
import { ServerSocket } from "../../../../services/serverSocket";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function refreshRepository(req: Req, res: Res) {
  const repositoryName = req.body.repository;
  const user = req.user;
  const token = req.token;
  
  if(!repositoryName) {
    throw new NotFoundError("Repository");
  };

  const repository = await Repositories.getByFullname(`${user.username}/${repositoryName}`);

  if(!repository) {
    throw new NotFoundError("Repository");
  };

  await Commits.deleteMany({
    repository: {
      fullname: repository.fullname
    }
  });

  await ServerSocket.getSocket(user.id, token)
  .then(socket => {
    console.log("Socket created in webhook: ", socket.id);
    socket.emit("@repostory/commits/refresh", {
      repositoryFullname: repository.fullname,
      token,
      userId: user.id
    });
  }).catch(err => console.log(err));

  return res.status(200).json({ 
    userId: user.id
  });
};

export default apiHandle({
  "POST": withUser(refreshRepository)
});
