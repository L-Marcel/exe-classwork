import { HStack, Text } from "@chakra-ui/react";
import { NamedIcon } from "../NamedIcon";

interface NotFoundMessageProps {
  instance: string;
};

function NotFoundMessage({
  instance
}: NotFoundMessageProps) {
  return (
    <HStack
      mt={3}
      spacing={2}
      color="primary.700"
    >
      <NamedIcon name="info"/>
      <Text>No {instance} found.</Text>
    </HStack>
  );
};

export { NotFoundMessage };

