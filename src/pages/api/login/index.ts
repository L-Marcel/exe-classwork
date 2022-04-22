import { Users } from "../../../controllers/Users";
import { LoopError } from "../../../errors/api/LoopError";
import { Cookies } from "../../../services/cookies";
import { Github } from "../../../services/github";
import { apiHandle } from "../../../utils/api/apiHandle";

async function login(req: Req, res: Res) {
  try {
    const user = await Users.getUserByToken({ req, res })
    .catch(() => false as any);

    if(user && !user?.installationId) {
      return res.status(300).redirect(`https://github.com/apps/${Github.appName}/installations/new/permissions?target_id=${user?.githubId}`);
    } else if(!user) {
      return res.status(300).redirect(`https://github.com/login/oauth/authorize?client_id=${Github.clientId}`);
    };

    return res.status(300).redirect(`/app/${user.githubId}`);
  } catch (err) {
    return res.status(401).redirect("/");
  }
};

export default apiHandle({
  "GET": login
});