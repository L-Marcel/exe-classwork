import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useUser } from "../../../contexts/hooks/useUser";
import { DateIntervalInput } from "../../Inputs/DateIntervalInput";
import { ClassroomMetricsChart } from "./ClassroomMetricsChart";

interface ClassroomChartsProps {
  repositories: Repository[];
};

function ClassroomCharts({
  repositories
}: ClassroomChartsProps) {
  const { user } = useUser();
  repositories = repositories.sort((a, b) => 
    new Date(a.commits[0].commitedAt).getTime() - new Date(b.commits[0].commitedAt).getTime());

  console.log(repositories);
  const [repositoriesWithCommitsInterval, setRepositoriesWithCommitsInterval] = useState(repositories);

  const handleOnChangeInterval = useCallback(
    (getFilteredResult: (date: string | Date) => boolean) => {
      if(repositories.length > 0) {
        setRepositoriesWithCommitsInterval(repositories.map(r => {
          return {
            ...r,
            commits: r.commits.filter(commit => getFilteredResult(commit?.commitedAt))
          };
        }))
      };
    }, [repositories]);

  return (
    <>
      <Box
        display="flex"
        pl={4}
      >
        <DateIntervalInput
          initialAfterDate={repositories.length > 0? 
            repositories[0].commits.length > 0? 
              repositories[0].commits[0].commitedAt
            :undefined:undefined
          }
          initialBeforeDate={repositories.length > 0? 
            repositories[0].commits.length > 0? 
              repositories[repositories.length - 1]
                .commits[repositories[0].commits.length - 1].commitedAt
            :undefined:undefined
          }
          onChangeInterval={handleOnChangeInterval}
        />
      </Box>
      <Tabs pt={4}>
        <TabList>
          <Tab>Metrics</Tab>
          <Tab>Contribution</Tab>
        </TabList>
        <TabPanels
          w="100%"
          overflowX={["auto", "auto", "auto", "hidden"]}
          overflowY="hidden"
        >
          <TabPanel
            h="500px"
            w={["1000px", "1000px", "900px", "100%"]}
          >
            <ClassroomMetricsChart
              repositories={repositoriesWithCommitsInterval}
            />
          </TabPanel>
          <TabPanel
            h="500px"
            w={["1000px", "1000px", "900px", "100%"]}
          >

          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export { ClassroomCharts };

