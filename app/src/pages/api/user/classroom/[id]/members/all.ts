import { ClassroomRelations } from "../../../../../../controllers/ClassroomRelations";
import { apiHandle } from "../../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../../utils/api/middlewares/withUser";

async function getClassroomMembers(req: Req, res: Res) {
  const { id, query } = req.query;
  const user = req.user;
  
  await ClassroomRelations.havePermissionsToSelectClassrroomValues(
    id?.toString(),
    user.id
  );

  const { _count } = await ClassroomRelations.countByClassroom(id?.toString(), { 
    query: query?.toString()
  });

  const members = await ClassroomRelations.getByClassroom(id?.toString(), user.id, { 
    query: query?.toString(),
    take: _count._all
  });

  return res.status(200).json(members);
};

export default apiHandle({
  "GET": withUser(getClassroomMembers)
});
