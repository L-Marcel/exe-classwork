import { IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps } from "@chakra-ui/react";
import { getButtonStyle } from "./styles/getButtonStyle";

interface IconButtonProps extends ChakraIconButtonProps {
  theme?: string;
  colorIndexes?: [string, string, string];
};

function IconButton({ 
  theme, 
  color, 
  colorIndexes, 
  ...rest
}: IconButtonProps) {
  return (
    <ChakraIconButton
      {...getButtonStyle({ theme, color, colorIndexes })}
      fontSize={18}
      {...rest}
    />
  );
};

export { IconButton };