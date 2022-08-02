import { Box, Text } from "@chakra-ui/react";
import { NamedIcon } from "../NamedIcon";

export interface RepositoryProfileItemProps {
  color: string;
  icon: string;
  message: string;
  description?: string;
  size?: number;
  sulfix?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  value?: any;
  equation?: {
    title: string;
    instruction: string;
    calc: string;
    explanation?: string;
    explanationCalc?: string;
  };
};

function RepositoryProfileItem({
  color,
  icon,
  message,
  size,
  sulfix,
  description,
  isSelected,
  onSelect
}: RepositoryProfileItemProps ) {
  return (          
    <Box 
      display="flex"
      alignItems="flex-start"
      cursor="pointer"
      w="max-content"
      p={1}
      pl={2}
      pr={3}
      ml={-2}
      bgColor={isSelected? color:undefined}
      color={isSelected? "solid.50":undefined}
      mb={-1}
      borderRadius={25}
      onClick={onSelect}
      _hover={!isSelected && {
        pl: 2,
        pr: 3,
        ml: -2,
        bgColor: "solid.100",
        color: "solid.900"
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        color={isSelected? undefined:color}
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

