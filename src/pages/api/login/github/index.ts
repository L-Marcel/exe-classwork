import { Users } from "../../../../controllers/Users";
import { AuthUserNotFoundError } from "../../../../errors/api/AuthUserNotFoundError";
import { Api } from "../../../../services/api";
import { Cookies } from "../../../../services/cookies";
import { Github } from "../../../../services/github";
import { apiHandle } from "../../../../utils/api/apiHandle";

export async function github(req: Req, res: Res) {
  try {
    const { code, installation_id: installationId } = req.query;

    const qrcode = Cookies.get("qrcode", { req, res });

    const { data } = await Github.getAccessToken(code?.toString());

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
    Cookies.set("refresh_token", data.refresh_token, { req, res })
    
    if(qrcode) {
      const relation = await Api.get<ClassroomRelation>(`/classrooms/${qrcode}?token=${data.access_token}`)
      .then(res => res.data).catch(() => false as any);
      
      if(!relation) {
        return res.status(300).redirect(`/app`);
      };

      return res.status(300).redirect(`/app/classrooms/${relation.classroomId}`);
    };

    return res.status(300).redirect(`/app`);
  } catch(err) {
    return res.status(300).redirect(`/`);
  };
};

export default apiHandle({
  "GET": github
});