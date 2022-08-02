import { Repositories } from "../../../../controllers/Repositories";
import { Github } from "../../../../services/github";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function repositories(req: Req, res: Res) {
  const user = req.user;
  const { excludeNotLoaded } = req.query;

  console.log(excludeNotLoaded);
  const github = new Github(req, res);

  let repositories = await github.getAllRepositoriesByUser(user);
  
  if(excludeNotLoaded) {
    const loadedRepositories = await Repositories.getAllCreatedRepositories(user.id);
    repositories = repositories.filter(r => !loadedRepositories.some(lr => lr.fullname === r.fullname));
  };

  return res.status(200).json(repositories);
};


export default apiHandle({
  "GET": withUser(repositories)
});