import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ClassroomTooltips } from "./ClassroomTooltips";

interface ClassroomMetricsChartProps {
  repositories: Repository[];
};

function ClassroomMetricsChart({ repositories }: ClassroomMetricsChartProps) {
  const data = repositories.reduce((prev, cur) => {
    const commits = cur.commits.reduce((prev, cur, i) => {
      prev.push({
        ...cur,
        classes: cur.classes.length,
        methods: cur.methods.length,
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

  return (
    <ResponsiveContainer width="100%">
      <BarChart
        width={500}
        height={400}
        data={data}
        barGap={0}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="fullname"
          style={{
            cursor: "pointer"
          }}
        />
        
        <YAxis/>
        <Bar maxBarSize={100} type="monotone" dataKey="complexity" fill="#ca8282" stroke="#ca8282"/>
        <Bar maxBarSize={100} type="monotone" dataKey="churn" fill="#8884d8" stroke="#8884d8"/>
        <Bar maxBarSize={100} type="monotone" dataKey="methods" fill="#ffc658" stroke="#ffc658"/>
        <Bar maxBarSize={100} type="monotone" dataKey="classes" fill="#82ca9d" stroke="#82ca9d"/>
        <Bar maxBarSize={100} type="monotone" dataKey="files" fill="#ca82bd" stroke="#ca82bd"/>

        <YAxis 
          yAxisId="sloc" 
          dataKey="sloc"
          orientation="right"
          stroke="#82a6ca"
        />
        <Bar
          maxBarSize={100} 
          yAxisId="sloc" 
          type="monotone" 
          dataKey="sloc" 
          fill="#82a6ca" 
          stroke="#82a6ca"
        />

        <Tooltip 
          cursor={{
            fill: "black",
            fillOpacity: .1,
          }} 
          content={(rest) => ClassroomTooltips({ ...rest, repositories: data })}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export { ClassroomMetricsChart };

