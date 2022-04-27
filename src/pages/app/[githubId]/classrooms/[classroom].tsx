import { ClassroomSections } from "../../../../components/List/Classroom/ClassroomSections";
import { WithClassroomProps } from "../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";

interface ClassroomPageProps extends WithClassroomProps {};

function ClassroomPage({
  classroom
}: ClassroomPageProps) {
  return (
    <ClassroomSections
      classroom={classroom}
    />
  );
};

export default WithUserProps(
  WithClassroomProps(ClassroomPage)
);