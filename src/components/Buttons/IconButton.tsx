import { IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { getButtonStyle } from "./styles/getButtonStyle";

export interface IconButtonProps extends ChakraIconButtonProps {
  theme?: string;
  colorIndexes?: [string, string, string];
  layoutId?: string;
  forceHoverEffect?: boolean;
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ 
  theme, 
  color, 
  colorIndexes,
  forceHoverEffect,
  ...rest
}, ref = React.createRef()) => {
  const isWideOrNormalVersion = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    xl: true,
    lg: true
  });
 
  return (
    <ChakraIconButton
      layoutId
      data-testid="icon-button"
      {...getButtonStyle({ theme, color, colorIndexes, forceHoverEffect })}
      size={isWideOrNormalVersion? "md":"sm"}
      fontSize={18}s
      {...rest}
      ref={ref}
    />
  );
});

export { IconButton };

