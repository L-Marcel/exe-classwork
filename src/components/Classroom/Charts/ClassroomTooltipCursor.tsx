import { Rectangle } from "recharts";

interface ClassroomTooltipCursorProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payloadIndex?: number;
  onSelect?: (data: ClassroomTooltipCursorProps) => void;
};

function ClassroomTooltipCursor({
  x, y, width, height, payloadIndex, onSelect
}: ClassroomTooltipCursorProps) {
  if(!x || !y || !width || !height) {
    return null;
  };

  return (
    <Rectangle
      x={x}
      y={y}
      fill="var(--chakra-colors-solid-900)"
      fillOpacity=".1"
      width={width}
      height={height}
      onClick={(e) => onSelect && onSelect({ 
        x, y, width, height, payloadIndex
      })}
    />
  );
};

export { ClassroomTooltipCursor };

