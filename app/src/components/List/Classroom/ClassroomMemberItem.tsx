import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { useClassroom } from "../../../contexts/hooks/useClassroom";
import { IconButton } from "../../Buttons/IconButton";
import { Link } from "../../Link";
import { NamedIcon } from "../../NamedIcon";
import { Profile } from "../../Profile";
import { Title } from "../../Title";

interface ClassroomMemberItem {
  member: ClassroomRelation;
  rolesAreRestricted?: boolean;
  userIsOwner?: boolean;
  userIsAuthorized?: boolean;
};

function ClassroomMemberItem({ 
  member, 
  rolesAreRestricted = false,
  userIsOwner = false,
  userIsAuthorized = false
}: ClassroomMemberItem) {
  const { classroom } = useClassroom();
  const { user } = member;
  
  return (
    <HStack
      spacing={3}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      textAlign="start"
      minW={["85%", "80%", "80%", "40%", "20%"]}
      w="fill"
      bgColor="solid.100"
      borderRadius={15}
      borderLeft="2px solid"
      borderColor="primary.700"
      p={[2, 4]}
      position="relative"
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
          {(!rolesAreRestricted)? member.role || "MEMBER":"MEMBER"}
        </Text>
      </Stack>
      { (userIsAuthorized && ((member.role !== "ADMIN" || userIsOwner) && member.role !== "OWNER")) && <Box
        position="absolute"
        top={-1}
        right={[-8, 0]}
        p={4}
      >
        <Link
          href={`/app/classrooms/${classroom?.id}/members/${member?.user?.id}`}
        >
          <IconButton
            data-testid="icon-button"
            label="Member configuration"
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
      </Box> }
    </HStack>
  );
};

export { ClassroomMemberItem };

