import { ClassroomRelations } from "../../../../../controllers/ClassroomRelations";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";


async function getClassroomMembers(req: Req, res: Res) {
  const { id, page, query } = req.query;
  const user = req.user;
  
  await ClassroomRelations.havePermissionsToSelectClassrroomValues(
    id?.toString(),
    user.id
  );

  const classroom = await ClassroomRelations.getByClassroom(id?.toString(), { 
    page: Number(page),
    query: query?.toString()
  });

  return res.status(200).json(classroom);
};

export default apiHandle({
  "GET": withUser(getClassroomMembers)
});
