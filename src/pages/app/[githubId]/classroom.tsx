import { ClassroomCreateForm } from "../../../components/Classroom/ClassroomCreateForm";
import { ClassroomInviteCodeForm } from "../../../components/Classroom/ClassroomInviteCodeForm";
import { Layout } from "../../../components/Layout";
import { Section } from "../../../components/Section";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomFormPageProps extends WithUserProps {};

function ClassroomFormPage({}: ClassroomFormPageProps) {
  return (
    <Layout>
      <Section
        isNeabyOfNavigation
      >
        <ClassroomInviteCodeForm/>
      </Section>
      <Section>
        <ClassroomCreateForm/>
      </Section>
    </Layout>
  );
};

export default WithUserProps(ClassroomFormPage);