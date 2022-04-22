import { NextApiRequest, NextApiResponse } from "next";
import { UnauthorizedError } from "../../../errors/api/UnauthorizedError";
import { Github } from "../../../services/github";
import { apiHandle } from "../../../utils/api/apiHandle";

export const config = {
  api: {
    bodyParser: false,
  },
}

async function revalidatePagesWithGithubData(req: NextApiRequest, res: NextApiResponse) {
  const { isAuth, body } = await Github.getGithubWebookIsAuth(req);

  if(!isAuth) {
    throw new UnauthorizedError();
  };

  const eventType = req.headers["x-github-event"];

  await Github.triggerWebhookEvent(String(eventType) as any, body);
  
  return res.status(200).json({
    message: "Event trigged."
  });
};

export default apiHandle({
  "POST": revalidatePagesWithGithubData
});;