import { HStack, Stack, Text } from "@chakra-ui/react";
import { Profile } from "../../Profile";

interface ClassroomMemberItem {
  member: ClassroomRelation;
};

function ClassroomMemberItem({ member }: ClassroomMemberItem) {
  const { user } = member;
  
  return (
    <HStack
      spacing={3}
      minW="100%"
      p={2}
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
        <Text
          lineHeight="15px"
          fontWeight={600}
        >
          {member.role}
        </Text>
        <Text
          lineHeight="15px"
        >
          {user.name ?? user.username}
        </Text>
      </Stack>
    </HStack>
  );
};

export { ClassroomMemberItem };

