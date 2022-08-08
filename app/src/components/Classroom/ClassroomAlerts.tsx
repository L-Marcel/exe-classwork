import { Alert, AlertIcon, Box, HStack } from "@chakra-ui/react";
import { SearchProvider } from "../../contexts/SearchProvider";
import { AlertsList } from "../List/Alert/AlertsList";
import { Pagination } from "../Pagination";
import { Search } from "../Search";

interface ClassroomAlertsProps {
  id: string;
};

function ClassroomAlerts({
  id
}: ClassroomAlertsProps) {
  return (
    <SearchProvider>
      <Box
        display="flex"
        flexDir={["column", "column", "column", "row"]}
        alignItems={["flex-start"]}
        flexWrap="wrap"
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
      <AlertsList
        queryTo={`/user/classroom/${id}/alerts`}
      />
    </SearchProvider>
  );
};

export { ClassroomAlerts };

