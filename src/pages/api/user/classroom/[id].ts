import { ClassroomRelations } from "../../../../controllers/ClassroomRelations";
import { Classrooms } from "../../../../controllers/Classrooms";
import { ClassroomValidation } from "../../../../services/api/validations/ClassroomValidation";
import { apiHandle } from "../../../../utils/api/apiHandle";
import { validate } from "../../../../utils/api/middlewares/validate";
import { withUser } from "../../../../utils/api/middlewares/withUser";

async function updateClassroom(req: Req, res: Res) {
  const { id } = req.query;
  const data = req.body;
  const user = req.user;

  await Classrooms.get(id?.toString());
  const classroom = await Classrooms.update(user, id?.toString(), data);

  return res.status(200).json(classroom);
};

async function deleteClassroom(req: Req, res: Res) {
  const { id } = req.query;
  const user = req.user;

  await Classrooms.get(id?.toString());
  await Classrooms.delete(user, id?.toString());

  return res.status(200).send("");
};

async function getClassroom(req: Req, res: Res) {
  const { id } = req.query;
  const user = req.user;
  
  const select = await ClassroomRelations.havePermissionsToSelectClassrroomValues(
    id?.toString(),
    user.id
  );

  const classroom = await Classrooms.get(id?.toString(), select);

  return res.status(200).json(classroom);
};

export default apiHandle({
  "PUT": withUser(
    validate(ClassroomValidation.update, updateClassroom)
  ),
  "DELETE": withUser(deleteClassroom),
  "GET": withUser(getClassroom)
});
