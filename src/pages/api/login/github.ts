import { Users } from "../../../controllers/Users";
import { AuthUserNotFoundError } from "../../../errors/api/AuthUserNotFoundError";
import { Cookies } from "../../../services/cookies";
import { Github } from "../../../services/github";
import { apiHandle } from "../../../utils/api/apiHandle";

async function github(req: Req, res: Res) {
  const { code, installation_id: installationId } = req.query;

  try {
    console.log(code);
    const { data } = await Github.getAccessToken(code?.toString());

    console.log(data);

    let githubUser: GithubUser;
    const user = await Users.getUserByToken({ req, res }, data?.access_token)
    .catch((err) => {
      if(err instanceof AuthUserNotFoundError) {
        githubUser = err.user;
      };

      return false as any;
    });

    if(!user && data?.access_token && githubUser) {
      const {
        avatar_url: avatarUrl, 
        id: githubId, name, 
        login: username 
      } = githubUser;

      await Users.create({
        avatarUrl,
        githubId: githubId.toString(),
        name,
        username,
        installationId: installationId?.toString()
      });

      Cookies.set("token", data.access_token, { req, res });
      Cookies.set("refresh_token", data.refresh_token, { req, res });
      
      return res.status(300).redirect(`https://github.com/apps/${Github.appName}/installations/new/permissions?target_id=${githubId}`);
    } else if(user && !user?.installationId && installationId) {
      await Users.update(user.id, {
        installationId: installationId?.toString()
      });
    } else if(user && !user?.installationId && !installationId) {
      return res.status(300).redirect(`https://github.com/apps/${Github.appName}/installations/new/permissions?target_id=${user?.githubId}`);
    };

    Cookies.set("token", data.access_token, { req, res });
    Cookies.set("refresh_token", data.refresh_token, { req, res });

    return res.status(300).redirect(`/app/${user.githubId}`);
  } catch(err) {

    console.log(err);
    return res.status(300).redirect(`/`);
  };
};

export default apiHandle({
  "GET": github
});