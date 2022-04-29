import { ClassroomCreateForm } from "../../../components/Classroom/ClassroomCreateForm";
import { ClassroomInviteCodeForm } from "../../../components/Classroom/ClassroomInviteCodeForm";
import { Section } from "../../../components/Section";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomFormPageProps extends WithUserProps {};

function ClassroomFormPage({}: ClassroomFormPageProps) {
  return (
    <>
      <Section
        isNeabyOfNavigation
      >
        <ClassroomInviteCodeForm/>
      </Section>
      <Section>
        <ClassroomCreateForm/>
      </Section>
    </>
  );
};

export default WithUserProps(ClassroomFormPage);