import { Text } from "@chakra-ui/react";
import { getDiffInCommitValue } from "../utils/getDiffInCommitValue";
import { getTooltipPayloadName } from "../utils/getTooltipPayloadName";
import { Span } from "./Span";

interface TooltipItemProps {
  name: string;
  stroke: string;
  value: any;
  dataKey: string;
  payload?: any;
  arr?: any[];
  isClassroom?: boolean;
  index?: number;
  firstItemBefore?: any;
};

function TooltipItem({
  name,
  stroke,
  value,
  dataKey,
  arr,
  isClassroom = false,
  index,
  firstItemBefore
}: TooltipItemProps) {
  let diff = arr? getDiffInCommitValue({
    commits: arr,
    dataKey: dataKey,
    indexOfLastItem: index - 1,
    firstItemBefore,
    value: value
  }):0;

  return (
    <Text 
      fontWeight="hairline"
      whiteSpace="pre-wrap"
      fontSize={[10, 10, 10, 14]}
      mr={[2, 2, 2, 5]}
    >
      <Span
        fontWeight="bold"
        color={stroke}
      >
        {getTooltipPayloadName(name, isClassroom)}:
      </Span> {value} { diff !== 0 && <Span
        fontWeight="semibold"
        color={diff > 0 ? "var(--chakra-colors-green-300)":"var(--chakra-colors-red-300)"}
      > 
        ({diff > 0? "+":diff < 0? "-":""}{diff}) 
      </Span> }
    </Text>
  );
};

export { TooltipItem };

