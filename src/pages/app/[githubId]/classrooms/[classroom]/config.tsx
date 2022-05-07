import { WithClassroomProps } from "../../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../../utils/routes/WithUserProps";
import { ClassroomFormPage } from "../../classroom";

export default WithUserProps(
  WithClassroomProps(ClassroomFormPage, (classroom, user) => {
    if(!classroom.users.some(u => 
      u.user.id === user.id && 
      u.role !== "STUDENT" && 
      u.role !== "OBSERVER")
    ) {
      return false;
    };

    return true;
  }) 
);