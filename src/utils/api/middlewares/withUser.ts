import { Users } from "../../../controllers/Users";
import { UnauthorizedError } from "../../../errors/api/UnauthorizedError";
import { Cookies } from "../../../services/cookies";

function withUser(callback: (req: Req, res?: Res) => Promise<any>, canUseAppToken: boolean = false) {
  return async(req: Req, res?: Res) => {
    const token = req.query?.token || Cookies.get("token", { req, res });
    const user = await Users.getUserByToken({ req, res }, token?.toString())
    .then(u => u).catch(async(err) => {
      if(canUseAppToken) {
        return Users.getUserByAppToken(token?.toString());
      } else {
        throw new UnauthorizedError();
      };
    });
    
    req.user = user;
    req.token = token?.toString();
    
    return await callback(req, res as Res);
  };
};

export { withUser };

