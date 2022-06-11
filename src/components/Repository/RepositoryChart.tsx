import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Area, CartesianGrid, ComposedChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useUser } from "../../contexts/hooks/useUser";
import { RepositoryProfile } from "./RepositoryProfile";
import { RepositoryTooltips } from "./RepositoryTooltips";

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
          <ResponsiveContainer
            width="100%"
          >
            <LineChart
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
              <Tooltip content={(rest) => RepositoryTooltips({ ...rest, commits: data })}/>
              
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="complexity" stroke="#82a6ca"/>
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="churn" stroke="#8884d8"/>
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="methods" stroke="#ffc658"/>
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="classes" stroke="#82ca9d"/>
            </LineChart>
          </ResponsiveContainer>
        </TabPanel>
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", "100%"]}
        >
          <ResponsiveContainer
            width="100%"
          >
            <ComposedChart
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
              <Tooltip content={(rest) => RepositoryTooltips({ ...rest, commits: data })}/>

              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82a6ca" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82a6ca" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area strokeWidth={2} dot={false} type="monotone" dataKey="sloc" stroke="#82a6ca" fill="url(#colorUv)" yAxisId="sloc"/>
              <YAxis
                dataKey="sloc" 
                orientation="right" 
                yAxisId="sloc"
                stroke="#82a6ca"
              />

              <YAxis/>
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="totalAdditions" stroke="#82ca9d"/>
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="totalDeletions" stroke="#ca8282"/>
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="totalChanges" stroke="#ffc658"/>
            </ComposedChart>
          </ResponsiveContainer>
        </TabPanel>
        <TabPanel
          h="500px"
          w={["1000px", "1000px", "900px", "100%"]}
        >
          <ResponsiveContainer
            width="100%"
          >
            <ComposedChart
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
              <Tooltip content={(rest) => RepositoryTooltips({ ...rest, commits: data })}/>

              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82a6ca" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82a6ca" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area strokeWidth={2} dot={false} type="monotone" dataKey="files" stroke="#82a6ca" fill="url(#colorUv)" yAxisId="files"/>
              <YAxis
                dataKey="files" 
                orientation="right" 
                yAxisId="files"
                stroke="#82a6ca"
              />

              <YAxis/>
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="filesAdded" stroke="#82ca9d"/>
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="filesRemoved" stroke="#ca8282"/>
              <Line strokeWidth={2} dot={false} type="monotone" dataKey="filesModified" stroke="#ffc658"/>
            </ComposedChart>
          </ResponsiveContainer>
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

