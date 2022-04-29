import { HStack, Text } from "@chakra-ui/react";
import { NamedIcon } from "../NamedIcon";

function SearchingMessage() {
  return (
    <HStack
      mt={3}
      spacing={2}
      color="primary.700"
    >
      <NamedIcon name="info"/>
      <Text>Searching...</Text>
    </HStack>
  );
};

export { SearchingMessage };

