import { useState } from "react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { getDynamicContributionColor, getDynamicFillContributionColor } from "../../utils/getDynamicContributionColor";

interface RepositoryContributionChartProps {
  data: UserCommit[];
  onChangeUser: (id: string, percent: string) => void;
};

function RepositoryContributionChart({
  data,
  onChangeUser
}: RepositoryContributionChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const maxContribution = data.reduce((prev, cur) => {
    prev += cur.contribution;
    return prev;
  }, 0);
  
  function renderActiveShape(props) {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

    const altFillColor = getDynamicFillContributionColor(value, maxContribution/data.length);

    onChangeUser(payload?.user?.id || "", (percent * 100).toFixed(2));
  
    return (
      <g>
        <defs>
          <pattern id="avt" width="100%" height="100%">
              <image href={`https://avatars.githubusercontent.com/u/${payload.user.id}?v=4`} width="100px" height="100px"/>
          </pattern>
        </defs>
        <circle cx={cx} cy={cy} r={innerRadius - 10} fill="url(#avt)"/>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={altFillColor}
        />
      </g>
    );
  };

  function handleOnPieEnter(_, index: number) {
    setActiveIndex(index);
  };

  return (
    <PieChart width={300} height={200}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="contribution"
        onMouseEnter={handleOnPieEnter}
      >
        {data.map((entry, index) => {
          return (
            <Cell
              key={`cell-${index}`} 
              stroke="var(--chakra-colors-solid-75)" 
              fill={getDynamicContributionColor(entry.contribution, maxContribution/data.length)}
            />
          );
        })}
      </Pie>
    </PieChart>
  );
};

export { RepositoryContributionChart };

