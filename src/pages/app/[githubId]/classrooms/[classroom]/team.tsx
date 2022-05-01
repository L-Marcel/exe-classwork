import { Section } from "../../../../../components/Section";
import { WithClassroomProps } from "../../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../../utils/routes/WithUserProps";

interface TeamFormPageProps extends WithClassroomProps {};

function TeamFormPage({}: TeamFormPageProps) { 
  return (
    <Section
      isNeabyOfNavigation
    >
    </Section>
  );
};

export default WithUserProps(
  WithClassroomProps(TeamFormPage)
);