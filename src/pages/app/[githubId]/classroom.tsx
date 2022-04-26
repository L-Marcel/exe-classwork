import { Heading } from "@chakra-ui/react";
import { Section } from "../../../components/Section";
import { Span } from "../../../components/Span";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomPageProps extends WithUserProps {};

function ClassroomPage({ user }: ClassroomPageProps) {
  return (
    <Section>
      <Heading
        alignSelf={["center", "center", "flex-start"]}
      >
        <Span color="primary.600">U</Span><Span>se</Span> invite code
      </Heading>
      <Heading
        alignSelf={["center", "center", "flex-start"]}
      >
        <Span color="primary.600">C</Span><Span>reate</Span> a new
      </Heading>
    </Section>
  );
};

export default WithUserProps(ClassroomPage);