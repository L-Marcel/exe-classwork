import { Users } from "../../../controllers/Users";

function withUser(callback: (req: Req, res: Res) => Promise<any>) {
  return async(req: Req, res: Res) => {
    const user = await Users.getUserByToken({ req, res });
  
    req.user = user;
    return await callback(req, res);
  };
};

export { withUser };