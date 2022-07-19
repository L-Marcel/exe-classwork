import { Box, Tag, Text } from "@chakra-ui/react";
import { useUser } from "../../contexts/hooks/useUser";
import { IconButton } from "../Buttons/IconButton";
import { DateIntervalInput } from "../Inputs/DateIntervalInput";
import { Link } from "../Link";
import { NamedIcon } from "../NamedIcon";
import { Section } from "../Section";
import { Title } from "../Title";
import { TooltipOnHover } from "../TooltipOnHover";

interface RepositoryBannerProps {
  name: string;
  fullname: string;
  id: string;
  description?: string;
  homepage?: string;
  gitUrl?: string;
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
        maxW="100%"
        flexWrap="wrap"
        gap={2}
        rowGap={3}
        mt={5}
      >
        <TooltipOnHover
          label="Github repository"
        >
          <IconButton
            aria-label="github-repository-page"
            icon={<NamedIcon name="github"/>}
            onClick={() =>  window.open(`https://github.com/${fullname}`, "_blank")}
            theme="primary"
            h={8}
            w={8}
            minW="auto"
          />
        </TooltipOnHover>
        {
          homepage && <TooltipOnHover
            label="Deployment environment"
          >
            <IconButton
              aria-label="homepage"
              icon={<NamedIcon name="website"/>}
              onClick={() =>  window.open(homepage, "_blank")}
              theme="primary"
              h={8}
              w={8}
              minW="auto"
            />
          </TooltipOnHover>
        }
        { (isAuthorizedUser && id) && <Link 
          href={`/app/repositories/${id}/config`}
        >
          <TooltipOnHover
            label="Repository configuration"
          >
            <IconButton
              aria-label="redirect-to-config"
              icon={<NamedIcon name="cog"/>}
              theme="primary"
              h={8}
              w={8}
              minW="auto"
            />
          </TooltipOnHover>
        </Link> }
        <Box
          display="flex"
          maxW="100%"
          flexWrap="wrap"
          gap={2}
        >
          { commits && <Tag
              fontWeight="bold"
              bgColor="primary.800"
              color="blackAlpha.900"
              whiteSpace="nowrap"
              minH="24px"
              h="min"
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
              whiteSpace="nowrap"
              minH="24px"
              h="min"
            >
              Committeds: {(filteredCommitteds.length >= 0 && filteredCommitteds.length >= committeds.length)? 
                committeds.length:`${filteredCommitteds.length}/${committeds.length}`
              }
            </Tag>
          }
          </Box>
      </Box>
    </Section>
  );
};

export { RepositoryBanner };

