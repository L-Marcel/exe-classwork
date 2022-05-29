import { UnauthorizedError } from "../../../../errors/api/UnauthorizedError";
import { Github } from "../../../../services/github";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function connectRateLimit(req: Req, res: Res) {
  try {
    const user = req.user;

    const token = await Github.generateAppAccessToken(user.installationId);
    
    const rate = await Github.api.get<{ rate?: InstallationLimit }>("rate_limit", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    }).then(res => res.data?.rate).catch(() => {
      throw new UnauthorizedError();
    });
    
    return res.status(200).json(rate);
  } catch (error) {
    return res.status(400).send("");
  }
};

export default apiHandle({
  "POST": withUser(connectRateLimit)
});
