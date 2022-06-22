import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/hooks/useUser";
import { NamedIcon } from "../NamedIcon";
import { RepositoryChangesChart } from "./RepositoryChangesChart";
import { RepositoryConfiguration } from "./RepositoryConfiguration";
import { RepositoryFilesChart } from "./RepositoryFilesChart";
import { RepositoryMetricsChart } from "./RepositoryMetricsChart";
import { RepositoryProfile } from "./RepositoryProfile";
export interface RepositoryContentProps {
  commits: Commit[];
  owner: Partial<User>;
  repositoryName: string;
};

function RepositoryContent({
  commits,
  owner,
  repositoryName
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

  const userIsAuthorized = (owner && user && owner.id === user.id);

  return (
    <Tabs defaultIndex={userIsAuthorized? 1:0}>
      <TabList
        overflowX="auto"
        overflowY="hidden"
        maxW="100vw"
        pb="1px"
      >
        { userIsAuthorized && <Tab
          px={2}
        >
          <NamedIcon 
            name="cog"
            w={6}
            h={6}
          />
        </Tab> }
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
        { userIsAuthorized && <TabPanel>
          <RepositoryConfiguration
            repositoryName={repositoryName}
          />
        </TabPanel> }
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

