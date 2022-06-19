import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

    const repository = {
      ...cur,
      commits,
      final: commits[commits.length - 1]
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
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fullname" />
        <YAxis/>
        <Tooltip/>
        <Legend/>
        <Bar dataKey="final.classes" fill="#8884d8" />
        <Bar dataKey="final.methods" fill="#8884d8" />
        <Bar dataKey="final.churn" fill="#8884d8" />
        <Bar dataKey="final.complexity" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export { ClassroomMetricsChart };

