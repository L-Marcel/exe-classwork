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
};

function TooltipItem({
  name,
  stroke,
  value,
  dataKey,
  payload,
  arr,
  isClassroom = false
}: TooltipItemProps) {
  let diff = arr? getDiffInCommitValue({
    commits: arr,
    dataKey: dataKey,
    order: payload.order,
    value: value
  }):0;

  return (
    <Text 
      fontWeight="hairline"
      whiteSpace="pre-wrap"
      mr={20}
    >
      <Span
        fontWeight="bold"
        color={stroke}
      >
        {getTooltipPayloadName(name, isClassroom)}:
      </Span> {value} { diff !== 0 && <Span
        fontWeight="semibold"
        color={diff > 0 ? "green.50" : "red.50"}
      > 
        ({diff > 0? "+":diff < 0? "-":""}{diff}) 
      </Span> }
    </Text>
  );
};

export { TooltipItem };

