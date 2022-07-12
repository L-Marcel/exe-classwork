import { TeamRelations } from "../../../../../../../controllers/TeamRelations";
import { apiHandle } from "../../../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../../../utils/api/middlewares/withUser";



async function getClassroomMembers(req: Req, res: Res) {
  const { id, team, page, query } = req.query;

  const { _count } = await TeamRelations.countByTeam(team?.toString(), id?.toString(), { 
    query: query?.toString()
  });

  const members = await TeamRelations.getByTeam(team?.toString(), id?.toString(), { 
    page: page && Number(page),
    query: query?.toString()
  });

  return res.status(200).json({
    items: members,
    count: _count._all
  });
};

export default apiHandle({
  "GET": withUser(getClassroomMembers)
});
