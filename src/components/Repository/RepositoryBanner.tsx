import { Box, Tag, Text } from "@chakra-ui/react";
import { useUser } from "../../contexts/hooks/useUser";
import { IconButton } from "../Buttons/IconButton";
import { DateIntervalInput } from "../Inputs/DateIntervalInput";
import { Link } from "../Link";
import { NamedIcon } from "../NamedIcon";
import { Section } from "../Section";
import { Title } from "../Title";

interface RepositoryBannerProps {
  name: string;
  fullname: string;
  id: string;
  description?: string;
  homepage?: string;
  gitUrl?: string;
  sshUrl?: string;
  teams?: string[];
  commits?: Commit[];
  isAuthorizedUser: boolean;
  filteredCommits?: Commit[];
  onChangeInterval: (
    getFilteredResult: (date: string) => boolean
  ) => void;
};

function RepositoryBanner({
  name,
  fullname,
  description,
  homepage,
  id,
  gitUrl,
  sshUrl,
  teams = [],
  commits = [],
  filteredCommits = [],
  isAuthorizedUser = false,
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
      <DateIntervalInput
        initialAfterDate={
          commits.length > 0? (commits.sort((a, b) => a.order - b.order)[0].commitedAt || undefined):undefined
        }
        initialBeforeDate={
          commits.length > 0? (commits.sort((a, b) => a.order - b.order)[commits.length - 1].commitedAt || undefined):undefined
        }
        onChangeInterval={onChangeInterval}
      />
      <Box
        display="flex"
        gap={4}
      >
        { isAuthorizedUser && <Link 
          mt={5}
          href={`/app/repositories/${id}/config`}
        >
          <IconButton
            aria-label="redirect-to-config"
            icon={<NamedIcon name="cog"/>}
            theme="primary"
            h={8}
            w={8}
            minW="auto"
          />
        </Link> }
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

