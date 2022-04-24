import { NothingHere } from "../../../components/NothingHere";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface ClassroomsPageProps extends WithUserProps {};

function ClassroomsPage({ user }: ClassroomsPageProps) {
  return (
    <NothingHere/>
  );
};

export default WithUserProps(ClassroomsPage);