import { NothingHere } from "../../../components/NothingHere";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface RepositoriesPageProps extends WithUserProps {};

function RepositoriesPage({ user }: RepositoriesPageProps) {
  return (
    <NothingHere/>
  );
};

export default WithUserProps(RepositoriesPage);