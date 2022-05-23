import { UnauthorizedError } from "../../../../errors/api/UnauthorizedError";
import { Github } from "../../../../services/github";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";


async function getAuthenticatedUser(req: Req, res: Res) {
  if(!req.user.installationId) {
    throw new UnauthorizedError();
  };

  const token = await Github.generateAppAccessToken(req.user.installationId);

  return res.status(200).json({
    token
  });
};

export default apiHandle({
  "GET": withUser(getAuthenticatedUser)
});