import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { getButtonStyle } from "./styles/getButtonStyle";

interface ButtonProps extends ChakraButtonProps {
  theme?: string;
  colorIndexes?: [string, string, string];
};

function Button({ 
  theme, 
  color, 
  colorIndexes, 
  ...rest 
}: ButtonProps) {

  return (
    <ChakraButton
      {...getButtonStyle({ theme, color, colorIndexes })}
      w="min-content"
      {...rest}
    />
  );
};


export { Button };