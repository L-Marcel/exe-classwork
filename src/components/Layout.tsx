import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { m } from "framer-motion";
import Head from "next/head";
import { fadeLayout } from "../theme/animations/motion";
import { ToggleColorButton } from "./Buttons/ToogleColorButton";

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
      {...rest}
      {...fadeLayout}
    >
      <Head>
        <title>Exe: classwork</title>
      </Head>
      {children}
      <ToggleColorButton
        position="absolute"
        top={8}
        right={8}
      />
    </Box>
  );
};

export { Layout };