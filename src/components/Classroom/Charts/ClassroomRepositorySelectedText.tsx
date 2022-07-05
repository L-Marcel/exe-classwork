import { Text } from "@chakra-ui/react";
import { useClassroomPayloadIndex } from "../../../contexts/hooks/useClassroomPayloadIndex";

interface ClassroomRepositorySelectedTextProps {
  data: Repository[];
};

function ClassroomRepositorySelectedText({ data }: ClassroomRepositorySelectedTextProps) {
  const { payloadIndex } = useClassroomPayloadIndex();
  const name = data.find((d, i) => i === payloadIndex)?.fullname;

  return (
    <Text mb={4}>
      {name? `Selected: ${name}`:"Select a repository in table"}
    </Text>
  );
};

export { ClassroomRepositorySelectedText };

