import { ClassroomForm } from "../../components/Classroom/ClassroomForm";
import { ClassroomInviteCodeForm } from "../../components/Classroom/ClassroomInviteCodeForm";
import { Section } from "../../components/Section";
import { WithUserProps } from "../../utils/routes/WithUserProps";

interface ClassroomFormPageProps extends WithClassroomProps {};

export function ClassroomFormPage({
  classroom
}: ClassroomFormPageProps) {
  return (
    <>
      {
        !classroom && <Section
          isNeabyOfNavigation
        >
          <ClassroomInviteCodeForm/>
        </Section>
      }
      <Section
        isNeabyOfNavigation={classroom? true:false}
      >
        <ClassroomForm
          classroom={classroom}
        />
      </Section>
    </>
  );
};

export default WithUserProps(ClassroomFormPage);