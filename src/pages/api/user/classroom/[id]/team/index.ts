import { Alerts } from "../../../../../../controllers/Alerts";
import { Repositories } from "../../../../../../controllers/Repositories";
import { Teams } from "../../../../../../controllers/Teams";
import { Users } from "../../../../../../controllers/Users";
import { TeamValidation } from "../../../../../../services/api/validations/TeamValidation";
import { ServerSocket } from "../../../../../../services/serverSocket";
import { apiHandle } from "../../../../../../utils/api/apiHandle";
import { validate } from "../../../../../../utils/api/middlewares/validate";
import { withUser } from "../../../../../../utils/api/middlewares/withUser";


async function createTeam(req: Req, res: Res) {
  const { id: classroomId } = req.query;
  const { users, repository, ...data } = req.body;
  const user = req.user;
  
  console.log("Checking users...");
  await Promise.all(users.map(async(m: TeamRelation) => {
    await Users.checkIfCanLinkWithTeam(m.user.id, String(classroomId));
  }));

  console.log("Creating teams...");
  const team = await Teams.create(user, String(classroomId), users, data);
  
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
      classroomId: classroomId?.toString() || "",
      teamId: team.team.id
    }).then(async(res) => {
      try {
        await Alerts.create("TEAM", {
          description: `Repository ${repository.fullname} was been linked.`,
          avatarUrl: user.avatarUrl,
          classroomId: String(classroomId),
          repositoryId: res.id,
          teamId: team.team.id
        });
      } catch (error) {};
  
      return res;
    }).catch(async() => {
      await Alerts.create("TEAM", {
        description: `Can't link ${repository.fullname}.`,
        avatarUrl: user.avatarUrl,
        classroomId: String(classroomId),
        teamId: team.team.id
      });
    });

    console.log("Requesting commits...");

    await ServerSocket.getSocket(user.id, req.token)
    .then(socket => {
      console.log("Socket created: ", socket.id);
      socket.emit("@repostory/commits/refresh", {
        repositoryFullname: repository.fullname,
        token: req.token,
        userId: user.id
      });
    }).catch(err => console.log(err));
  };

  return res.status(201).send("");
};

export default apiHandle({
  "POST": withUser(
    validate(TeamValidation.create, createTeam)
  )
});
