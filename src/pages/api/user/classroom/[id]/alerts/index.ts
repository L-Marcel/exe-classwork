import { Alerts } from "../../../../../../controllers/Alerts";
import { apiHandle } from "../../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../../utils/api/middlewares/withUser";


async function getAlerts(req: Req, res: Res) {
  const { id } = req.query;
  const { page, query } = req.query;

  const user = req.user;
  
  const alerts = await Alerts.getByUserInClassroom(user.id, id?.toString(), { 
    page: Number(page || 0),
    query: query?.toString(),
    updateVisualizedBy: true
  });

  const { _count } = await Alerts.countByUserInClassroom(user.id, id?.toString(), { 
    query: query?.toString()
  });

  return res.status(200).json({
    items: alerts,
    count: _count._all
  });
};

export default apiHandle({
  "GET": withUser(getAlerts)
});
