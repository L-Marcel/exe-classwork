import { Box, Text, Heading, BoxProps } from "@chakra-ui/react";
import { m } from "framer-motion";
import { fadeToTop } from "../theme/animations/motion";
import { Span } from "./Span";

interface LogoProps extends BoxProps {};

function Logo({ ...rest }: LogoProps) {
  return (
    <Box
      as={m.div}
      display="flex"
      flexDir="column"
      maxW={[220, 220, 350, 450]}
      w="fit-content"
      {...rest}
      {...fadeToTop}
    >
      <Text
        mb={[-5, -5, -7, -9]}
        ml={[-1, -1, 0, 2]}
        fontSize={[16, 16, 25]}
      >
        ex<sub>e</sub>
      </Text>
      <Heading
        bgGradient="linear(to-r, primary.200, primary.600)"
        bgClip="text"
        fontSize={[40, 40, 60, 80]}
      >
        <Span color="primary.500">c</Span><Span>l</Span>asswork
      </Heading>
    </Box>
  );
};

export { Logo };