import { HStack, Text } from "@chakra-ui/react";
import { NamedIcon } from "../NamedIcon";

function SearchingMessage() {
  return (
    <HStack
      mt={3}
      spacing={2}
      alignSelf={["center", "center", "flex-start"]}
      color="primary.400"
    >
      <NamedIcon name="info"/>
      <Text>Searching...</Text>
    </HStack>
  );
};

export { SearchingMessage };

