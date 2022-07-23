import { Avatar, Box, Divider, Stack, Text } from "@chakra-ui/react";
import { format, formatDistance } from "date-fns";
import { boxShadow } from "../../theme/effects/shadow";
import { getTooltipPayloadName } from "../../utils/getTooltipPayloadName";
import { TooltipItem } from "../TooltipItem";

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
  if(active && payload && payload.length > 0) {
    const data = payload[0]?.payload;

    const formatedDate = data?.commitedAt? 
      format(new Date(data?.commitedAt), "MMM d, yyyy '->' hh:mm aa"):null;
    const formatedDistanceOfCommitDate = formatDistance(new Date(data?.commitedAt), new Date());

    const metrics: any[] = payload.reverse().filter(p => {
      const stroke: string = p.stroke;
      return stroke?.length <= 7 || !stroke.endsWith("10");
    });;

    const indexOfCurrentItem = commits?.findIndex(c => c.id == data?.id);

    const leftMetrics = metrics.filter(m => getTooltipPayloadName(m.name).startsWith("<-"));
    const rightMetrics = metrics.filter(m => getTooltipPayloadName(m.name).startsWith("->"));
   
    return (
      <Stack
        gap={2}
        maxW={420}
      >
        { (payload[0]?.payload?.userGithubId && data?.userGithubLogin) && 
          <Box
            p={5}
            bgColor="solid.50"
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
          bgColor="solid.50"
          borderRadius={8}
          { ...boxShadow() }
        >
          <Text
            fontWeight="black"
          >
            {label.length > 58 ? label.substring(0, 55) + "..." : label}
          </Text>
          <Text
            fontWeight="normal"
            fontSize={14}
            mb={2}
          >
            {formatedDistanceOfCommitDate} ago
          </Text>
          { leftMetrics.map(p => {
            return (
              <TooltipItem
                key={p.name}
                arr={commits}
                index={indexOfCurrentItem}
                {...p}
              />
            );
          }) }
          { (leftMetrics.length > 0 && rightMetrics.length > 0) && <Divider
            mt="8px"
            mb="6px"
          /> }
          { rightMetrics.map(p => {
            return (
              <TooltipItem
                key={p.name}
                arr={commits}
                index={indexOfCurrentItem}
                {...p}
              />
            );
          }) }
        </Box>
      </Stack>
    );
  };

  return null;
};

export { RepositoryTooltips };

