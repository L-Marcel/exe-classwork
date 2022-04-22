import { Heading } from "@chakra-ui/react";
import { m } from "framer-motion";
import { GetStaticProps } from "next";

interface NotFoundProps {
  locale: string;
};

function NotFound({ locale }: NotFoundProps) {
  return (
    <Heading>
      404: {locale === "pt-BR"? "Página não encontrada":"Page not found"}
    </Heading>
  );
};

export const getStaticProps: GetStaticProps = async({ locale }) => {
  return {
    props: { locale },
    revalidate: false
  };
};

export default NotFound;