import { Section } from "../../../../../components/Section";
import { TeamCreateForm } from "../../../../../components/Team/TeamCreateForm";
import { WithClassroomProps } from "../../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../../utils/routes/WithUserProps";

interface TeamFormPageProps extends WithClassroomProps {};

function TeamFormPage({}: TeamFormPageProps) { 
  return (
    <Section
      isNeabyOfNavigation
    >
      <TeamCreateForm/>
    </Section>
  );
};

export default WithUserProps(
  WithClassroomProps(TeamFormPage, (classroom, user) => {
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