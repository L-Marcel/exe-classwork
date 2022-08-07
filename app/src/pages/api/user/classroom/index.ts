import { Classrooms } from "../../../../controllers/Classrooms";
import { ClassroomValidation } from "../../../../services/api/validations/ClassroomValidation";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { validate } from "../../../../utils/api/middlewares/validate";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function createClassroom(req: Req, res: Res) {
  const data = req.body;
  const user = req.user;

  const isCreated = await Classrooms.create(user, data);

  if(!isCreated) {
    return res.status(403).send("");
  };

  return res.status(201).send("");
};

export default apiHandle({
  "POST": withUser(
    validate(ClassroomValidation.create, createClassroom)
  )
});
