import { Box, Heading, Text } from "@chakra-ui/react";
import { NamedIcon } from "../../NamedIcon";

interface ClassroomItemProps {
  title: string;
  description?: string;
  subject?: string;
  alerts?: any[];
};

function ClassroomItem({ title, description, subject, alerts = [] }: ClassroomItemProps) {
  return (
    <Box
      bgColor="solid.100"
      w="fill"
      minW={["85%", "80%", "80%", "40%", "20%", "20.1%"]}
      borderRadius={15}
      borderLeft="2px solid"
      borderColor="primary.500"
      p={[4, 6]}
    >
      <Box
        display="flex"
        justifyContent="space-between"
      >
        <Heading
          fontSize="1.4rem"
          color="primary.500"
        >
          {title}
        </Heading>
        <Box
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          minW="28px"
          minH="28px"
          maxW="28px"
          maxH="28px"
          bgColor="solid.200"
          borderRadius={15}
        >
          <NamedIcon 
            name="alerts"
            h="15px"
            w="15px"
            maxW="15px"
            maxH="15px"
          />
          {
            alerts.length > 0 && <Text
              position="absolute"
              top="-5px"
              right="-10px"
              bgColor="primary.500"
              minW="18px"
              minH="18px"
              maxW="18px"
              maxH="18px"
              borderRadius={15}
              fontSize="12px"
              color="black"
              textAlign="center"
            >
              {alerts.length}
            </Text>
          }
        </Box>
      </Box>
      <Text
        mt={-1}
        fontSize=".9rem"
      >
        {subject}
      </Text>
      <Text 
        mt={1}
        fontSize="1rem"
      >
        {description}
      </Text>
    </Box>
  );
};

export { ClassroomItem };

