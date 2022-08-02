import { Text, TextProps } from "@chakra-ui/react";

function Span({ ...rest }: TextProps) {
  return (
    <Text
      data-testid="span"
      as="span"
      color="primary.700"
      {...rest}
    />
  );
};

export { Span };
