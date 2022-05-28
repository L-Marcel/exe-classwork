import { Box, CircularProgress, CircularProgressLabel, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSocket } from "../../contexts/hooks/useSocket";
import { useUser } from "../../contexts/hooks/useUser";
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

  const [rateLimit, setRateLimit] = useState({
    limit: 0,
    remaining: 0
  });

  useEffect(() => {
    if(socket !== null && user !== null) {
      socket.on("rate_limit", (data) => {
        console.log("evend received: ", data);
        setRateLimit({
          ...data
        });
      });

      socket.emit("@request/rate_limit", user.id);
    };
  }, [socket, setRateLimit]);

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
      zIndex={haveOverlay? 902:10}
      pointerEvents="none"
    >
      <Box
        display="flex"
        h="100%"
        bgColor="solid.100"
        alignItems="center"
        justifyContent="space-between"
        position="relative"
        borderRadius="full"
        py={5}
        pl={2}
        pr={1}
      >
        <Text
          px={2}
        >
          {rateLimit.remaining}/{rateLimit.limit}
        </Text>
        <CircularProgress 
          size={8}
          trackColor="solid.200"
          color="primary.700"
          className="circle"
          isIndeterminate
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
    </Box>
  );
};

export { GithubRequestLimit };

