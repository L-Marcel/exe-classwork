import { Text, TextProps } from "@chakra-ui/react";

function Span({ ...rest }: TextProps) {
  return (
    <Text
      as="span"
      color="primary.400"
      {...rest}
    />
  );
};

export { Span };