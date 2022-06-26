import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { getSelectedArrayInterval } from "../../../utils/getSelectedArrayInterval";
import { DateIntervalInput } from "../../Inputs/DateIntervalInput";
import { RangerInput } from "../../Inputs/RangerInput";
import { ClassroomMetricsChart } from "./ClassroomMetricsChart";

export interface ClassroomChartsProps {
  repositories: Repository[];
};

function ClassroomCharts({
  repositories
}: ClassroomChartsProps) {
  const [chartWidth, setChartWidth] = useState(900 - 125);

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

  const data = repositories.reduce((prev, cur) => {
    const commits = cur.commits.reduce((prev, cur, i) => {
      prev.push({
        ...cur,
        classes: cur.classes.length,
        methods: cur.methods.length,
        files: ((prev.length > 0 && prev[i - 1].files) || 0) + (cur.filesAdded - cur.filesRemoved)
      });
      
      return prev;
    }, [] as CommitChart[]);

    const lastCommit = commits[commits.length - 1];

    const repository = {
      ...cur,
      commits,
      churn: lastCommit?.churn || 0,
      classes: lastCommit?.classes || 0,
      methods: lastCommit?.methods || 0,
      files: lastCommit?.files || 0,
      complexity: lastCommit?.complexity || 0,
      sloc: lastCommit?.sloc || 0,
      commitedAt: lastCommit?.commitedAt || 0,
      userGithubId: lastCommit?.userGithubId || 0,
      userGithubLogin: lastCommit?.userGithubLogin || ""
    };

    prev.push(repository);

    return prev;
  }, []);

  const [repositoriesWithCommitsInterval, setRepositoriesWithCommitsInterval] = useState(data);
  const [viewInterval, setViewInterval] = useState<[number, number]>([0, (repositoriesWithCommitsInterval.length - 1) * 100]);

  useEffect(() => {
    setChartWidth((window?.innerWidth || 900) - 125);
    window?.addEventListener("resize", (ev) => {
      setChartWidth((window?.innerWidth || 900) - 125);
    });
  }, [setChartWidth]);

  const handleOnChangeInterval = useCallback(
    (getFilteredResult: (date: string | Date) => boolean) => {
      if(repositories.length > 0) {
        setRepositoriesWithCommitsInterval(data.map(r => {
          return {
            ...r,
            commits: r.commits.filter(commit => getFilteredResult(commit?.commitedAt))
          };
        }))
      };
    }, [repositories]);
  
  function handleOnChangeRanger(interval: [number, number]) {
    setViewInterval(interval);
  };

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
            h="580px"
            w={["1000px", "1000px", "900px", `${chartWidth}px`]}
            alignItems="center"
            display="flex"
            flexDir="column"
          >
            <RangerInput
              w={`${chartWidth - 50}px`}
              alignSelf="center"
              onChange={handleOnChangeRanger}
              h={5}
              step={0.1}
              value={viewInterval}
              max={(repositoriesWithCommitsInterval.length - 1) * 100}
              mb={5}
              mt={2}
            />
            <ClassroomMetricsChart
              repositories={getSelectedArrayInterval(repositoriesWithCommitsInterval, viewInterval)}
            />
          </TabPanel>
          <TabPanel
            h="500px"
            w={["1000px", "1000px", "900px", `${chartWidth}px`]}
          >

          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export { ClassroomCharts };

