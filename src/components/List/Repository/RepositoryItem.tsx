import { Box, Heading, Progress, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProgress } from "../../../contexts/hooks/useProgress";
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

  const [progress, setProgress] = useState<NamedProgress>({
    target: 0,
    value: 0,
    status: "LOADED",
    name: fullname
  });

  const { getProgressByName } = useProgress();

  const _progress = getProgressByName(fullname);

  const isLoading = progress?.status === "REQUESTED"; //&& (progress?.target !== 0 && progress?.value !== 0);
  const theme = !isLoading? "primary.700":"orange.700";
  
  useEffect(() => {
    if(_progress && _progress !== progress) {
      setProgress(_progress);
    };
  }, [_progress, setProgress]);

  return (
    <Box
      as={m.button}
      bgColor="solid.100"
      w="fill"
      minW={["85%", "80%", "80%", "40%", "20%", "20.1%"]}
      borderRadius={15}
      borderLeft="2px solid"
      borderColor={theme }
      p={[4, 6]}
      flexDir="column"
      position="relative"
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      textAlign="start"
      onClick={() => !isLoading && router.push(`/app/${router.query?.githubId}/repositories/${id}`)}
      cursor={isLoading? "progress":"pointer"}
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
          color={theme}
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
      { isLoading && <Progress
        as={m.div}
        isIndeterminate={!progress?.value && !progress?.target}
        w="100%"
        mt={4}
        className="orange"
        borderRadius={8}
        value={(progress?.value/progress?.target) * 100}
        h={2}
      /> }
    </Box>
  );
};

export { RepositoryItem };

