import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { useIsLoading } from "../contexts/hooks/useIsLoading";

interface LinkProps extends Omit<ChakraLinkProps, "as"> {
  href: string;
  as?: string;
};

function Link({ href, as, children, ...rest }: LinkProps) {
  const {
    startLoading
  } = useIsLoading();

  return (
    <NextLink 
      href={href}
      as={as}
      passHref
    >
      <ChakraLink
        onClick={startLoading}
        tabIndex={-1}
        {...rest}
      >
        {children}
      </ChakraLink>
    </NextLink>
  );
};

export { Link };

