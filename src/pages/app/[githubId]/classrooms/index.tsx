import { HStack } from "@chakra-ui/react";
import { AddInstanceButton } from "../../../../components/Buttons/AddInstanceButton";
import { ClassroomsList } from "../../../../components/List/Classroom/ClassroomsList";
import { Search } from "../../../../components/Search";
import { Section } from "../../../../components/Section";
import { Title } from "../../../../components/Title";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";

interface ClassroomsPageProps extends WithUserProps {};

function ClassroomsPage({ user }: ClassroomsPageProps) {
  return (
    <Section
      isNeabyOfNavigation
    >
      <Title>
        Classrooms
      </Title>
      <HStack 
        spacing={5}
        mt={5}
      >
        <Search/>
        <AddInstanceButton href={`/app/${user.githubId}/classroom`}/>
      </HStack>
      <ClassroomsList/>
    </Section>
  );
};

export default WithUserProps(ClassroomsPage);