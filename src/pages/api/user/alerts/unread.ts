import { Visualizations } from "../../../../controllers/Visualizations";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function getNotVisualizedAlerts(req: Req, res: Res) {
  const user = req.user;
  
  const notVisualizedAlerts = await Visualizations.isNotVisualizedByUser(user.id);

  return res.status(200).json({ 
    items: notVisualizedAlerts,
    count: notVisualizedAlerts.length
  });
};

export default apiHandle({
  "GET": withUser(getNotVisualizedAlerts)
});
