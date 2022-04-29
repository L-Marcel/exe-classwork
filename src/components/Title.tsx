import { Heading, HeadingProps } from "@chakra-ui/react";

function Title({ children, ...rest }: HeadingProps) {
  return (
    <Heading
      textAlign="left"
      display="inline-block"
      bgGradient="linear(to-r, primary.600, primary.800, primary.900 95%)"
      bgClip="text"
      {...rest}
    >
      {children}
    </Heading>
  );
};

export { Title };

