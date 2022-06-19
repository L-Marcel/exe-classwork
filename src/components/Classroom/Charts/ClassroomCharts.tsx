import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { DateIntervalInput } from "../../Inputs/DateIntervalInput";
import { ClassroomMetricsChart } from "./ClassroomMetricsChart";

interface ClassroomChartsProps {
  repositories: Repository[];
};

function ClassroomCharts({
  repositories
}: ClassroomChartsProps) {
  const commits = repositories.reduce((prev, cur) => {
    const _commits = cur.commits.sort((a, b) => new Date(a.commitedAt).getTime() - new Date(b.commitedAt).getTime());

    if(_commits.length <= 0) {
      return prev;
    };

    const lastCommitDate = new Date(_commits[_commits.length - 1].commitedAt);
    const firstCommitDate = new Date(_commits[0].commitedAt);

    if(firstCommitDate.getTime() <= new Date(prev.start).getTime()) {
      prev.start = firstCommitDate;
    };

    if(lastCommitDate.getTime() >= new Date(prev.end).getTime() || prev.end === undefined) {
      prev.end = lastCommitDate;
    };
  
    return prev;
  }, {
    start: new Date(),
    end: undefined,
  } as RepositoriesCommitsInterval);

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
          initialAfterDate={commits.start}
          initialBeforeDate={commits.end}
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
