import { Users } from "../../controllers/Users";
import { apiHandle } from "../../utils/api/apiHandle";

async function users(req: Req, res: Res) {
  const { secret } = req?.headers;

  console.log(secret, req.headers);

  if(secret !== process.env.SECRET) {
    return res.status(401).send("");
  };

  const users = await Users.getAll();

  return res.status(200).json(users);
};


export default apiHandle({
  "GET": users
});