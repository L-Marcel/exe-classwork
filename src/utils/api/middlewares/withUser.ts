import { Users } from "../../../controllers/Users";
import { Cookies } from "../../../services/cookies";

function withUser(callback: (req: Req, res: Res) => Promise<any>) {
  return async(req: Req, res: Res) => {
    const token = req.query?.token || Cookies.get("token", { req, res });
    const user = await Users.getUserByToken({ req, res }, token?.toString());
    
    req.user = user;
    req.token = token?.toString();
    
    return await callback(req, res as Res);
  };
};

export { withUser };

