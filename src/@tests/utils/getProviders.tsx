import { ColorModeScript } from "@chakra-ui/react";
import { domAnimation } from "framer-motion";
import { AllProviders } from "../../contexts/AllProviders";
import { theme } from "../../theme/default";

function getProvidersWrapper() {
  return ({ children }): JSX.Element => (
    <AllProviders 
      features={domAnimation}
      reducedMotion="user"
      theme={theme}
      resetCSS 
    >
      <ColorModeScript initialColorMode="dark"/>
      {children}
    </AllProviders>
  );
};

export { getProvidersWrapper };