import { Box, BoxProps } from "@chakra-ui/react";
import katex from "katex";

interface EquationProps extends BoxProps {
  calc: string;
};

function Equation({
  calc,
  ...rest
}: EquationProps) {
  const html = katex.renderToString(calc, {
    throwOnError: false,
    strict: false
  });

  return (
    <Box
      bgColor="solid.100"
      display="inline-flex"
      maxW={["75vw", "75vw", "100%"]}
      overflow="auto"
      whiteSpace="nowrap"
      p={4}
      borderRadius={8}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      {...rest}
    />
  );
};

export { Equation };

