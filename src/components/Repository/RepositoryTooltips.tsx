import { Box, Text } from "@chakra-ui/react";
import { boxShadow } from "../../theme/effects/shadow";
import { Span } from "../Span";

function RepositoryTooltips({ 
  active, 
  payload, 
  label 
}) {
  function getTooltipPayloadName(name: string) {
    switch(name) {
      case "totalAdditions":
        return "total additions";
      case "totalDeletions":
        return "total deletions";
      case "totalChanges":
        return "total changes";
      case "filesAdded":
        return "files added";
      case "filesRemoved":
        return "files removed";
      case "filesModified":
        return "files modified";
      default:
        return name;
    };
  };

  if(active && payload && payload.length > 0) {
    console.log(payload);
    return (
      <Box
        p={5}
        bgColor="solid.25"
        borderRadius={8}
        { ...boxShadow() }
      >
        <Text
          fontWeight="black"
        >
          {label}
        </Text>
        { payload.reverse().map((p) => {
          return (
            <Text key={p.name} fontWeight="hairline">
              <Span
                fontWeight="bold"
                color={p.stroke}
              >
                {getTooltipPayloadName(p.name)}:
              </Span> {p.value}
            </Text>
          );
        }) }
      </Box>
    );
  };

  return null;
};

export { RepositoryTooltips };

