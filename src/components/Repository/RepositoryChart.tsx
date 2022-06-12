import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useUser } from "../../contexts/hooks/useUser";
import { RepositoryChangesChart } from "./RepositoryChangesChart";
import { RepositoryFilesChart } from "./RepositoryFilesChart";
import { RepositoryMetricsChart } from "./RepositoryMetricsChart";
import { RepositoryProfile } from "./RepositoryProfile";

interface RepositoryChartProps {
  commits: Commit[];
};

function RepositoryChart({
  commits
}: RepositoryChartProps) {
  const { user } = useUser();
  
  const data = commits.reduce((prev, cur, i) => {
    prev.push({
      ...cur,
      classes: cur.classes.length,
      methods: cur.methods.length,
      files: ((prev.length > 0 && prev[i - 1].files) || 0) + (cur.filesAdded - cur.filesRemoved)
    });
    
    return prev;
  }, [] as CommitChart[]);

  return (
    <Tabs>
      <TabList
        overflowX="auto"
        maxW="100vw"
      >
        <Tab>Metrics</Tab>
        <Tab>Changes</Tab>
        <Tab>Files</Tab>
        <Tab>Committers</Tab>
      </TabList>
      <TabPanels
        w="100%"
        minW={user? "93vw":"100vw"}
        maxW="100vw"
        overflowX={["auto", "auto", "auto", "hidden"]}
        overflowY="hidden"
        pt={3}
      >
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", "100%"]}
        >
          <RepositoryMetricsChart
            data={data}
          />
        </TabPanel>
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", "100%"]}
        >
          <RepositoryChangesChart
            data={data}
          />
        </TabPanel>
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", "100%"]}
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

export { RepositoryChart };

