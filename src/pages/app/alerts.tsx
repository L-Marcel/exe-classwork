import { Box, HStack } from "@chakra-ui/react";
import { AlertsList } from "../../components/List/Alert/AlertsList";
import { Pagination } from "../../components/Pagination";
import { Search } from "../../components/Search";
import { Section } from "../../components/Section";
import { Title } from "../../components/Title";
import { SearchProvider } from "../../contexts/SearchProvider";
import { WithUserProps } from "../../utils/routes/WithUserProps";

function AlertsPage() {
  return (
    <Section
      isNeabyOfNavigation
    >
      <Title>
        Alerts
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
              placeholder="Search by message, classroom, commit, or team..."
            />
          </HStack>
          <Pagination/>
        </Box>
        <AlertsList/>
      </SearchProvider>
    </Section>
  );
};

export default WithUserProps(AlertsPage);