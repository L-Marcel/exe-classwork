import { Users } from "../../../controllers/Users";

function withUser(callback: (req: Req, res: Res) => Promise<any>) {
  return async(req: Req, res: Res) => {
    const token = req.query?.token;
    const user = await Users.getUserByToken({ req, res }, token?.toString());
    
    req.user = user;
    return await callback(req, res);
  };
};

export { withUser };