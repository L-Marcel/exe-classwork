import { Layout } from "../../../components/Layout";
import { NothingHere } from "../../../components/NothingHere";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface HomePageProps extends WithUserProps {};

function HomePage({
  user
}: HomePageProps) {
  return (
    <Layout>
      <NothingHere/>
    </Layout>
  );
};

export default WithUserProps(HomePage);