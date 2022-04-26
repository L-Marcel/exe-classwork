import { Heading, HeadingProps } from "@chakra-ui/react";
import { Span } from "./Span";

function Title({ children, ...rest }: HeadingProps) {
  return (
    <Heading
      textAlign={["center", "center", "left"]}
      bgGradient="linear(to-r, primary.200, primary.600)"
      bgClip="text"
      {...rest}
    >
      { typeof children === "string" && children.length >= 3? 
        <>
          <Span color="primary.500">{children[0]}</Span>
          <Span>{children[1]}</Span>{children.slice(2, children.length)}
        </>:children
      }
    </Heading>
  );
};

export { Title };

