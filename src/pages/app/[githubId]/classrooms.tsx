import { Heading, HStack } from "@chakra-ui/react";
import { AddInstanceButton } from "../../../components/Buttons/AddInstanceButton";
import { ClassroomsList } from "../../../components/List/Classroom/ClassroomtsList";
import { Search } from "../../../components/Search";
import { Span } from "../../../components/Span";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomsPageProps extends WithUserProps {};

function ClassroomsPage({ user }: ClassroomsPageProps) {
  return (
    <>
      <Heading
        alignSelf={["center", "center", "flex-start"]}
      >
        <Span color="primary.600">C</Span><Span>lass</Span>rooms
      </Heading>
      <HStack 
        spacing={5}
        mt={5}
      >
        <Search/>
        <AddInstanceButton href={`/app/${user.githubId}/classroom`}/>
      </HStack>
      <ClassroomsList/>
    </>
  );
};

export default WithUserProps(ClassroomsPage);