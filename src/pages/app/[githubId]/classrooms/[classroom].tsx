import { Text } from "@chakra-ui/react";
import { ClassroomBanner } from "../../../../components/Classroom/ClassroomBanner";
import { ClassroomMembersSection } from "../../../../components/Classroom/ClassroomMemberSection";
import { Layout } from "../../../../components/Layout";
import { ClassroomSections } from "../../../../components/List/Classroom/ClassroomSections";
import { Section } from "../../../../components/Section";
import { WithClassroomProps } from "../../../../utils/routes/WithClassroomProps";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";

interface ClassroomPageProps extends WithClassroomProps {};

function ClassroomPage({
  classroom
}: ClassroomPageProps) {
  return (
    <Layout>
      <ClassroomBanner
        {...classroom}
      />
      <ClassroomSections
        sections={[
          <ClassroomMembersSection 
            members={classroom.users}
          />,
          <ClassroomMembersSection 
            members={classroom.users}
          />
        ]}
      />
      <Section forceWidth>
        <Text textAlign="center">This page will still undergo many changes.</Text>
      </Section>
    </Layout>
  );
};

export default WithUserProps(
  WithClassroomProps(ClassroomPage)
);