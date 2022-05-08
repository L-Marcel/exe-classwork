import { Avatar, AvatarGroup, Box, HStack, Stack, Text } from "@chakra-ui/react";
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
    <HStack
      as={m.button}
      spacing={3}
      minW="100%"
      p={4}
      bgColor="solid.75"
      borderRadius={16}
      _hover={{
        bgColor: "solid.100"
      }}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      textAlign="start"
    >
      <Stack
        spacing={1}
      >
        <Box
          display="flex"
          flexDir="column"
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
            {repository? repository?.name:"No repository linked"}
          </Text>
        </Box>
        <AvatarGroup
          as={m.div}
          size="sm"
          max={5}
          {...scaleIn}
        >
          {users.map(u => {
            return (
              <Avatar
                size="sm"
                bgColor="transparent"
                borderColor={repository && repository.owner.id === u.user.id? "primary.700":"transparent"}
                src={u.user.avatarUrl}
                name={u.user.name ?? u.user.username}
              />
            );
          })}
        </AvatarGroup>
      </Stack>
    </HStack>
  );
};

export { ClassroomTeamItem };

