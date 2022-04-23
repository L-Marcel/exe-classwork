import { Box, BoxProps } from "@chakra-ui/react";
import { m} from "framer-motion";
import Head from "next/head";
import { ToggleColorButton } from "./Buttons/ToogleColorButton";
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
      {...rest}
    >
      <Head>
        <title>Exe: classwork</title>
      </Head>
      {children}
      <Navigation/>
      <ToggleColorButton
        position="absolute"
        top={8}
        right={8}
      />
    </Box>
  );
};

export { Layout };