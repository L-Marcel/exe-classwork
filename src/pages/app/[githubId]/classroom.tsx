import { CreateClassroomForm } from "../../../components/Classroom/CreateClassroomForm";
import { InviteCodeForm } from "../../../components/Classroom/InviteCodeForm";
import { Section } from "../../../components/Section";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomFormPageProps extends WithUserProps {};

function ClassroomFormPage({}: ClassroomFormPageProps) {
  return (
    <>
      <Section>
        <InviteCodeForm/>
      </Section>
      <Section>
        <CreateClassroomForm/>
      </Section>
    </>
  );
};

export default WithUserProps(ClassroomFormPage);