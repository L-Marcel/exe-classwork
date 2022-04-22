import { Users } from "../../../controllers/Users";
import { Cookies } from "../../../services/cookies";
import { Github } from "../../../services/github";
import { apiHandle } from "../../../utils/api/apiHandle";

async function github(req: Req, res: Res) {
  const { code, installation_id: installationId } = req.query;

  try {
    const { data } = await Github.getAccessToken(code?.toString());

    const user = await Users.getUserByToken({ req, res }, data?.access_token);

    if(!user && data?.access_token) {
      const {
        id: githubId,
        avatar_url: avatarUrl,
        name,
        login: username,
      } = await Github.checkIfTokenIsValid(data.access_token);

      console.log("create", githubId, name);

      await Users.create({
        avatarUrl,
        githubId: githubId.toString(),
        name,
        username,
        installationId: installationId?.toString()
      });

      Cookies.set("token", data.access_token, { req, res });
      Cookies.set("refresh_token", data.refresh_token, { req, res });

      return res.status(300).redirect(`https://github.com/apps/dev-next-classwork/installations/new/permissions?target_id=${githubId}`);
    } else if(user && !user?.installationId && installationId) {
      console.log("update", user, installationId);
      await Users.update(user.id, {
        installationId: installationId?.toString()
      });
    } else if(user && !user?.installationId && !installationId) {
      console.log("redirect", user);
      return res.status(300).redirect(`https://github.com/apps/dev-next-classwork/installations/new/permissions?target_id=${user?.githubId}`);
    };

    Cookies.set("token", data.access_token, { req, res });
    Cookies.set("refresh_token", data.refresh_token, { req, res });

    return res.status(300).redirect(`/app/${user.githubId}`);
  } catch(err) {
    console.log("err", err.message);
    return res.status(300).redirect(`/`);
  };
};

export default apiHandle({
  "GET": github
});