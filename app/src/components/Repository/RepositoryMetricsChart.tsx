import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { DataKey } from "recharts/types/util/types";
import { RepositoryTooltips } from "./RepositoryTooltips";

export interface RepositoryMetricsChartProps {
  data: CommitChart[];
  firstItemBefore?: any;
};

function RepositoryMetricsChart({ data, firstItemBefore }: RepositoryMetricsChartProps) {
  const [opacity, setOpacity] = useState({
    complexity: 1,
    churn: 1,
    methods: 1,
    classes: 1,
  });

  const [enabledDataKey, setEnabledDataKey] = useState({
    complexity: true,
    churn: true,
    methods: true,
    classes: true,
  });

  function handleOnFocusLegend(ev: Payload & {
    dataKey?: DataKey<any>;
  }) {
    const dataKey = ev.dataKey;

    const focusedDataKey = {
      [dataKey?.toString()]: 1
    };

    setOpacity({
      complexity: .2,
      churn: .2,
      methods: .2,
      classes: .2,
      ...focusedDataKey
    });
  };

  function handleOnDefocusLegend() {
    setOpacity({
      complexity: 1,
      churn: 1,
      methods: 1,
      classes: 1,
    });
  };

  function handleOnClickLegend(ev: Payload & {
    dataKey?: DataKey<any>;
  }) {
    const dataKey = ev.dataKey;

    setEnabledDataKey(enabledDataKeys => {
      return {
        ...enabledDataKeys,
        [dataKey?.toString()]: !enabledDataKeys[dataKey?.toString()]
      };
    });
  };

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
        <Tooltip content={(rest) => RepositoryTooltips({ ...rest, commits: data, firstItemBefore })}/>
        
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone" 
          opacity={opacity.complexity}  
          dataKey="complexity" 
          stroke={enabledDataKey.complexity? "#82a6ca":"#82a6ca10"}
        />
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone" 
          opacity={opacity.churn}  
          dataKey="churn" 
          stroke={enabledDataKey.churn? "#8884d8":"#8884d810"}
        />
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone" 
          opacity={opacity.methods}  
          dataKey="methods" 
          stroke={enabledDataKey.methods? "#ffc658":"#ffc65810"}
        />
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone" 
          opacity={opacity.classes}  
          dataKey="classes" 
          stroke={enabledDataKey.classes? "#82ca9d":"#82ca9d10"}
        />

        <Legend
          onMouseEnter={handleOnFocusLegend}
          onMouseLeave={handleOnDefocusLegend}
          onClick={handleOnClickLegend}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { RepositoryMetricsChart };

