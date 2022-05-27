import { Text } from "@chakra-ui/react";
import { Section } from "../Section";
import { Title } from "../Title";

interface RepositoryBannerProps {
  name: string;
  fullname: string;
  description?: string;
  homepage?: string;
  gitUrl?: string;
  sshUrl?: string;
  teams?: string[];
  commits?: string[];
};

function RepositoryBanner({
  name,
  fullname,
  description,
  homepage,
  gitUrl,
  sshUrl,
  teams = [],
  commits = []
}: RepositoryBannerProps) {
  return (
    <Section
      isNeabyOfNavigation
    >
      <Title>
        {name}
      </Title>
      {
        fullname && <Text
          fontSize="1.1rem"
          color="solid.500"
        >
          Fullname: {fullname}
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

export { RepositoryBanner };