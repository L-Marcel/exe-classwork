import { ButtonProps } from "@chakra-ui/react";
import { IconButton } from "../Buttons/IconButton";
import { NamedIcon } from "../NamedIcon";
import Link from "next/link";
interface NavigationItemProps extends ButtonProps {
  path: string;
  name: string;
  isSelected: boolean;
};

function NavigationItem({ path, isSelected, name, ...rest }: NavigationItemProps) {
  return (
    <Link
      data-testid="navigation-item"
      href={path}
    >
      <IconButton
        aria-label={`${path}-navigation`}
        icon={<NamedIcon name={name}/>}
        theme={isSelected? "primary":"solid"}
        color={isSelected && "black.100"}
        {...rest}
      />
    </Link>
  );
};

export { NavigationItem };