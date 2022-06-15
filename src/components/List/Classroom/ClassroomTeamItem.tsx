import { Avatar, AvatarGroup, Box, Stack, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { scaleIn } from "../../../theme/animations/motion";
import { Title } from "../../Title";

interface ClassroomTeamItem {
  team: Team;
};

function ClassroomTeamItem({ team }: ClassroomTeamItem) {
  if(!team) {
    return null;
  };

  const { users, title, repository } = team;
  
  return (
    <Stack
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
          {repository? repository?.fullname:"No repository linked"}
        </Text>
        { repository && <Text
          mt={2}
          fontWeight="normal"
          bgColor="primary.700"
          w="min"
          whiteSpace="nowrap"
          px={2}
          borderRadius={16}
        >
          {repository?._count.commits} commits
        </Text> }
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
    </Stack>
  );
};

export { ClassroomTeamItem };

