import { Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { NamedIcon } from "../NamedIcon";
import { IconButton, IconButtonProps } from "./IconButton";

interface AddInstanceButtonProps extends IconButtonProps {
  href: string;
};

function AddInstanceButton({ href, ...rest }: Partial<AddInstanceButtonProps>) {
  return (
    <Link href={href} passHref>
      <ChakraLink>
        <IconButton
          data-testid="add-instance-button"
          aria-label="addInstanceButton"
          theme="primary"
          icon={<NamedIcon name="add"/>}
          {...rest}
        />
      </ChakraLink>
    </Link>
  );
};

export { AddInstanceButton };

