import { Alerts } from "../../../../controllers/Alerts";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function getAlerts(req: Req, res: Res) {
  const { page, query } = req.query;
  const user = req.user;
  
  const alerts = await Alerts.getByUser(user.id, { 
    page: Number(page || 0),
    query: query?.toString()
  });

  //console.log(alerts[0].visualizedBy);

  const { _count } = await Alerts.countByUser(user.id, { 
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
