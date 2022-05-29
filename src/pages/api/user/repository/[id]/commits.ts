import { Commits } from "../../../../../controllers/Commits";
import { apiHandle } from "../../../../../utils/api/apiHandle";
import { withUser } from "../../../../../utils/api/middlewares/withUser";

async function getCommits(req: Req, res: Res) {
  const { id, page, take } = req.query;

  const commits = await Commits.get(id?.toString(), Number(page || 0), Number(take || 10));
  const count = await Commits.count(id?.toString());

  return res.status(200).json({
    count: count._count,
    items: commits
  });
};

export default apiHandle({
  "GET": withUser(getCommits)
});
