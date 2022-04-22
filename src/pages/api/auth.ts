import { Users } from "../../controllers/Users";
import { apiHandle } from "../../utils/api/apiHandle";

async function auth(req: Req, res: Res) {
  const { token } = req.query;
  const user = await Users.getUserByToken({ req, res }, token?.toString());

  return res.status(200).json({ user });
};


export default apiHandle({
  "GET": auth
});