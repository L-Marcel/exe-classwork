import { Tag, Text } from "@chakra-ui/react";
import { useUser } from "../../contexts/hooks/useUser";
import { Link } from "../Link";
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
  const { user } = useUser();

  return (
    <Section
      isNeabyOfNavigation
    >
      <Link 
        href={user? `/app/repositories`:`/`}
        tabIndex={0}
      >
        {'<'}- {user? "return":"login"}
      </Link>
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
      { commits && <Tag
          fontWeight="bold"
          bgColor="primary.700"
          mt={5}
        >
          Commits: {commits.length}
        </Tag>
      }
    </Section>
  );
};

export { RepositoryBanner };

