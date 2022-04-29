import { NothingHere } from "../../../components/NothingHere";
import { WithUserProps } from "../../../utils/routes/WithUserProps";


interface AlertsPageProps extends WithUserProps {};

function AlertsPage({ user }: AlertsPageProps) {
  return (
    <NothingHere/>
  );
};

export default WithUserProps(AlertsPage);