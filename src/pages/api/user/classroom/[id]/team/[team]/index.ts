import { Alerts } from "../../../../../../../controllers/Alerts";
import { Repositories } from "../../../../../../../controllers/Repositories";
import { Teams } from "../../../../../../../controllers/Teams";
import { TeamValidation } from "../../../../../../../services/api/validations/TeamValidation";
import { ServerSocket } from "../../../../../../../services/serverSocket";
import { apiHandle } from "../../../../../../../utils/api/apiHandle";
import { validate } from "../../../../../../../utils/api/middlewares/validate";
import { withUser } from "../../../../../../../utils/api/middlewares/withUser";


async function updateTeam(req: Req, res: Res) {
  const { team } = req.query;
  const user = req.user;

  const { users, repository, ...data } = req.body;

  await Teams.get(team?.toString());
  const updatedTeam = await Teams.update(user, team?.toString(), users, data);

  if(repository) {
    console.log("Linking repositories...");
    await Repositories.link({
      repository: {
        ...repository,
        owner: {
          connect: {
            id: repository.owner.id?.toString() || ""
          }
        }
      },
      classroomId: updatedTeam?.toString() || "",
      teamId: String(team)
    }).then(async(res: any) => {
      if(res["alreadyLinked"]) {
        return res;
      };
      
      try {
        await Alerts.create("TEAM", {
          description: `Repository ${repository.fullname} was been linked.`,
          avatarUrl: user.avatarUrl,
          classroomId: updatedTeam.team.classroomId?.toString() || "",
          repositoryId: res.id,
          teamId: String(team)
        });
      } catch (error) {};

      await ServerSocket.getSocket(user.id, req.token)
      .then(socket => {
        console.log("Socket created: ", socket.id);
        socket.emit("@repostory/commits/refresh", {
          repositoryFullname: repository.fullname,
          token: req.token,
          userId: user.id
        });
      }).catch(err => console.log(err));
  
      return res;
    }).catch(async() => {
      await Alerts.create("TEAM", {
        description: `Can't link ${repository.fullname}.`,
        avatarUrl: user.avatarUrl,
        classroomId: updatedTeam.team.classroomId?.toString() || "",
        teamId: String(team)
      });
    });
  };

  return res.status(200).json(updatedTeam);
};

async function deleteTeam(req: Req, res: Res) {
  const { team } = req.query;
  const user = req.user;

  await Teams.get(team?.toString());
  await Teams.delete(user, team?.toString());

  return res.status(200).send("");
};

export default apiHandle({
  "PUT": withUser(
    validate(TeamValidation.update, updateTeam)
  ),
  "DELETE": withUser(deleteTeam)
});
