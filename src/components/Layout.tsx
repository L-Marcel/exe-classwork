import { Box, BoxProps } from "@chakra-ui/react";
import { m } from "framer-motion";
import Head from "next/head";

interface LayoutProps extends BoxProps {};

function Layout({ children, ...rest }: LayoutProps) {
  return (
    <Box
      data-testid="layout"
      position="fixed"
      w="100%"
      top={0}
      left={0}
      as={m.div}
      display="flex"
      flexDir="column"
      data-test
      h="100vh"
      overflowY="auto"
      overflowX="hidden"
      {...rest}
    >
      <Head>
        <title>Exe: classwork</title>
      </Head>
      {children}
    </Box>
  );
};

export { Layout };

