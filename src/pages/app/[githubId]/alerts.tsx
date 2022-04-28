import { Layout } from "../../../components/Layout";
import { NothingHere } from "../../../components/NothingHere";
import { WithUserProps } from "../../../utils/routes/WithUserProps";


interface AlertsPageProps extends WithUserProps {};

function AlertsPage({ user }: AlertsPageProps) {
  return (
    <Layout>
      <NothingHere/>
    </Layout>
  );
};

export default WithUserProps(AlertsPage);