
import { Cookies } from "../../services/cookies";
import { apiHandle } from "../../utils/api/apiHandle";

async function logout(req: Req, res: Res) {
  try {
    Cookies.delete("token", { req, res });
    Cookies.delete("refresh_token", { req, res });

    return res.status(300).redirect(`/`);
  } catch (err) {
    return res.status(400).redirect("/");
  }
};

export default apiHandle({
  "GET": logout
});