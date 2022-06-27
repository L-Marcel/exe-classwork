import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useClassroomPayloadIndex } from "../../../contexts/hooks/useClassroomPayloadIndex";
import { boxShadow } from "../../../theme/effects/shadow";
import { getTooltipPayloadName } from "../../../utils/getTooltipPayloadName";
import { TooltipItem } from "../../TooltipItem";


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
  const { setPayloadIndex } = useClassroomPayloadIndex();

  if(active && payload && payload.length > 0) {
    if(payload?.length > 0) {
      setPayloadIndex(repositories.findIndex(r => r.fullname === label));
    };

    const data = payload[0]?.payload;

    const formatedDate = data?.commitedAt? 
      format(new Date(data?.commitedAt), "MMM d, yyyy '->' hh:mm aa"):null;

    const metrics = payload.reverse().filter(p => {
      const stroke: string = p.stroke;
      return stroke?.length <= 7 || !stroke.endsWith("10");
    });

    const leftMetrics = metrics.filter(m => getTooltipPayloadName(m.name, true).startsWith("<-"));
    const rightMetrics = metrics.filter(m => getTooltipPayloadName(m.name, true).startsWith("->"));

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
          { leftMetrics.map(p => {
            return (
              <TooltipItem
                key={p.name}
                isClassroom
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
                isClassroom
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

export { ClassroomTooltips };

