import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/hooks/useUser";
import { getSelectedArrayInterval } from "../../utils/getSelectedArrayInterval";
import { RangerInput } from "../Inputs/RangerInput";
import { RepositoryChangesChart } from "./RepositoryChangesChart";
import { RepositoryFilesChart } from "./RepositoryFilesChart";
import { RepositoryMetricsChart } from "./RepositoryMetricsChart";
import { RepositoryProfile } from "./RepositoryProfile";
export interface RepositoryContentProps {
  commits: Commit[];
  isFormatted?: boolean;
};

function RepositoryContent({
  commits,
  isFormatted = false
}: RepositoryContentProps) {
  const { user } = useUser();

  const filteredCommits = commits.filter(c => c.filtered);

  const [chartWidth, setChartWidth] = useState(900 - 125);
  const [viewInterval, setViewInterval] = useState<[number, number]>([0, (filteredCommits.length - 1) * 100]);

  const data = isFormatted? commits:commits.reduce((prev, cur, i) => {
    prev.push({
      ...cur,
      classes: cur.classes,
      methods: cur.methods,
      files: ((prev.length > 0 && prev[i - 1].files) || 0) + (cur.filesAdded - cur.filesRemoved)
    });
    
    return prev;
  }, [] as CommitChart[]);

  useEffect(() => {
    setChartWidth((window?.innerWidth || 900) - 125);
    window?.addEventListener("resize", (ev) => {
      setChartWidth((window?.innerWidth || 900) - 125);
    });
  }, [setChartWidth]);
  
  function handleOnChangeRanger(interval: [number, number]) {
    setViewInterval(interval);
  };

  const filteredData = data.filter(d => d.filtered);
  const commitsInView: CommitChart[] = getSelectedArrayInterval<CommitChart>(filteredData, viewInterval);
  const firstCommitBeforeTheView = data.find(c => 
    commitsInView && commitsInView.length > 0 && c.order === commitsInView[0].order - 1
  );

  return (
    <Tabs>
      <TabList
        overflowX="auto"
        overflowY="hidden"
        maxW="100vw"
        pb="1px"
      >
        <Tab>Metrics</Tab>
        <Tab>Changes</Tab>
        <Tab>Files</Tab>
        <Tab>Committers</Tab>
      </TabList>
      <TabPanels
        maxW={["100vw", "100vw", "100vw", user? "93vw":"100vw"]}
        minW={chartWidth}
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
          justifyContent="center"
        >
          <RangerInput
            w={`${chartWidth - 50}px`}
            alignSelf="center"
            onChange={handleOnChangeRanger}
            h={5}
            value={viewInterval}
            max={(filteredCommits.length - 1) * 100}
            mb={5}
            mt="1px"
            mr="2px"
          />
          <RepositoryMetricsChart
            data={commitsInView}
            firstItemBefore={firstCommitBeforeTheView}
          />
        </TabPanel>
        <TabPanel
          h="580px"
          w={["1000px", "1000px", "900px", `${chartWidth}px`]}
          alignItems="center"
          display="flex"
          flexDir="column"
          justifyContent="center"
        >
          <RangerInput
            w={`${chartWidth - 50}px`}
            alignSelf="center"
            onChange={handleOnChangeRanger}
            mr="14px"
            h={5}
            value={viewInterval}
            max={(filteredCommits.length - 1) * 100}
            mb={5}
            mt={2}
          />
          <RepositoryChangesChart
            data={commitsInView}
            firstItemBefore={firstCommitBeforeTheView}
          />
        </TabPanel>
        <TabPanel
          h="580px"
          w={["1000px", "1000px", "900px", `${chartWidth}px`]}
          alignItems="center"
          display="flex"
          flexDir="column"
          justifyContent="center"
        >
          <RangerInput
            w={`${chartWidth - 50}px`}
            alignSelf="center"
            onChange={handleOnChangeRanger}
            h={5}
            mr="14px"
            value={viewInterval}
            max={(filteredCommits.length - 1) * 100}
            mb={5}
            mt={2}
          />
          <RepositoryFilesChart
            data={commitsInView}
            firstItemBefore={firstCommitBeforeTheView}
          />
        </TabPanel>
        <TabPanel
          minW={user? `min(93vw, ${chartWidth}px)`:"100vw"}
          maxW={["100vw", "100vw", "100vw", `min(100vw, ${chartWidth}px)`]}
          justifyContent="center"
          display="flex"
          flexDir="column"
        >
          <RepositoryProfile
            isFormatted={isFormatted}
            commits={filteredCommits || []}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export { RepositoryContent };

