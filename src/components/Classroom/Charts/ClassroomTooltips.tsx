import { Box, Stack, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { boxShadow } from "../../../theme/effects/shadow";
import { Span } from "../../Span";


interface ClassroomTooltipsProps {
  repositories: Repository[];
  active?: boolean;
  payload?: any;
  label?: string;
};

function ClassroomTooltips({ 
  active, 
  payload, 
  label,
  repositories
}: ClassroomTooltipsProps) {
  function getTooltipPayloadName(name: string) {
    switch(name) {
      case "totalAdditions":
        return "<- total additions";
      case "totalDeletions":
        return "<- total deletions";
      case "totalChanges":
        return "<- total changes";
      case "filesAdded":
        return "<- files added";
      case "filesRemoved":
        return "<- files removed";
      case "filesModified":
        return "<- files modified";
      case "files":
        return "<- files";
      case "sloc":
        return "\n-> sloc";
      default:
        return "<- " + name;
    };
  };

  if(active && payload && payload.length > 0) {
    const data = payload[0]?.payload;

    const formatedDate = data?.commitedAt? 
      format(new Date(data?.commitedAt), "MMM d, yyyy '->' hh:mm aa"):null;

    const metrics = payload.reverse();

    return (
      <Stack
        gap={2}
        maxW={420}
      >
        { (data?.userGithubId && data?.userGithubLogin) && 
          <Box
            p={5}
            bgColor="solid.25"
            borderRadius={8}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            { ...boxShadow() }
          >
            <Box>
              <Text
                fontWeight="black"
              >
                Last commit
              </Text>
              { formatedDate && <Text
                fontSize={14}
              >
                {formatedDate}
              </Text> }
            </Box>
          </Box> 
        }
        <Box
          p={5}
          bgColor="solid.25"
          borderRadius={8}
          { ...boxShadow() }
        >
          <Text
            fontWeight="black"
          >
            {label.length > 58 ? label.substring(0, 55) + "..." : label}
          </Text>
          { metrics
            .filter(p => {
              const stroke: string = p.stroke;
              return stroke?.length <= 7 || !stroke.endsWith("10");
            })
            .map(p => {
            return (
              <Text 
                key={p.name} 
                fontWeight="hairline"
                whiteSpace="pre-wrap"
                mr={20}
              >
                <Span
                  fontWeight="bold"
                  color={p.stroke}
                >
                  {getTooltipPayloadName(p.name)}:
                </Span> {p.value} {p.unit}
              </Text>
            );
          }) }
        </Box>
      </Stack>
    );
  };

  return null;
};

export { ClassroomTooltips };

