import { Text } from "@chakra-ui/react";
import { useResult } from "../../contexts/hooks/useResult";

interface AlertsCountProps {
  isForced?: boolean;
  isMenu?: boolean;
};

function AlertsCount({
  isForced = false,
  isMenu = false
}: AlertsCountProps) {
  const { data: alerts } = useResult({
    queryTo: `/user/alerts/unread`,
    initialData: []
  });
  
  if(!alerts?.count || alerts?.count <= 0) {
    return null;
  };

  return (
    <Text
      position="absolute"
      right={isForced? isMenu? "25px":"18px":"-3px"}
      bgColor="primary.200"
      minW="18px"
      minH="18px"
      maxW="18px"
      maxH="18px"
      borderRadius={15}
      fontSize="12px"
      color="black"
      textAlign="center"
      zIndex={200}
    >
      {alerts?.count > 9? "+9":alerts?.count}
    </Text>
  );
};

export { AlertsCount };

