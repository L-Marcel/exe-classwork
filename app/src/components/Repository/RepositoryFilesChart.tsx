import { useState } from "react";
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import { DataKey } from "recharts/types/util/types";
import { RepositoryTooltips } from "./RepositoryTooltips";

export interface RepositoryFilesChartProps {
  data: CommitChart[];
  firstItemBefore?: any;
};

function RepositoryFilesChart({ data, firstItemBefore }: RepositoryFilesChartProps) {
  const [opacity, setOpacity] = useState({
    files: 1,
    filesAdded: 1,
    filesRemoved: 1,
    filesModified: 1,
  });

  const [enabledDataKey, setEnabledDataKey] = useState({
    files: true,
    filesAdded: true,
    filesRemoved: true,
    filesModified: true,
  });

  function handleOnFocusLegend(ev: Payload & {
    dataKey?: DataKey<any>;
  }) {
    const dataKey = ev.dataKey;

    const focusedDataKey = {
      [dataKey?.toString()]: 1
    };

    setOpacity({
      files: .2,
      filesAdded: .2,
      filesRemoved: .2,
      filesModified: .2,
      ...focusedDataKey
    });
  };

  function handleOnDefocusLegend() {
    setOpacity({
      files: 1,
      filesAdded: 1,
      filesRemoved: 1,
      filesModified: 1,
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
        <Tooltip content={(rest) => RepositoryTooltips({ ...rest, commits: data, firstItemBefore })}/>

        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop 
              offset="5%" 
              stopColor={enabledDataKey.files? "#82a6ca":"#82a6ca10"} 
              stopOpacity={opacity.files * 0.8}
            />
            <stop 
              offset="95%" 
              stopColor={enabledDataKey.files? "#82a6ca":"#82a6ca10"} 
              stopOpacity={opacity.files * 0}
            />
          </linearGradient>
        </defs>

        <YAxis/>
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone"
          opacity={opacity.filesAdded}  
          dataKey="filesAdded"
          name="files added"
          stroke={enabledDataKey.filesAdded? "#82ca9d":"#82ca9d10"}
        />
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone" 
          opacity={opacity.filesRemoved}  
          dataKey="filesRemoved" 
          name="files removed"
          stroke={enabledDataKey.filesRemoved? "#ca8282":"#ca828210"}
        />
        <Line 
          strokeWidth={2} 
          dot={false} 
          type="monotone"
          opacity={opacity.filesModified}  
          dataKey="filesModified"
          name="files modified"
          stroke={enabledDataKey.filesModified? "#ffc658":"#ffc65810"}
        />

        <Area 
          strokeWidth={2} 
          dot={false} 
          type="monotone" 
          dataKey="files" 
          opacity={opacity.files} 
          fill="url(#colorUv)" 
          yAxisId="files"
          stroke={enabledDataKey.files? "#82a6ca":"#82a6ca10"}
        />
        <YAxis
          dataKey="files" 
          orientation="right" 
          yAxisId="files"
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

export { RepositoryFilesChart };

