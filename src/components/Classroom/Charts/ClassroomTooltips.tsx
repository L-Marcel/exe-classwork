import { Avatar, Box, Stack, Text } from "@chakra-ui/react";
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
        return "-> files";
      case "sloc":
        return "-> sloc";
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
            { (data?.userGithubId) && <Avatar
              mr={3}
              src={`https://avatars.githubusercontent.com/u/${data.userGithubId}?v=4`}
              border="5px solid var(--chakra-colors-solid-100)"
            /> }
            <Box>
              <Text
                fontWeight="black"
              >
                {data?.userGithubLogin}
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
          { metrics.map(p => {
            return (
              <Text 
                key={p.name} 
                fontWeight="hairline"
                mr={20}
              >
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
      </Stack>
    );
  };

  return null;
};

export { ClassroomTooltips };

