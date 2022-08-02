import { Box, Heading, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useGlobal } from "../../../contexts/hooks/useGlobal";
import { useIsLoading } from "../../../contexts/hooks/useIsLoading";
import { useUser } from "../../../contexts/hooks/useUser";
import { Api } from "../../../services/api";
import { scaleOnInteract } from "../../../theme/animations/motion";
import { NamedIcon } from "../../NamedIcon";

interface ClassroomItemProps {
  title: string;
  id: string;
  description?: string;
  subject?: string;
  alerts?: any[];
};

function ClassroomItem({ title, description, subject, id, alerts = [] }: ClassroomItemProps) {
  const router = useRouter();

  const { isLoading } = useIsLoading();

  const { user } = useUser();
  const { global: globalSocket } = useGlobal();

  const [haveAlert, setHaveAlert] = useState(false);

  const checkIfHaveAlerts = useCallback(() => {
    Api.get(`user/classroom/${id}/alerts/check`).then(res => {
      if(res.data.count > 0) {
        setHaveAlert(true);
      } else {
        setHaveAlert(false);
      };
    }).catch(() => {});
  }, [setHaveAlert]);
  
  useEffect(() => {
    if(globalSocket !== null && user !== null) {
      checkIfHaveAlerts();
      
      globalSocket.on("@alerts/new", () => {
        checkIfHaveAlerts();
      })
    };
  }, [globalSocket, setHaveAlert, checkIfHaveAlerts]);

  useEffect(() => {
    if(user !== null) {
      checkIfHaveAlerts();
    };
  }, [isLoading]);

  return (
    <Box
      as={m.button}
      minW={["85%", "80%", "80%", "40%", "20%", "20.1%"]}
      w="fill"
      bgColor="solid.100"
      borderRadius={15}
      borderLeft="2px solid"
      borderColor="primary.700"
      p={[4, 6]}
      flexDir="column"
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      textAlign="start"
      onClick={() => router.push(`/app/classrooms/${id}`)}
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
          {title.slice(0, 30)}{title.length > 30 && "..."}
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
          right={[-8, "6px"]}
          top={-1}
        >
          <NamedIcon 
            name="alerts"
            h="15px"
            w="15px"
            maxW="15px"
            maxH="15px"
            color={haveAlert? "orange.400":null}
          />
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

export { ClassroomItem };

