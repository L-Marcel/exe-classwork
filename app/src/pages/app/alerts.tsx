import { Alert, AlertIcon, Box, HStack } from "@chakra-ui/react";
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
        <Alert 
          status="warning"
          variant="left-accent"
          borderRadius={8}
          borderLeftWidth={2}
          w={[300, 350, 500]}
          maxW="80vw"
          alignItems="flex-start"
          mb={6}
        > 
          <AlertIcon/>
          New alerts are disabled in beta
        </Alert>
        <AlertsList/>
      </SearchProvider>
    </Section>
  );
};

export default WithUserProps(AlertsPage);