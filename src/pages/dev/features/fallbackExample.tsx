import { Layout } from "../../../components/Layout";
import { PageFallback } from "../../../components/PageFallback";

function FallbackExample() {
  return(
    <Layout>
      <PageFallback
        title="We are getting everything ready for you."
      />
    </Layout>
  );
};

export default FallbackExample;