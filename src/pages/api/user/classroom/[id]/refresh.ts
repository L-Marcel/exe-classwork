import { ClassroomRelations } from "../../../../../controllers/ClassroomRelations";
import { UnauthorizedError } from "../../../../../errors/api/UnauthorizedError";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";
import { revalidatePath } from "../../../../../utils/revalidatePath";

async function refreshClassroom(req: Req, res: Res) {
  const { id } = req.query;
  const user = req.user;
  
  const relation = await ClassroomRelations.get(id?.toString(), user.id);

  if((relation.role !== "OWNER" && relation.role !== "ADMIN") || !relation) {
    throw new UnauthorizedError();
  };

  await revalidatePath(res, `/app/classrooms/${id}`);

  return res.status(200).json({
    id
  });
};

export default apiHandle({
  "POST": withUser(refreshClassroom),
});
