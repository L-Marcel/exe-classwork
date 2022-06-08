import { Box, Text } from "@chakra-ui/react";
import { NamedIcon } from "../NamedIcon";

interface RepositoryProfileItem {
  color: string;
  icon: string;
  message: string;
  size?: number;
  sulfix?: string;
};

function RepositoryProfileItem({
  color,
  icon,
  message,
  size,
  sulfix
}: RepositoryProfileItem) {
  return (          
    <Box 
      display="flex"
      alignItems="flex-start"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        color={color}
        mt="2px"
        w={6}
        h={6}
      >
        <NamedIcon 
          name={icon}
          w={size || 6}
          h={size || 6}
        /> 
      </Box>
      <Text
        mx={2}
      >
        -
      </Text>
      <Text 
        fontSize="lg" 
        fontWeight="normal" 
      >
        {message}{sulfix}
      </Text>
    </Box>
  );
};

export { RepositoryProfileItem };

