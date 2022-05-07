import { HStack, Stack, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { Profile } from "../../Profile";
import { Title } from "../../Title";

interface ClassroomMemberItem {
  member: ClassroomRelation;
};

function ClassroomMemberItem({ member }: ClassroomMemberItem) {
  const { user } = member;
  
  return (
    <HStack
      as={m.button}
      spacing={3}
      minW="100%"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      textAlign="start"
      p={4}
      bgColor="solid.10"
      borderRadius={16}
      _hover={{
        bgColor: "solid.100"
      }}
    >
      <Profile
        user={user}
      />
      <Stack
        spacing={1}
      >
        <Title
          mt={-1}
          fontSize="1.3rem"
          fontWeight={600}
        >
          {user.name ?? user.username}
        </Title>
        <Text
          lineHeight="15px"
          fontSize=".8rem"
        >
          {member.role || "MEMBER"}
        </Text>
      </Stack>
    </HStack>
  );
};

export { ClassroomMemberItem };

