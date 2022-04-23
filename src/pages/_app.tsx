import { AppProps } from "next/app";
import { AllProviders } from "../contexts/AllProviders";
import { ColorModeScript } from "@chakra-ui/react";

import { domAnimation } from "framer-motion";
import { theme } from "../theme/default";

import "focus-visible/dist/focus-visible.min.js";
import { Layout } from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AllProviders 
      features={domAnimation}
      reducedMotion="user"
      theme={theme}
      resetCSS 
    >
      <ColorModeScript initialColorMode="dark"/>
      <Layout>
        <Component {...pageProps}/>
      </Layout>
    </AllProviders>
  );
};

export default MyApp;
