import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import { m } from "framer-motion";
import Head from "next/head";
import { fadeLayout } from "../theme/animations/motion";
import { ToggleColorButton } from "./Buttons/ToogleColorButton";

interface LayoutProps extends BoxProps {};

function Layout({ children, bgImage, ...rest }: LayoutProps) {
  const image = useColorModeValue("", "_dark");
  const path = bgImage as string;
  let n: string, mi: string, bgImg: string;

  if(path && path?.includes(".")) {
    [n, mi] = path.split(".");
    bgImg = n + image + "." + mi; 
  };

  return (
    <Box
      data-testid="layout"
      as={m.div}
      display="flex"
      flexDir="column"
      data-test
      bgImage={path? bgImg:null}
      p={8}
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