import { Trees } from "../../../../../controllers/Trees";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { isDev } from "../../../../../utils/api/middlewares/isDev";

async function deleteAllTrees(req: Req, res: Res) {
  await Trees.deleteAll();

  return res.status(200).send("");
};

export default apiHandle({
  "DELETE": isDev(deleteAllTrees)
});