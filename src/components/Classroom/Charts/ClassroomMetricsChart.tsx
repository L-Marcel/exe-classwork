import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { DataKey } from "recharts/types/util/types";
import { ClassroomTooltips } from "./ClassroomTooltips";

interface ClassroomMetricsChartProps {
  repositories: Repository[];
};

function ClassroomMetricsChart({ repositories }: ClassroomMetricsChartProps) {
  const [opacity, setOpacity] = useState({
    complexity: 1,
    churn: 1,
    methods: 1,
    classes: 1,
    files: 1,
    sloc: 1
  });

  const [enabledDataKey, setEnabledDataKey] = useState({
    complexity: true,
    churn: true,
    methods: true,
    classes: true,
    files: true,
    sloc: true
  });

  function handleOnFocusLegend(ev: Payload & {
    dataKey?: DataKey<any>;
  }) {
    const dataKey = ev.dataKey;

    const focusedDataKey = {
      [dataKey?.toString()]: 1
    };

    setOpacity({
      churn: .2,
      classes: .2,
      complexity: .2,
      files: .2,
      methods: .2,
      sloc: .2,
      ...focusedDataKey
    });
  };

  function handleOnDefocusLegend() {
    setOpacity({
      churn: 1,
      classes: 1,
      complexity: 1,
      files: 1,
      methods: 1,
      sloc: 1
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
    <ResponsiveContainer width="100%">
      <BarChart
        width={500}
        height={400}
        data={repositories}
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
        <Bar 
          maxBarSize={100} 
          type="monotone" 
          opacity={opacity.complexity} 
          dataKey="complexity" 
          fill={enabledDataKey.complexity? "#ca8282":"#ca828210"} 
          stroke={enabledDataKey.complexity? "#ca8282":"#ca828210"}
        />
        <Bar 
          maxBarSize={100} 
          type="monotone" 
          opacity={opacity.churn} 
          dataKey="churn"
          fill={enabledDataKey.churn? "#8884d8":"#8884d810"} 
          stroke={enabledDataKey.churn? "#8884d8":"#8884d810"}
        />
        <Bar 
          maxBarSize={100} 
          type="monotone" 
          opacity={opacity.methods} 
          dataKey="methods"
          fill={enabledDataKey.methods? "#ffc658":"#ffc65810"}   
          stroke={enabledDataKey.methods? "#ffc658":"#ffc65810"}  
        />
        <Bar 
          maxBarSize={100} 
          type="monotone" 
          opacity={opacity.classes} 
          dataKey="classes"
          fill={enabledDataKey.classes? "#82ca9d":"#82ca9d10"}  
          stroke={enabledDataKey.classes? "#82ca9d":"#82ca9d10"} 
        />
        <Bar 
          maxBarSize={100} 
          type="monotone" 
          opacity={opacity.files} 
          dataKey="files"
          fill={enabledDataKey.files? "#ca82bd":"#ca82bd10"} 
          stroke={enabledDataKey.files? "#ca82bd":"#ca82bd10"}
        /> 

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
          opacity={opacity.sloc} 
          dataKey="sloc"
          fill={enabledDataKey.sloc? "#82a6ca":"#82a6ca10"}
          stroke={enabledDataKey.sloc? "#82a6ca":"#82a6ca10"}
        />

        <Tooltip 
          cursor={{
            fill: "black",
            fillOpacity: .1,
          }} 
          content={(rest) => ClassroomTooltips({ ...rest as any })}
        />

        <Legend
          onMouseEnter={handleOnFocusLegend}
          onMouseLeave={handleOnDefocusLegend}
          onClick={handleOnClickLegend}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export { ClassroomMetricsChart };

