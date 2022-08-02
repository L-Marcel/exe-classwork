import { apiHandle } from "../../../utils/api/apiHandle";
import { withUser } from "../../../utils/api/middlewares/withUser";

async function getAuthenticatedUser(req: Req, res: Res) {
  return res.status(200).json(req.user);
};

export default apiHandle({
  "GET": withUser(getAuthenticatedUser)
});