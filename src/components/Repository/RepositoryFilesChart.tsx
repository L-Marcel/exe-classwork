import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RepositoryTooltips } from "./RepositoryTooltips";

interface RepositoryFilesChartProps {
  data: CommitChart[];
};

function RepositoryFilesChart({ data }: RepositoryFilesChartProps) {
  return (
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
  );
};

export { RepositoryFilesChart };

