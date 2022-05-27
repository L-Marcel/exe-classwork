import { Box, Heading, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { scaleOnInteract } from "../../../theme/animations/motion";
import { NamedIcon } from "../../NamedIcon";

interface RepositoryItemProps {
  name: string;
  fullname: string;
  id: string;
  description?: string;
  subject?: string;
  alerts?: any[];
};

function RepositoryItem({ name, fullname, description, subject, id, alerts = [] }: RepositoryItemProps) {
  const router = useRouter();
  const alertsCount = alerts.length >= 9? 9:alerts.length;

  return (
    <Box
      as={m.button}
      bgColor="solid.100"
      w="fill"
      minW={["85%", "80%", "80%", "40%", "20%", "20.1%"]}
      borderRadius={15}
      borderLeft="2px solid"
      borderColor="primary.700"
      p={[4, 6]}
      flexDir="column"
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      textAlign="start"
      onClick={() => router.push(`/app/${router.query?.githubId}/repositories/${id}`)}
      cursor="pointer"
      {...scaleOnInteract}
    >
      <Box
        position="relative"
        display="flex"
        justifyContent="space-between"
        w="100%"
      >
        <Heading
          fontSize="1.4rem"
          color="primary.700"
          maxW={["65vw", "70vw", "80vw", 350, 220, 300]}
          pr={[0, 12]}
          mt={-1}
        >
          {name?.slice(0, 30)}{name?.length > 30 && "..."}
        </Heading>
        <Box
          position="absolute"
          display="flex"
          justifyContent="center"
          alignItems="center"
          minW="28px"
          minH="28px"
          maxW="28px"
          maxH="28px"
          bgColor="solid.200"
          borderRadius={15}
          right={[-8, 0]}
          top={-1}
        >
          <NamedIcon 
            name="alerts"
            h="15px"
            w="15px"
            maxW="15px"
            maxH="15px"
          />
          {
            alertsCount > 0 && <Text
              position="absolute"
              top="-5px"
              right="-10px"
              bgColor="primary.700"
              minW="18px"
              minH="18px"
              maxW="18px"
              maxH="18px"
              borderRadius={15}
              fontSize="12px"
              color="black"
              textAlign="center"
            >
              {alerts.length > 9 && "+"}{alertsCount}
            </Text>
          }
        </Box>
      </Box>
      <Text
        mt={-1}
        fontSize=".9rem"
        maxW={["63vw", "77vw", "77vw", 330, 200, 280]}
      >
        {subject}
      </Text>
      {
        description && <Text 
          mt={3}
          fontSize="1rem"
          maxW={["68vw", "80vw", "80vw", "50vw", 220, 300]}
        >
          {description?.slice(0, 200)}{description?.length > 200 && "..."}
        </Text>
      }
    </Box>
  );
};

export { RepositoryItem };
