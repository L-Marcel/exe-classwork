import { Heading, HeadingProps } from "@chakra-ui/react";

function Title({ children, color = "primary", ...rest }: HeadingProps) {
  return (
    <Heading
      textAlign="left"
      display="inline-block"
      bgGradient={`linear(to-r, ${color}.600, ${color}.800, ${color}.900 95%)`}
      bgClip="text"
      {...rest}
    >
      {children}
    </Heading>
  );
};

export { Title };

