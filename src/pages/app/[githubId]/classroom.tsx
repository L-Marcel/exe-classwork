import { Heading, Stack } from "@chakra-ui/react";
import { InviteCodeForm } from "../../../components/Classroom/InviteCodeForm";
import { Section } from "../../../components/Section";
import { Span } from "../../../components/Span";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomPageProps extends WithUserProps {
  user: User;
};

function ClassroomPage({ user }: ClassroomPageProps) {
  return (
    <Section>
      <Stack
        spacing={10}
      >
        <InviteCodeForm
          user={user}
        />
        <Heading
          alignSelf={["center", "center", "flex-start"]}
        >
          <Span color="primary.600">C</Span><Span>reate</Span> a new
        </Heading>
      </Stack>
    </Section>
  );
};

export default WithUserProps(ClassroomPage);