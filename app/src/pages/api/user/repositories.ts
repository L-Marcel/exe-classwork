import { Repositories } from "../../../controllers/Repositories";
import { apiHandle } from "../../../utils/api/apiHandle";
import { withUser } from "../../../utils/api/middlewares/withUser";

async function getRepositories(req: Req, res: Res) {
  const { page, query } = req.query;
  const user = req.user;
  
  const repositories = await Repositories.getByUser(user.id, { 
    page: Number(page),
    query: query?.toString()
  });

  const { _count } = await Repositories.countByUser(user.id, { 
    query: query?.toString()
  });

  return res.status(200).json({ 
    items: repositories,
    count: _count._all
  });
};

export default apiHandle({
  "GET": withUser(getRepositories)
});
