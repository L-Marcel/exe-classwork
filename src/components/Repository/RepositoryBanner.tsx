import { Box, Tag, Text } from "@chakra-ui/react";
import { useUser } from "../../contexts/hooks/useUser";
import { Link } from "../Link";
import { Section } from "../Section";
import { Title } from "../Title";
import { RepositoryDateInput } from "./RepositoryDateInput";

interface RepositoryBannerProps {
  name: string;
  fullname: string;
  description?: string;
  homepage?: string;
  gitUrl?: string;
  sshUrl?: string;
  teams?: string[];
  commits?: Commit[];
  filteredCommits?: Commit[];
  onChangeInterval: (commits: Commit[]) => void;
};

function RepositoryBanner({
  name,
  fullname,
  description,
  homepage,
  gitUrl,
  sshUrl,
  teams = [],
  commits = [],
  filteredCommits = [],
  onChangeInterval
}: RepositoryBannerProps) {
  const { user } = useUser();

  const committeds: string[] = commits.reduce((prev, cur) => {
    if(!prev.includes(cur.userGithubLogin)) {
      prev.push(cur.userGithubLogin);
    };
    
    return prev;
  }, []);

  const filteredCommitteds: string[] = filteredCommits.reduce((prev, cur) => {
    if(!prev.includes(cur.userGithubLogin)) {
      prev.push(cur.userGithubLogin);
    };
    
    return prev;
  }, []);

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
      <RepositoryDateInput
        commits={commits || []}
        onChangeInterval={onChangeInterval}
      />
      <Box
        display="flex"
        gap={4}
      >
        { commits && <Tag
            fontWeight="bold"
            bgColor="primary.800"
            color="blackAlpha.900"
            mt={5}
          >
            Commits: {(filteredCommits.length >= 0 && filteredCommits.length >= commits.length)? 
              commits.length:`${filteredCommits.length}/${commits.length}`
            }
          </Tag>
        }
        { committeds.length > 0 && <Tag
            fontWeight="bold"
            bgColor="primary.800"
            color="blackAlpha.900"
            mt={5}
          >
            Committeds: {(filteredCommitteds.length >= 0 && filteredCommitteds.length >= committeds.length)? 
              committeds.length:`${filteredCommitteds.length}/${committeds.length}`
            }
          </Tag>
        }
      </Box>
    </Section>
  );
};

export { RepositoryBanner };

