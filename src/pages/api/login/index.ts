import { Users } from "../../../controllers/Users";
import { LoopError } from "../../../errors/api/LoopError";
import { Cookies } from "../../../services/cookies";
import { Github } from "../../../services/github";
import { apiHandle } from "../../../utils/api/apiHandle";

async function login(req: Req, res: Res) {
  try {
    const stopLoop = Cookies.get("stop_loop", { req, res });
    const user = await Users.getUserByToken({ req, res })
    .catch((err) => {
      console.log(err);
      return false as any;
    });

    if(user && !user?.installationId) {
      return res.status(300).redirect(`https://github.com/apps/dev-next-classwork/installations/new/permissions?target_id=${user?.githubId}`);
    } else if(!user && !stopLoop || stopLoop === "false") {
      Cookies.set("stop_loop", "true", { req, res });
      return res.status(300).redirect(`https://github.com/login/oauth/authorize?client_id=${Github.clientId}`);
    } else if(stopLoop === "true") {
      throw new LoopError();
    };

    return res.status(300).redirect(`/app/${user.githubId}`);
  } catch (err) {
    console.log(err.message);
    return res.status(401).redirect("/");
  }
};

export default apiHandle({
  "GET": login
});