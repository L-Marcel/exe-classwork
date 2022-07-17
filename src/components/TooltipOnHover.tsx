import { Tooltip, TooltipProps } from "@chakra-ui/react";

interface TooltipOnHoverProps extends TooltipProps {};

function TooltipOnHover({
  ...rest
}: TooltipOnHoverProps) {
  return (
    <Tooltip 
      bgColor="primary.800"
      borderRadius={5}
      {...rest}
    />
  );
};

export { TooltipOnHover };
