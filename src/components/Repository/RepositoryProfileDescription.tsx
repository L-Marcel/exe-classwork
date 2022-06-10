import { Box, Text } from "@chakra-ui/react";
import { NamedIcon } from "../NamedIcon";
import { RepositoryProfileItemProps } from "./RepositoryProfileItem";

function RepositoryProfileDescription({
  color,
  icon,
  message,
  description,
  isSelected,
  size,
  sulfix
}: Omit<RepositoryProfileItemProps, "onSelect">) {
  return ( 
    <Box
      p={8}
      flex={2}
      minW={["100%", "100%", 400]}
      alignSelf={["flex-start", "stretch"]}
      borderLeft={["none", "none", "none", "2px solid"]}
      borderTop={["2px solid", "2px solid", "2px solid", "none"]}
      borderColor={[color, color, color, color]}
    >
      <Box
        display="flex"
        alignItems="center"
      >
        <NamedIcon 
          name={icon}
          color={color}
          w={(size || 6) + 2}
          h={(size || 6) + 2}
          mr={4}
        /> 
        <Text
          fontWeight="bold"
          fontSize={20}
        >
          {message}
        </Text>
      </Box>
    </Box>
  );
};

export { RepositoryProfileDescription };

