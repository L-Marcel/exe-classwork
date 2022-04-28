import { Text } from "@chakra-ui/react";
import { Section } from "../Section";
import { Title } from "../Title";

interface ClassroomBanner {
  title: string;
  subject?: string;
  description?: string;
};

function ClassroomBanner({ 
  title, 
  subject, 
  description
}: ClassroomBanner) {
  return (
    <Section
      forceWidth
      isNeabyOfNavigation
    >
      <Title>
        {title}
      </Title>
      {
        subject && <Text
          fontSize="1.1rem"
          color="solid.500"
        >
          Subject: {subject}
        </Text>
      }
      { description && <Text 
          mt={2}
        >
          {description}
        </Text>
      }
    </Section>
  );
};

export { ClassroomBanner };

