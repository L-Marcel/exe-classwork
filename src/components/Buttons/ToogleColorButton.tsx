import { useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { NamedIcon } from "../NamedIcon";
import { IconButton, IconButtonProps } from "./IconButton";

interface ToogleColorButtonProps extends IconButtonProps {};

function ToggleColorButton({ ...rest }: Partial<ToogleColorButtonProps>) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      data-testid="toggle-button"
      aria-label="toogleColorButton"
      icon={<NamedIcon name={colorMode === "dark"? "sun":"moon"}/>}
      onClick={toggleColorMode}
      {...rest}
    />
  );
};

export { ToggleColorButton };