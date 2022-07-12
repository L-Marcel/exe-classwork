import { Text } from "@chakra-ui/react";
import { Button } from "./Buttons/Button";
import { Title } from "./Title";

interface ReferenceButtonProps {
  title: string;
  description: string;
  href?: string;
};

function ReferenceButton({
  description,
  title,
  href
}: ReferenceButtonProps) {
  return (
    <Button
      w="100%"
      h="100%"
      display="flex"
      onClick={() => window.open(href, "_blank")}
      justifyContent="flex-start"
      alignItems="flex-start"
      flexDir="column"
      p={5}
      gap={1}
    >
      <Title
        fontSize={18}
      >
        {title}
      </Title>
      <Text
        whiteSpace="pre-wrap"
        textAlign="start"
      >
        {description}
      </Text>
    </Button>
  );
};

export { ReferenceButton };

