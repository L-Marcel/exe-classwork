import { Avatar, Box, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { useUser } from "../../../contexts/hooks/useUser";
import { getAlertTags } from "../../../utils/getAlertTags";
import { getFormattedDateTime } from "../../../utils/getFormattedDate";
import { Span } from "../../Span";

interface AlertItemProps {
  alert: Alert
};

function AlertItem({
  alert
}: AlertItemProps) {
  const color = useColorModeValue(["solid.75", "solid.100"], ["solid.100", "solid.75"]);
  const { user } = useUser();

  const isNew = !alert.visualizedBy.some(u => u === user.id);

  return (
    <Box
      py={3}
      px={4}
      bgColor={isNew? color[0]:color[1]}
      filter={!isNew? "grayscale(.5)":undefined}
      borderLeft={isNew? "2px solid var(--chakra-colors-primary-700)!important":"2px solid var(--chakra-colors-orange-700)!important"}
      borderRadius={8}
    >
      <Text
        fontWeight="normal"
        color={!isNew? "orange.700":"primary.700"}
        display="flex"
        alignItems="center"
      >
        {isNew && <Span
          color="primary.700"
          h="1.1rem"
          mt="2px"
          mr="7px"
        >
          <Tag
            fontSize={12}
            px="6px"
            minH="1.1rem"
            borderLeft="2px solid var(--chakra-colors-primary-700)!important"
          >
            NEW
          </Tag>
        </Span>} {getAlertTags({
          type: alert.type,
          classroom: alert.classroom?.title,
          team: alert.team?.title
        })}
      </Text>
      <Box
        display="flex"
        alignItems="center"
      >
        {alert.avatarUrl && 
          <Avatar
            src={alert.avatarUrl}
            size="sm"
            display={["none", "none", "inline-flex", "inline-flex", "inline-flex", "inline-flex"]}
            mr={2}
          />
        }
        <Box
          display="flex"
          flexDir="column"
        >
          <Text
            fontWeight="bold"
          >
            {alert.description}
          </Text>
          <Text
            fontSize="sm"
          >
            {getFormattedDateTime(alert.createdAt.toString())}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export { AlertItem };

