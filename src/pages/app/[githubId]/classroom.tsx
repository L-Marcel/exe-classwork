import { Stack } from "@chakra-ui/react";
import { CreateClassroomForm } from "../../../components/Classroom/CreateClassroomForm";
import { InviteCodeForm } from "../../../components/Classroom/InviteCodeForm";
import { Section } from "../../../components/Section";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomPageProps extends WithUserProps {};

function ClassroomPage({}: ClassroomPageProps) {
  return (
    <Section>
      <Stack
        spacing={10}
      >
        <InviteCodeForm/>
        <CreateClassroomForm/>
      </Stack>
    </Section>
  );
};

export default WithUserProps(ClassroomPage);