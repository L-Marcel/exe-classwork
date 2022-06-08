import { useState } from "react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { getDynamicFillFrequencyColor, getDynamicFrequencyColor } from "../../utils/getDynamicFrequencyColor";

interface RepositoryFrequenceChartProps {
  data: CommitFrequency[];
  onChangeUser: (id: string, percent: string) => void;
};

function RepositoryFrequenceChart({
  data,
  onChangeUser
}: RepositoryFrequenceChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const maxFrequency = data.reduce((prev, cur) => {
    prev += cur.frequency;
    return prev;
  }, 0);
  
  function renderActiveShape(props) {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;

    const altFillColor = getDynamicFillFrequencyColor(value, maxFrequency/data.length);

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
    <PieChart width={300} height={300}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="frequency"
        onMouseEnter={handleOnPieEnter}
      >
        {data.map((entry, index) => {
          return (
            <Cell
              key={`cell-${index}`} 
              stroke="var(--chakra-colors-solid-75)" 
              fill={getDynamicFrequencyColor(entry.frequency, maxFrequency/data.length)}
            />
          );
        })}
      </Pie>
    </PieChart>
  );
};

export { RepositoryFrequenceChart };

