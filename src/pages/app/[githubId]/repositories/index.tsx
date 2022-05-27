import { Box, HStack } from "@chakra-ui/react";
import { RepositoryList } from "../../../../components/List/Repository/RepositoryList";
import { Pagination } from "../../../../components/Pagination";
import { Search } from "../../../../components/Search";
import { Section } from "../../../../components/Section";
import { Title } from "../../../../components/Title";
import { SearchProvider } from "../../../../contexts/SearchProvider";
import { WithUserProps } from "../../../../utils/routes/WithUserProps";


interface RepositoriesPageProps extends WithUserProps {};

function RepositoriesPage({ user }: RepositoriesPageProps) {
  return (
    <Section
      isNeabyOfNavigation
    >
      <Title>
        Repositories
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
              placeholder="Search by title..."
            />
          </HStack>
          <Pagination/>
        </Box>
        <RepositoryList/>
      </SearchProvider>
    </Section>
  );
};

export default WithUserProps(RepositoriesPage);