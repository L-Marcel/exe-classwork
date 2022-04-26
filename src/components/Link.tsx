import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { useIsLoading } from "../contexts/hooks/useIsLoading";

interface LinkProps extends ChakraLinkProps {
  href: string;
};

function Link({ href, children, ...rest }: LinkProps) {
  const {
    startLoading
  } = useIsLoading();

  return (
    <NextLink 
      href={href} 
      passHref
    >
      <ChakraLink
        onClick={startLoading}
        {...rest}
      >
        {children}
      </ChakraLink>
    </NextLink>
  );
};

export { Link };

