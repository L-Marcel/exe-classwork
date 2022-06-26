import { useState } from "react";
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { DataKey } from "recharts/types/util/types";
import { RepositoryTooltips } from "./RepositoryTooltips";

export interface RepositoryChangesChartProps {
  data: CommitChart[];
};

function RepositoryChangesChart({ data }: RepositoryChangesChartProps) {
  const [opacity, setOpacity] = useState({
    sloc: 1,
    totalAdditions: 1,
    totalDeletions: 1,
    totalChanges: 1,
  });

  const [enabledDataKey, setEnabledDataKey] = useState({
    sloc: true,
    totalAdditions: true,
    totalDeletions: true,
    totalChanges: true,
  });

  function handleOnFocusLegend(ev: Payload & {
    dataKey?: DataKey<any>;
  }) {
    const dataKey = ev.dataKey;

    const focusedDataKey = {
      [dataKey?.toString()]: 1
    };

    setOpacity({
      sloc: .2,
      totalAdditions: .2,
      totalDeletions: .2,
      totalChanges: .2,
      ...focusedDataKey
    });
  };

  function handleOnDefocusLegend() {
    setOpacity({
      sloc: 1,
      totalAdditions: 1,
      totalDeletions: 1,
      totalChanges: 1,
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
            <stop 
              offset="5%" 
              stopColor={enabledDataKey.sloc? "#82a6ca":"#82a6ca10"} 
              stopOpacity={opacity.sloc * 0.8}
            />
            <stop 
              offset="95%" 
              stopColor={enabledDataKey.sloc? "#82a6ca":"#82a6ca10"} 
              stopOpacity={opacity.sloc * 0}
            />
          </linearGradient>
        </defs>

        <YAxis/>
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone" 
          opacity={opacity.totalAdditions}  
          dataKey="totalAdditions"
          name="total additions"
          stroke={enabledDataKey.totalAdditions? "#82ca9d":"#82ca9d10"}
        />
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone" 
          opacity={opacity.totalDeletions}  
          dataKey="totalDeletions"
          name="total deletions"
          stroke={enabledDataKey.totalDeletions? "#ca8282":"#ca828210"}
        />
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone"
          opacity={opacity.totalChanges}  
          dataKey="totalChanges"
          name="total changes"
          stroke={enabledDataKey.totalChanges? "#ffc658":"#ffc65810"}
        />

        <Area 
          strokeWidth={2} 
          dot={false} 
          type="monotone" 
          dataKey="sloc" 
          opacity={opacity.sloc} 
          fill="url(#colorUv)" 
          yAxisId="sloc"
          stroke={enabledDataKey.sloc? "#82a6ca":"#82a6ca10"}
        />
        <YAxis
          dataKey="sloc" 
          orientation="right" 
          yAxisId="sloc"
          stroke="#82a6ca"
        />

        <Legend
          onMouseEnter={handleOnFocusLegend}
          onMouseLeave={handleOnDefocusLegend}
          onClick={handleOnClickLegend}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export { RepositoryChangesChart };

