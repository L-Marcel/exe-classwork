import { Box } from "@chakra-ui/react";
import { NothingHere } from "../../../components/NothingHere";
import { WithUserProps } from "../../../utils/routes/WithUserProps";

interface HomePageProps extends WithUserProps {};

function HomePage({
  user
}: HomePageProps) {
  return (
    <NothingHere/>
  );
};

export default WithUserProps(HomePage);