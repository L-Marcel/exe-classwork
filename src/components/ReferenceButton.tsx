import { Text } from "@chakra-ui/react";
import { Button } from "./Buttons/Button";
import { Link } from "./Link";
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
    <Link
      href={href || "#"}
      target="_blank"
    >
      <Button
        w="100%"
        h="100%"
        display="flex"
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
    </Link>
  );
};

export { ReferenceButton };

