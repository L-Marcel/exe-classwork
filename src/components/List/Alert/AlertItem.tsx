import { Avatar, Box, Text } from "@chakra-ui/react";
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
  const { user } = useUser();

  const isNew = !alert.visualizedBy.some(u => u === user.id);

  return (
    <Box
      py={3}
      px={4}
      bgColor="solid.100"
      borderLeft={isNew? "2px solid var(--chakra-colors-orange-700)!important":"2px solid var(--chakra-colors-primary-700)!important"}
      borderRadius={8}
    >
      <Text
        fontWeight="normal"
        color="primary.700"
      >
        {isNew && <Span
          color="orange.700"
        >
          #new
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

