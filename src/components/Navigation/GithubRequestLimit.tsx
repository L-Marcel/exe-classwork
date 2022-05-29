import { Box, CircularProgress, CircularProgressLabel, Text } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useEffect, useState } from "react";
import { useSocket } from "../../contexts/hooks/useSocket";
import { useUser } from "../../contexts/hooks/useUser";
import { Api } from "../../services/api";
import { boxShadow } from "../../theme/effects/shadow";
import { getDynamicProgressColor } from "../../utils/getDynamicProgressColor";
import { NamedIcon } from "../NamedIcon";

interface GithubRequestLimitProps {
  haveOverlay: boolean;
};

function GithubRequestLimit({
  haveOverlay
}: GithubRequestLimitProps) {
  const { user } = useUser();
  const { socket } = useSocket();

  const [displayed, setDisplayed] = useState("rate_limit");

  const [progress, setProgress] = useState({
    value: 0,
    target: 0
  });

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

      socket.on("load_progress", (data) => {
        setProgress(p => {
          return {
            target: Math.min(p.target + data.target, p.target),
            value: Math.min(p.value + data.value, p.value)
          };
        });
      });

      socket.on("complete_progress", (data) => {
        setProgress(p => {
          const min = Math.min(p.value - data.value, 0);

          return {
            target: Math.min(p.target - data.target, 0),
            value: Math.max(min, p.target)
          };
        });
      })

      Api.post("user/connect/rate_limit")
      .then((res) => {
        setRateLimit(res.data);
      }).catch(() => {});
    };
  }, [Api, socket, setRateLimit]);

  if(!user || !user?.installationId) {
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
      <Box
        as={m.button}
        display="flex"
        h="100%"
        bgColor="solid.100"
        alignItems="center"
        justifyContent="space-between"
        position="relative"
        borderRadius="full"
        ml={2}
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
    </Box>
  );
};

export { GithubRequestLimit };

