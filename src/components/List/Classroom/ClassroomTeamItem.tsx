import { Avatar, AvatarGroup, Box, Progress, Stack, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useClassroom } from "../../../contexts/hooks/useClassroom";
import { useIsLoading } from "../../../contexts/hooks/useIsLoading";
import { useProgress } from "../../../contexts/hooks/useProgress";
import { scaleIn } from "../../../theme/animations/motion";
import { IconButton } from "../../Buttons/IconButton";
import { Link } from "../../Link";
import { NamedIcon } from "../../NamedIcon";
import { Title } from "../../Title";

interface ClassroomTeamItem {
  team: Team;
  repositoriesAreRestricted?: boolean;
};

function ClassroomTeamItem({ team, repositoriesAreRestricted = false }: ClassroomTeamItem) {
  const router = useRouter();
  const { classroom } = useClassroom();
  const { isLoading } = useIsLoading();

  if(!team) {
    return null;
  };

  const { users, title, repository } = team;

  const canOpen = !isLoading;

  const [progress, setProgress] = useState<NamedProgress>({
    target: 0,
    value: 0,
    status: team.repository?.status ?? "NOT_REQUESTED",
    name: team.repository?.fullname
  });

  const { getProgressByName } = useProgress();

  const _progress = getProgressByName(team.repository?.fullname);

  const repositoryIsLoading = progress?.status === "REQUESTED";
  const repositoryIsLoaded = !repositoryIsLoading && progress?.status === "LOADED";
  const canOpenRepository = (!repositoryIsLoading && repositoryIsLoaded);
  const theme = canOpenRepository? "primary.800":"orange.700";

  useEffect(() => {
    if(_progress && _progress !== progress) {
      setProgress(_progress);
    };
  }, [_progress, setProgress]);
  
  return (
    <Stack
      as={m.button}
      position="relative"
      spacing={0}
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      textAlign="start"
      minW={["85%", "80%", "80%", "40%", "20%", "20.1%"]}
      w="fill"
      bgColor="solid.100"
      borderRadius={15}
      borderLeft="2px solid"
      borderColor={theme.replace(/800/g, "700")}
      overflow="hidden"
      onClick={() => canOpen && router.push(`/app/classrooms/${classroom?.id}/teams/${team?.id}`)}
    >
      <Box
        display="flex"
        flexDir="column"
        p={4}
      >
        <Title
          fontSize="1.3rem"
          fontWeight={600}
        >
          {title}
        </Title>
        <Text
          mt="-3px"
          fontSize="0.9rem"
          fontWeight={400}
        >
          {!repositoriesAreRestricted? (repository? repository?.fullname:"No repository linked"):"Respoitory is restricted"}
        </Text>
        { (repository && !repositoriesAreRestricted) && <Box
          mt={2}
          display="flex"
          pointerEvents="none"
          bgColor="primary.700"
          px={0}
          w="fit-content"
          borderRadius={8}
          gap={-1}
        >
          <Text
            fontWeight="normal"
            w="min"
            whiteSpace="nowrap"
            display="flex"
            alignItems="center"
            px={2}
          >
            {repository?._count.commits} commits
          </Text>
          <Box
            display="flex"
            gap={2}
            bgColor="solid.100"
          >
            <IconButton
              mr={0}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://github.com/${repository?.fullname}`, "_blank");
              }}
              aria-label="repository-page-button"
              bgColor="primary.800"
              icon={<NamedIcon
                name="github"
              />}
              pointerEvents="all"
              size="sm"
              borderLeftRadius={0}
            />
            <IconButton
              mr={0}
              opacity={(!repositoryIsLoading && !repositoryIsLoaded) && .3}
              cursor={repositoryIsLoading? "progress":repositoryIsLoaded? "pointer":"not-allowed"}
              onClick={(e) => {
                e.stopPropagation();
                canOpenRepository && window.open(`/repositories/${repository?.fullname}`, "_blank");
              }}
              aria-label="repository-page-button"
              bgColor={theme}
              icon={<NamedIcon
                name="open"
              />}
              pointerEvents="all"
              size="sm"
            />
          </Box>
        </Box> }
      </Box>
      { repositoryIsLoading && <Progress
        as={m.div}
        isIndeterminate={!progress?.value && !progress?.target}
        w="100%"
        mt={4}
        className="orange"
        value={(progress?.value/progress?.target) * 100}
        h={2}
      /> }
      <Box
        display="flex"
        justifyContent="space-between"
        bgColor="solid.75"
        alignItems="stretch"
        w="100%"
        p={4}
      >
        <AvatarGroup
          as={m.div}
          max={6}
          size="sm"
          {...scaleIn}
        >
          {users.map(u => {
            return (
              <Box
                borderRadius={60}
                bgColor="solid.100"
                w="min-content"
              >
                <Avatar
                  bgColor="solid.250"
                  size="sm"
                  src={u.user.avatarUrl}
                  name={u.user.name ?? u.user.username}
                />
              </Box>
            );
          })}
        </AvatarGroup>
      </Box>
      <Box
        position="absolute"
        top={-1}
        right={[-8, 0]}
        p={4}
        onClick={e => e.stopPropagation()}
      >
        <Link
          href={`/app/classrooms/${classroom?.id}/teams/${team?.id}/config?returnToList=true`}
        >
          <IconButton
            data-testid="icon-button"
            justifyContent="center"
            borderRadius={15}
            alignItems="center"
            minW="28px"
            minH="28px"
            maxW="28px"
            maxH="28px"
            bgColor="solid.200"
            icon={<NamedIcon 
              name="cog"
              h="15px"
              w="15px"
              mt=".5px"
              maxW="15px"
              maxH="15px"
            />}
            aria-label="table-filter-button"
            fontSize={18}
          />
        </Link>
      </Box>
    </Stack>
  );
};

export { ClassroomTeamItem };

