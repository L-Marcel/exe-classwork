import { Box, Text } from "@chakra-ui/react";
import { Equation } from "../Equation";
import { NamedIcon } from "../NamedIcon";
import { RepositoryProfileItemProps } from "./RepositoryProfileItem";

function RepositoryProfileDescription({
  color,
  icon,
  message,
  description,
  isSelected,
  equation,
  size,
  sulfix
}: Omit<RepositoryProfileItemProps, "onSelect">) {
  return ( 
    <Box
      p={8}
      flex={2}
      maxH="25rem"
      minW={["100%", "100%", "25rem"]}
      minH={["100%", "100%", "25rem"]}
      overflowY="auto"
      overflowX="hidden"
      borderLeft={["none", "none", "none", "2px solid"]}
      borderTop={["2px solid", "2px solid", "2px solid", "none"]}
      borderColor={[color, color, color, color]}
      alignSelf={["flex-start", "stretch"]}
      __css={{
        "&": {
          direction: "rtl"
        },
        "@media (max-width: 1080px)": {
          maxHeight: "initial!important"
        },
        "::-webkit-scrollbar-thumb": {
          background: color
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: color
        },
      }}
    >
      <Box
        flex={1}
        minW="100%"
        __css={{
          "&": {
            direction: "ltr"
          }
        }}
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
        <Text
          fontSize={16}
          mt={4}
          maxW={["100%", "90%", "80%", "85%"]}
          whiteSpace="pre-wrap"
        >
          {description}
        </Text>
        { equation && <>
          <Text
            mt={4}
            fontSize={20}
            fontWeight="bold"
            whiteSpace="pre-wrap"
          >
            {equation.title}
          </Text>
          <Text
            fontSize={16}
            mt={2}
            maxW={["100%", "90%", "80%", "85%"]}
            whiteSpace="pre-wrap"
          >
            {equation.instruction}
          </Text>
          <Equation
            mt={4}
            calc={equation.calc}
            theme={color}
          />
          { equation.explanation && <Text
            fontSize={16}
            mt={4}
            maxW={["100%", "90%", "80%", "85%"]}
            whiteSpace="pre-wrap"
          >
            {equation.explanation}
          </Text> }
          { equation.explanationCalc && <Equation
            mt={4}
            calc={equation.explanationCalc}
            theme={color}
          /> }
        </> }
      </Box>
    </Box>
  );
};

export { RepositoryProfileDescription };

