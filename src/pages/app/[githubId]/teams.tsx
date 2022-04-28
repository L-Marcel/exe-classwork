import { Layout } from "../../../components/Layout";
import { NothingHere } from "../../../components/NothingHere";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface TeamsPageProps extends WithUserProps {};

function TeamsPage({ user }: TeamsPageProps) {
  return (
    <Layout>
      <NothingHere/>
    </Layout>
  );
};

export default WithUserProps(TeamsPage);