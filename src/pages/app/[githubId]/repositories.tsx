import { Layout } from "../../../components/Layout";
import { NothingHere } from "../../../components/NothingHere";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface RepositoriesPageProps extends WithUserProps {};

function RepositoriesPage({ user }: RepositoriesPageProps) {
  return (
    <Layout>
      <NothingHere/>
    </Layout>
  );
};

export default WithUserProps(RepositoriesPage);