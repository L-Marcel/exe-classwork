import { Alerts } from "../../../../controllers/Alerts";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function getUnreadAlerts(req: Req, res: Res) {
  const { query } = req.query;
  const user = req.user;
  
  const count = await Alerts.countNotVisualizedByUser(user.id, { 
    query: query?.toString()
  });

  return res.status(200).json({
    count
  });
};

export default apiHandle({
  "GET": withUser(getUnreadAlerts)
});
