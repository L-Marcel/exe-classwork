import { Box, Heading } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
interface NotFoundProps {};

function NotFound({}: NotFoundProps) {
  return (
    <Layout>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        w="100%"
        h="100%"
      >
        <Heading>
          404: Page not found
        </Heading>
      </Box>
    </Layout>
  );
};

/*export const getStaticProps: GetStaticProps = async({ locale }) => {
  return {
    props: { locale },
    revalidate: false
  };
};*/

export default NotFound;