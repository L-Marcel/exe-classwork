import { Box, BoxProps } from "@chakra-ui/react";
import katex from "katex";

interface EquationProps extends BoxProps {
  calc: string;
  theme?: string;
};

function Equation({
  calc,
  theme,
  ...rest
}: EquationProps) {
  const html = katex.renderToString(calc, {
    throwOnError: false,
    displayMode: false,
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
      __css={theme? {
        "::-webkit-scrollbar-thumb": {
          background: theme
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: theme
        },
      }:undefined}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      {...rest}
    />
  );
};

export { Equation };

