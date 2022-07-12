import { Avatar, AvatarGroup, Box, Stack, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useClassroom } from "../../../contexts/hooks/useClassroom";
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

  if(!team) {
    return null;
  };

  const { users, title, repository } = team;
  
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
      borderColor="primary.700"
      overflow="hidden"
      onClick={() => router.push(`/app/classrooms/${classroom?.id}/teams/${team?.id}`)}
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
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/repositories/${repository?.fullname}`, "_blank");
              }}
              aria-label="repository-page-button"
              bgColor="primary.800"
              icon={<NamedIcon
                name="open"
              />}
              pointerEvents="all"
              size="sm"
            />
          </Box>
        </Box> }
      </Box>
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
      >
        <Link
          href={`/app/classrooms/${classroom?.id}/teams/${team?.id}/config`}
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

