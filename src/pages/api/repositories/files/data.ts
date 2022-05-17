import { Github } from "../../../../services/github";
import { apiHandle } from "../../../../utils/api/apiHandle";

async function getData(req: Req, res: Res) {
  try {
    const { url, type, path, userId } = req.body;
    const data = await Github.getFileData({ url, type, path }, userId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

export default apiHandle({
  "POST": getData
});