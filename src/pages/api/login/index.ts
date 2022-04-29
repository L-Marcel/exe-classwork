import { Users } from "../../../controllers/Users";
import { Api } from "../../../services/api";
import { Cookies } from "../../../services/cookies";
import { Github } from "../../../services/github";
import { apiHandle } from "../../../utils/api/apiHandle";

async function login(req: Req, res: Res) {
  try {
    const { qrcode } = req.query;
   
    if(qrcode) {
      Cookies.set("qrcode", qrcode?.toString(), { req, res });
    };

    const user = await Users.getUserByToken({ req, res })
    .catch(() => false as any);

    if(user && !user?.installationId) {
      return res.status(300).redirect(`https://github.com/apps/${Github.appName}/installations/new/permissions?target_id=${user?.githubId}`);
    } else if(!user) {
      return res.status(300).redirect(`https://github.com/login/oauth/authorize?client_id=${Github.clientId}`);
    } else if(qrcode) {
      const token = Cookies.get("token", { req, res });
      
      const relation = await Api.get<ClassroomRelation>(`/classrooms/${qrcode}?token=${token}`)
      .then(res => res.data).catch(() => false as any);

      if(!relation) {
        return res.status(300).redirect(`/app/${user.githubId}`);
      };

      return res.status(300).redirect(`/app/${user.githubId}/classrooms/${relation.classroomId}`);
    };

    return res.status(300).redirect(`/app/${user.githubId}`);
  } catch (err) {
    return res.status(401).redirect("/");
  }
};

export default apiHandle({
  "GET": login
});