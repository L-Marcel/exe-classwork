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
};

function RepositoryContent({
  commits
}: RepositoryContentProps) {
  const { user } = useUser();

  const [chartWidth, setChartWidth] = useState(900 - 125);
  const [viewInterval, setViewInterval] = useState<[number, number]>([0, (commits.length - 1) * 100]);

  const data = commits.reduce((prev, cur, i) => {
    prev.push({
      ...cur,
      classes: cur.classes.length,
      methods: cur.methods.length,
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
            max={(commits.length - 1) * 100}
            mb={5}
            mt={2}
          />
          <RepositoryMetricsChart
            data={getSelectedArrayInterval(data, viewInterval)}
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
            max={(commits.length - 1) * 100}
            mb={5}
            mt={2}
          />
          <RepositoryChangesChart
            data={getSelectedArrayInterval(data, viewInterval)}
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
            max={(commits.length - 1) * 100}
            mb={5}
            mt={2}
          />
          <RepositoryFilesChart
            data={getSelectedArrayInterval(data, viewInterval)}
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
            commits={commits || []}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export { RepositoryContent };

