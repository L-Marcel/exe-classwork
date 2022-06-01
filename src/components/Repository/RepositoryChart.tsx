import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RepositoryTooltips } from "./RepositoryTooltips";

interface RepositoryChartProps {
  commits: Commit[]
};

function RepositoryChart({
  commits
}: RepositoryChartProps) {
  const data = commits.reduce((prev, cur, i) => {
    prev.push({
      ...cur,
      churn: cur.churn,
      complexity: cur.complexity,
      sloc: cur.sloc,
      classes: cur.classes.length,
      methods: cur.methods.length,
    });
    
    return prev;
  }, [] as CommitChart[]);

  return (
    <Tabs>
      <TabList>
        <Tab>Metrics</Tab>
        <Tab>Changes</Tab>
        <Tab>Files</Tab>
      </TabList>
      <TabPanels
        w="100%"
        minW="93vw"
        maxW="100vw"
        overflowX="auto"
      >
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", "100%"]}
        >
          <ResponsiveContainer
            width="100%"
          >
            <AreaChart
              width={500}
              height={400}
              data={data}
              syncId="commit"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="message"/>
              <YAxis/>
              <Tooltip content={RepositoryTooltips}/>
              <Area type="monotone" dataKey="complexity" stackId="1" stroke="#82a6ca" fill="#82a6ca"/>
              <Area type="monotone" dataKey="churn" stackId="1" stroke="#8884d8" fill="#8884d8"/>
              <Area type="monotone" dataKey="methods" stackId="1" stroke="#ffc658" fill="#ffc658"/>
              <Area type="monotone" dataKey="classes" stackId="1" stroke="#82ca9d" fill="#82ca9d"/>
            </AreaChart>
          </ResponsiveContainer>
        </TabPanel>
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", "100%"]}
        >
          <ResponsiveContainer
            width="100%"
          >
            <AreaChart
              width={500}
              height={400}
              data={data}
              syncId="commit"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="message"/>
              <YAxis/>
              <Tooltip content={RepositoryTooltips}/>
              <Area type="monotone" dataKey="totalAdditions" stackId="1" stroke="#82ca9d" fill="#82ca9d"/>
              <Area type="monotone" dataKey="totalDeletions" stackId="1" stroke="#ca8282" fill="#ca8282"/>
              <Area type="monotone" dataKey="totalChanges" stackId="1" stroke="#ffc658" fill="#ffc658"/>
              <Area type="monotone" dataKey="sloc" stackId="1" stroke="#82a6ca" fill="#82a6ca"/>
            </AreaChart>
          </ResponsiveContainer>
        </TabPanel>
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", "100%"]}
        >
          <ResponsiveContainer
            width="100%"
          >
            <AreaChart
              width={500}
              height={400}
              data={data}
              syncId="commit"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="message"/>
              <YAxis/>
              <Tooltip content={RepositoryTooltips}/>
              <Area type="monotone" dataKey="filesAdded" stackId="1" stroke="#82ca9d" fill="#82ca9d"/>
              <Area type="monotone" dataKey="filesRemoved" stackId="1" stroke="#ca8282" fill="#ca8282"/>
              <Area type="monotone" dataKey="filesModified" stackId="1" stroke="#ffc658" fill="#ffc658"/>
            </AreaChart>
          </ResponsiveContainer>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export { RepositoryChart };

