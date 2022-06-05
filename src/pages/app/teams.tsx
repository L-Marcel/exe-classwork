import { NothingHere } from "../../components/NothingHere";
import { WithUserProps } from "../../utils/routes/WithUserProps";

interface TeamsPageProps extends WithUserProps {};

function TeamsPage({ user }: TeamsPageProps) {
  return (
    <NothingHere/>
  );
};

export default WithUserProps(TeamsPage);