import { Teams } from "../../../../../../controllers/Teams";
import { Users } from "../../../../../../controllers/Users";
import { TeamValidation } from "../../../../../../services/api/validations/TeamValidation";
import { apiHandle } from "../../../../../../utils/api/apiHandle";
import { validate } from "../../../../../../utils/api/middlewares/validate";
import { withUser } from "../../../../../../utils/api/middlewares/withUser";


async function createTeam(req: Req, res: Res) {
  const { id: classroomId } = req.query;
  const { team: data, users } = req.body;
  const user = req.user;

  await Promise.all(users.map(async(m: TeamRelation) => {
    await Users.checkIfCanLinkWithTeam(m.user.id, String(classroomId));
  }));

  const team = await Teams.create(user, String(classroomId), users, data);

  return res.status(200).json(team);
};

export default apiHandle({
  "POST": withUser(
    validate(TeamValidation.create, createTeam)
  )
});
