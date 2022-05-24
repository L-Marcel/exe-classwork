import { Avatar, Box, Text } from "@chakra-ui/react";
import { getAlertTags } from "../../../utils/getAlertTags";
import { getFormattedDateTime } from "../../../utils/getFormattedDate";

interface AlertItemProps {
  alert: Alert
};

function AlertItem({
  alert
}: AlertItemProps) {
  return (
    <Box
      py={3}
      px={4}
      bgColor="solid.100"
      borderLeft={`2px solid var(--chakra-colors-primary-700)!important`}
      borderRadius={8}
    >
      <Text
        fontWeight="normal"
        color="primary.700"
      >
        {getAlertTags({
          type: alert.type,
          classroom: alert.classroom?.title,
          repository: alert.repository?.fullname,
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

