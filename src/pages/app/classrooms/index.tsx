import { Box, HStack } from "@chakra-ui/react";
import { AddInstanceButton } from "../../../components/Buttons/AddInstanceButton";
import { ClassroomsList } from "../../../components/List/Classroom/ClassroomsList";
import { Pagination } from "../../../components/Pagination";
import { Search } from "../../../components/Search";
import { Section } from "../../../components/Section";
import { Title } from "../../../components/Title";
import { SearchProvider } from "../../../contexts/SearchProvider";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomsPageProps extends WithUserProps {};

function ClassroomsPage({ user }: ClassroomsPageProps) {
  return (
    <Section
      isNeabyOfNavigation
    >
      <Title>
        Classrooms
      </Title>
      <SearchProvider>
        <Box
          display="flex"
          flexDir={["column", "column", "column", "row"]}
          alignItems={["flex-start"]}
          flexWrap="wrap"
          mt={5}
          justifyContent="space-between"
          w="100%"
        >
          <HStack 
            spacing={5}
            mb={5}
          >
            <Search
              placeholder="Search by title or subject..."
            />
            <AddInstanceButton href={`/app/classroom`}/>
          </HStack>
          <Pagination/>
        </Box>
        <ClassroomsList/>
      </SearchProvider>
    </Section>
  );
};

export default WithUserProps(ClassroomsPage);