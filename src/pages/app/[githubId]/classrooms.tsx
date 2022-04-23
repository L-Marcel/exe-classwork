import { PageFallback } from "../../../components/PageFallback";
import { useUser } from "../../../contexts/hooks/useUser";

interface ClassroomsPageProps {};

function ClassroomsPage({}: ClassroomsPageProps) {
  const { user } = useUser();

  if(!user) {
    return (
      <PageFallback
        title="We are getting everything ready for you."
      />
    );
  };

  return (
    <></>
  );
};

export default ClassroomsPage;