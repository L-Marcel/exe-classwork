import { AppProps } from "next/app";
import { AllProviders } from "../contexts/AllProviders";

import { domAnimation } from "framer-motion";
import { theme } from "../theme/default";

import "focus-visible/dist/focus-visible.min.js";
import { QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { GithubRequestLimit } from "../components/GithubRequestLimit";
import { Layout } from "../components/Layout";
import { Navigation } from "../components/Navigation";
import { RouterLoading } from "../components/RouterLoading";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AllProviders 
      client={client}
      features={domAnimation}
      reducedMotion="user"
      theme={theme}
      resetCSS 
    >
      <ReactQueryDevtools/>
      <RouterLoading/>
      <GithubRequestLimit/>
      <Navigation/>
      <Layout>
        <Component {...pageProps}/>
      </Layout>
    </AllProviders>
  );
};

export default MyApp;
