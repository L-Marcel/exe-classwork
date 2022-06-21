import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RepositoryTooltips } from "./RepositoryTooltips";

export interface RepositoryMetricsChartProps {
  data: CommitChart[];
};

function RepositoryMetricsChart({ data }: RepositoryMetricsChartProps) {
  return (
    <ResponsiveContainer>
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
  );
};

export { RepositoryMetricsChart };

