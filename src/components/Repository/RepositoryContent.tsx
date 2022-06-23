import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/hooks/useUser";
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
  const [chartWidth, setChartWidth] = useState((window?.innerWidth || 900) - 125);

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
    window?.addEventListener("resize", (ev) => {
      setChartWidth((window?.innerWidth || 900) - 125);
    });
  }, [window, setChartWidth]);

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
        maxW={user? "93vw":"100vw"}
        minW={chartWidth}
        w="100%"
        overflowX={["auto", "auto", "auto", "hidden"]}
        overflowY="hidden"
        pt={3}
      >
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", `${chartWidth}px`]}
        >
          <RepositoryMetricsChart
            data={data}
          />
        </TabPanel>
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", `${chartWidth}px`]}
        >
          <RepositoryChangesChart
            data={data}
          />
        </TabPanel>
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", `${chartWidth}px`]}
        >
          <RepositoryFilesChart
            data={data}
          />
        </TabPanel>
        <TabPanel
          minW={user? "93vw":"100vw"}
          maxW="100vw"
          justifyContent="center"
          alignItems="center"
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

