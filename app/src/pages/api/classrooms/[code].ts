import { ClassroomRelations } from "../../../controllers/ClassroomRelations";
import { Classrooms } from "../../../controllers/Classrooms";
import { apiHandle } from "../../../utils/api/apiHandle";
import { withUser } from "../../../utils/api/middlewares/withUser";

async function useInvite(req: Req, res: Res) {
  const { code } = req.query;
  const user = req.user;

  const classroom = await Classrooms.getByInviteCode(code?.toString());

  const relation = await ClassroomRelations.create("STUDENT", user, {
    classroomId: classroom.id,
    userId: user.id
  });

  return res.status(200).json(relation);
};

export default apiHandle({
  "GET": withUser(useInvite)
});