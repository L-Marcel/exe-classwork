import { ClassroomRelations } from "../../../../../../../controllers/ClassroomRelations";
import { apiHandle } from "../../../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../../../utils/api/middlewares/withUser";

async function removeClassroomMember(req: Req, res: Res) {
  const { id, userId } = req.query;
  const user = req.user;

  await ClassroomRelations.removeById(id?.toString(), userId?.toString(), user.id);

  return res.status(200).send("");
};

export default apiHandle({
  "DELETE": withUser(removeClassroomMember)
});
