import { Box, CircularProgress, CircularProgressLabel, Text } from "@chakra-ui/react";
import { useInstallationLimit } from "../contexts/hooks/useInstallationLimit";
import { useUser } from "../contexts/hooks/useUser";
import { getDynamicProgressColor } from "../utils/getDynamicProgressColor";
import { NamedIcon } from "./NamedIcon";

function GithubRequestLimit() {
  const { limit, remaining } = useInstallationLimit();
  const { user } = useUser();

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
          {remaining}/{limit}
        </Text>
        <CircularProgress 
          value={(remaining/limit) * 100}
          size={8}
          trackColor="solid.200"
          color={getDynamicProgressColor((remaining/limit) * 100)} 
          className="circle"
        >
          <CircularProgressLabel>
            <NamedIcon 
              name="network"
              w={4}
              h={4}
            />
          </CircularProgressLabel>
        </CircularProgress>
      </Box>
    </Box>
  );
};

export { GithubRequestLimit };

