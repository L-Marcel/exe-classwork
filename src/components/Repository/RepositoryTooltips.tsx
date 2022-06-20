import { Avatar, Box, Stack, Text } from "@chakra-ui/react";
import { format, formatDistance } from "date-fns";
import { boxShadow } from "../../theme/effects/shadow";
import { getDiffInCommitValue } from "../../utils/getDiffInCommitValue";
import { Span } from "../Span";

interface RepositoryTooltipsProps {
  commits: CommitChart[];
  active?: boolean;
  payload?: any;
  label?: string;
};


function RepositoryTooltips({ 
  active, 
  payload, 
  label,
  commits
}: RepositoryTooltipsProps) {
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
        return "\n-> files";
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
    const formatedDistanceOfCommitDate = formatDistance(new Date(data?.commitedAt), new Date());

    const metrics = payload.reverse();

    return (
      <Stack
        gap={2}
        maxW={420}
      >
        { (payload[0]?.payload?.userGithubId && data?.userGithubLogin) && 
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
          <Text
            fontWeight="hairline"
            fontSize={12}
            mb={2}
          >
            {formatedDistanceOfCommitDate} ago
          </Text>
          { metrics.map(p => {
            let diff = getDiffInCommitValue({
              commits,
              dataKey: p.dataKey,
              order: p.payload.order,
              value: p.value
            });

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
                </Span> {p.value} { diff !== 0 && <Span
                  fontWeight="semibold"
                  color={diff > 0 ? "green.50" : "red.50"}
                > 
                  ({diff > 0? "+":diff < 0? "-":""}{diff}) 
                </Span> }
              </Text>
            );
          }) }
        </Box>
      </Stack>
    );
  };

  return null;
};

export { RepositoryTooltips };

