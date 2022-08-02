import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { getButtonStyle } from "./styles/getButtonStyle";

interface ButtonProps extends ChakraButtonProps {
  theme?: string;
  colorIndexes?: [string, string, string];
  forceHoverEffect?: boolean;
};

function Button({ 
  theme, 
  color, 
  colorIndexes,
  forceHoverEffect,
  ...rest 
}: ButtonProps) {
  return (
    <ChakraButton
      data-testid="button"
      {...getButtonStyle({ theme, color, colorIndexes, forceHoverEffect })}
      w="min-content"
      {...rest}
    />
  );
};


export { Button };

