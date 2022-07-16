import { ClassroomRelations } from "../../../../../../../controllers/ClassroomRelations";
import { apiHandle } from "../../../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../../../utils/api/middlewares/withUser";

async function changeMemberRole(req: Req, res: Res) {
  const { id, userId } = req.query;
  const { role } = req.body;
  const user = req.user;

  await ClassroomRelations.changeRole(id?.toString(), userId?.toString(), user.id, role?.toString());

  return res.status(200).send("");
};

export default apiHandle({
  "POST": withUser(changeMemberRole)
});
