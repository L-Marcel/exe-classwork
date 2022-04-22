import { ButtonProps } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../Buttons/Button";

interface NavigationItemProps extends ButtonProps {
  path: string;
  title: string;
};

function NavigationItem({ path, title, ...rest }: NavigationItemProps) {
  const { asPath } = useRouter();
  const isSelected = asPath.toLowerCase() === path.toLowerCase();

  return (
    <Link href={path}>
      <Button
        theme={isSelected? "primary":"solid"}
        color={isSelected && "black.100"}
        borderRightRadius={0}
        borderRight="2px solid"
        borderColor={isSelected? "primary.200":"solid.300"}
        _notFirst={{
          borderLeftRadius: 0,
        }}
        {...rest}
      >
        {title}
      </Button>
    </Link>
  );
};

export { NavigationItem };