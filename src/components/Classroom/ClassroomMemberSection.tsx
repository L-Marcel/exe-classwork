import { Box, Stack, Text } from "@chakra-ui/react";
import { ClassroomMemberItem } from "../List/Classroom/ClassroomMemberItem";
import { Section } from "../Section";
import { Title } from "../Title";

interface ClassroommembersSection {
  members: ClassroomRelation[];
};

function ClassroomMembersSection({ members }: ClassroommembersSection) {
  return (
    <Section
      bgColor="solid.75"
    >
      <Stack
        spacing={3}
        display="flex"
        w="100%"
      >
        <Box>
          <Title
            fontSize="1.8rem"
            fontWeight="bold"
          >
            Members
          </Title>
          <Text
            mt={-2}
            fontSize="1.2rem"
          >
            Find all members here
          </Text>
        </Box>
        <Stack
          display="flex"
          w="100%"
        >
          {
            [...members, ...members, ...members, ...members].map(c => {
              return (
                <ClassroomMemberItem
                  key={c.userId}
                  member={c}
                />
              );
            })
          }
        </Stack>
      </Stack>
    </Section>
  );
};

export { ClassroomMembersSection };

