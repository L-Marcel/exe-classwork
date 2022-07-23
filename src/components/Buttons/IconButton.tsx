import { IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps, useBreakpointValue } from "@chakra-ui/react";
import { TooltipOnHover } from "../TooltipOnHover";
import { getButtonStyle } from "./styles/getButtonStyle";

export interface IconButtonProps extends ChakraIconButtonProps {
  theme?: string;
  colorIndexes?: [string, string, string];
  layoutId?: string;
  forceHoverEffect?: boolean;
  label?: string;
  labelBgColor?: string;
};

function IconButton({ 
  theme, 
  color, 
  colorIndexes,
  forceHoverEffect,
  label,
  labelBgColor,
  ...rest
}: IconButtonProps) {
  const isWideOrNormalVersion = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    xl: true,
    lg: true
  });

  if(!label) {
    return (
      <ChakraIconButton
        layoutId
        data-testid="icon-button"
        {...getButtonStyle({ theme, color, colorIndexes, forceHoverEffect })}
        size={isWideOrNormalVersion? "md":"sm"}
        fontSize={18}
        {...rest}
      />
    );
  };
 
  return (
    <TooltipOnHover
      label={label}
      bgColor={labelBgColor ?? "primary.700"}
    >
      <ChakraIconButton
        layoutId
        data-testid="icon-button"
        {...getButtonStyle({ theme, color, colorIndexes, forceHoverEffect })}
        size={isWideOrNormalVersion? "md":"sm"}
        fontSize={18}
        {...rest}
      />
    </TooltipOnHover>
  );
};

export { IconButton };

