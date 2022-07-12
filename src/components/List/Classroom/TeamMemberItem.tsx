import { HStack, Stack, Text } from "@chakra-ui/react";
import { Profile } from "../../Profile";
import { Title } from "../../Title";

interface TeamMemberItem {
  member: TeamRelation;
};

function TeamMemberItem({ 
  member, 
}: TeamMemberItem) {
  return (
    <HStack
      spacing={3}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      textAlign="start"
      minW={["85%", "80%", "80%", "40%", "20%", "20.1%"]}
      w="fill"
      bgColor="solid.100"
      borderRadius={15}
      borderLeft="2px solid"
      borderColor="primary.700"
      p={[2, 4]}
      position="relative"
    >
      <Profile
        user={member?.user}
      />
      <Stack
        spacing={1}
      >
        <Title
          mt={-1}
          fontSize="1.3rem"
          fontWeight={600}
        >
          {member?.user?.name ?? member?.user?.username}
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

export { TeamMemberItem };

