import { ClassroomsList } from "../../../components/List/Classroom/ClassroomtsList";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomsPageProps extends WithUserProps {};

function ClassroomsPage({ user }: ClassroomsPageProps) {
  return (
    <ClassroomsList/>
  );
};

export default WithUserProps(ClassroomsPage);