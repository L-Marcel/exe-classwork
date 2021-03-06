import { Classrooms } from "../../../controllers/Classrooms";
import { apiHandle } from "../../../utils/api/apiHandle";
import { withUser } from "../../../utils/api/middlewares/withUser";

async function getClassrooms(req: Req, res: Res) {
  const { page, query } = req.query;
  const user = req.user;
  
  const classrooms = await Classrooms.getByUser(user.id, { 
    page: Number(page),
    query: query?.toString()
  });

  const { _count } = await Classrooms.countByUser(user.id, { 
    query: query?.toString()
  });

  return res.status(200).json({ 
    items: classrooms,
    count: _count._all
  });
};

export default apiHandle({
  "GET": withUser(getClassrooms)
});
