import { Repositories } from "../../../../controllers/Repositories";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function getRepository(req: Req, res: Res) {
  try {
    const { id } = req.query;
  
    const repository = await Repositories.get(id?.toString());
  
    return res.status(200).json(repository);
  } catch (error) {
    console.log(error);
    return res.status(400).send("");
  }
};

export default apiHandle({
  "GET": withUser(getRepository)
});
