import { useClassroomPayloadIndex } from "../../../contexts/hooks/useClassroomPayloadIndex";
import { RepositoryContent } from "../../Repository/RepositoryContent";

interface ClassroomRepositoryContentProps {
  repositories: Repository[];
};

function ClassroomRepositoryContent({
  repositories
}: ClassroomRepositoryContentProps) {
  const { payloadIndex } = useClassroomPayloadIndex();

  if(payloadIndex < 0 || repositories.length - 1 < payloadIndex) {
    return null;
  };

  return (
    <RepositoryContent
      isFormatted
      commits={repositories[payloadIndex].commits}
    />
  );
};

export { ClassroomRepositoryContent };

