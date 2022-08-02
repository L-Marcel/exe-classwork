import { Classrooms } from "../../../../../controllers/Classrooms";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";

async function changeInviteCode(req: Req, res: Res) {
  const { id } = req.query;
  const user = req.user;
  
  await Classrooms.get(id?.toString());
  const data = await Classrooms.generateInviteCode(user, id?.toString());

  return res.status(200).json(data);
};

export default apiHandle({
  "POST": withUser(changeInviteCode)
});