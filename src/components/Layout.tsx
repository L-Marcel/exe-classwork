import { Box, BoxProps } from "@chakra-ui/react";
import { m } from "framer-motion";
import Head from "next/head";
import { Navigation } from "./Navigation";

interface LayoutProps extends BoxProps {};

function Layout({ children, ...rest }: LayoutProps) {
  return (
    <Box
      data-testid="layout"
      as={m.div}
      display="flex"
      flexDir="column"
      data-test
      h="100vh"
      overflowY="auto"
      overflowX="hidden"
      {...rest}
      py={10}
      px={[10, 14, 28]}
    >
      <Head>
        <title>Exe: classwork</title>
      </Head>
      {children}
      <Navigation/>
    </Box>
  );
};

export { Layout };

