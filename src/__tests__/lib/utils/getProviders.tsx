import { ColorModeScript } from "@chakra-ui/react";
import { domAnimation } from "framer-motion";
import { QueryClient } from "react-query";
import { Layout } from "../../../components/Layout";
import { AllProviders } from "../../../contexts/AllProviders";
import { theme } from "../../../theme/default";

const client = new QueryClient();

function getProvidersWrapper() {
  return ({ children }): JSX.Element => (
    <AllProviders 
      client={client}
      features={domAnimation}
      reducedMotion="user"
      theme={theme}
      resetCSS 
    >
      <ColorModeScript initialColorMode="dark"/>
      <Layout>
        {children}
      </Layout>
    </AllProviders>
  );
};

export { getProvidersWrapper };

