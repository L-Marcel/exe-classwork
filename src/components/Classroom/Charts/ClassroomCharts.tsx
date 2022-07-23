import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { ClassroomProvider } from "../../../contexts/ClassroomProvider";
import { DateIntervalInput } from "../../Inputs/DateIntervalInput";
import { ClassroomMetricsTable } from "./ClassroomMetricsTable";
import { ClasssroomRepositoriesTableContent } from "./ClassroomRepositoriesTableContent";
import { ClassroomRepositoryContent } from "./ClassroomRepositoryContent";

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
        classes: cur.classes,
        methods: cur.methods,
        filtered: true,
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
            commits: r.commits.map(c => {
              return {
                ...c,
                filtered: getFilteredResult(c?.commitedAt)
                //to compare with not filtered results in the future
                //please, keep it
              };
            })
          };
        }))
      };
    }, [repositories]);
  
  return (
    <ClassroomProvider>
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
          <Tab>Teams</Tab>
          <Tab>Contributors</Tab>
        </TabList>
        <TabPanels>
          <TabPanel
            display="flex"
            flexDir="column"
            p={0}
          >
            <Box
              w={["1000px", "1000px", "900px", `${chartWidth}px`]}
              maxW="100%"
              p={4}
              pb={0}
            >
              <ClassroomMetricsTable
                repositories={repositoriesWithCommitsInterval}
              />
            </Box>
            <Box
              w="100%"
            >
              <ClassroomRepositoryContent
                repositories={repositoriesWithCommitsInterval}
              />
            </Box>
          </TabPanel>
          <TabPanel
            w={["1000px", "1000px", "900px", `${chartWidth}px`]}
            maxW="100%"
          >
            <ClasssroomRepositoriesTableContent
              repositories={repositoriesWithCommitsInterval}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ClassroomProvider>
  );
};

export { ClassroomCharts };

