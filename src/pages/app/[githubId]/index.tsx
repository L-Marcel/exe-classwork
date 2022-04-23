import { PageFallback } from "../../../components/PageFallback";
import { useUser } from "../../../contexts/hooks/useUser";

interface HomePageProps {};

function HomePage({}: HomePageProps) {
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

export default HomePage;