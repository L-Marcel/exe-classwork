import { Api } from "../../../../services/api";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function connectWithSocket(req: Req, res: Res) {
  const user = req.user;
  
  await Api.post(`${process.env.NEXT_PUBLIC_SOCKET_DOMAIN}/connect`, {
    id: user.id
  });

  return res.status(200).json({ 
    userId: user.id
  });
};

export default apiHandle({
  "POST": withUser(connectWithSocket)
});
