import { Box, CircularProgress, CircularProgressLabel, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProgress } from "../../contexts/hooks/useProgress";
import { useSocket } from "../../contexts/hooks/useSocket";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";
import { boxShadow } from "../../theme/effects/shadow";
import { getDynamicProgressColor } from "../../utils/getDynamicProgressColor";
import { NamedIcon } from "../NamedIcon";
import { TooltipOnHover } from "../TooltipOnHover";

interface NavigationDataInfoProps {
  haveOverlay: boolean;
};

function NavigationDataInfo({
  haveOverlay
}: NavigationDataInfoProps) {
  const router = useRouter(); 
  const { user } = useUser();
  const { socket } = useSocket();

  const [displayed, setDisplayed] = useState("rate_limit");

  const { progress, setProgress } = useProgress();

  const [rateLimit, setRateLimit] = useState({
    limit: 0,
    remaining: 0
  });

  useEffect(() => {
    if(socket !== null && user !== null) {
      socket.on("rate_limit", (data) => {
        setRateLimit({
          ...data
        });
      });

      socket.on("progress", (data: AllNamedProgress | undefined) => {
        data && setProgress(data);
      });

      Api.post("user/connect/rate_limit")
      .then((res) => {
        setRateLimit(res.data);
      }).catch(() => {});
    };
  }, [Api, socket, setRateLimit]);

  if(!user || !user?.installationId || router.isFallback) {
    return null;
  };
  
  return (
    <Box
      display="flex"
      position="absolute"
      justifyContent="center"
      top={3}
      w="100%"
      h={8}
      zIndex={haveOverlay? 902:20}
      pointerEvents="none"
      { ...boxShadow() }
    >
      <TooltipOnHover
        label="Special requests remaining"
      >
        <Box
          as={m.button}
          display="flex"
          h="100%"
          bgColor="solid.100"
          alignItems="center"
          justifyContent="space-between"
          position="relative"
          borderRadius="full"
          py={5}
          px={1}
          onClick={() => setDisplayed("rate_limit")}
          cursor="pointer"
          pointerEvents="all"
        >
          {displayed === "rate_limit" && <Text
            pl={3}
            pr={2}
          >
            {rateLimit.remaining}/{rateLimit.limit}
          </Text> }
          <CircularProgress 
            size={8}
            trackColor="solid.200"
            color="primary.700"
            className="circle"
            isIndeterminate={displayed === "rate_limit"}
          >
            <CircularProgressLabel>
              <CircularProgress 
                value={(rateLimit.remaining/rateLimit.limit) * 100}
                size={7}
                trackColor="solid.200"
                color={getDynamicProgressColor((rateLimit.remaining/rateLimit.limit) * 100)} 
                className="circle"
              >
                <CircularProgressLabel>
                  <NamedIcon 
                    name="network"
                    mt="1px"
                    w={4}
                    h={4}
                  />
                </CircularProgressLabel>
              </CircularProgress>
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
      </TooltipOnHover>
      <TooltipOnHover
        label="Repository load progress"
        bgColor="orange.600"
      >
        <Box
          as={m.button}
          display="flex"
          h="100%"
          bgColor="solid.100"
          alignItems="center"
          justifyContent="space-between"
          position="relative"
          borderRadius="full"
          ml={4}
          py={5}
          px={1}
          onClick={() => setDisplayed("progress")}
          cursor="pointer"
          pointerEvents="all"
        >
          { displayed === "progress" && <Text
            pl={3}
            pr={2}
          >
            {progress.value}/{progress.target}
          </Text> }
          <CircularProgress 
            size={8}
            trackColor="solid.200"
            color="orange.700"
            className="circle"
            isIndeterminate={displayed === "progress"}
          >
            <CircularProgressLabel>
              <CircularProgress 
                value={(progress.value/progress.target) * 100}
                size={7}
                trackColor="solid.200"
                color="orange.500" 
                className="circle"
              >
                <CircularProgressLabel>
                  <NamedIcon 
                    name="project"
                    mt="2px"
                    w={3}
                    h={3}
                  />
                </CircularProgressLabel>
              </CircularProgress>
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
      </TooltipOnHover>
    </Box>
  );
};

export { NavigationDataInfo };

