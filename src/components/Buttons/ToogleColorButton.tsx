import { IconButtonProps, useColorMode } from "@chakra-ui/react";
import { NamedIcon } from "../NamedIcon";
import { IconButton } from "./IconButton";

interface ToogleColorButtonProps extends Partial<IconButtonProps> {};

function ToggleColorButton({ ...rest }: ToogleColorButtonProps) {
  const { toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="toogleColorButton"
      icon={<NamedIcon name="sun"/>}
      borderRadius={60}
      w={10}
      h={10}
      onClick={toggleColorMode}
      {...rest}
    />
  );
};

export { ToggleColorButton };