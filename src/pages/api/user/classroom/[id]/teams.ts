import { ClassroomRelations } from "../../../../../controllers/ClassroomRelations";
import { Teams } from "../../../../../controllers/Teams";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";

async function getClassroomTeams(req: Req, res: Res) {
  const { id, page, query } = req.query;
  const user = req.user;
  
  await ClassroomRelations.havePermissionsToSelectClassrroomValues(
    id?.toString(),
    user.id
  );

  const { _count } = await Teams.countByClassroom(id?.toString(), user.id, { 
    query: query?.toString()
  });

  const teams = await Teams.getByClassroom(id?.toString(), user.id, { 
    page: page && Number(page),
    query: query?.toString()
  });

  return res.status(200).json({
    items: teams,
    count: _count._all
  });
};

export default apiHandle({
  "GET": withUser(getClassroomTeams)
});
