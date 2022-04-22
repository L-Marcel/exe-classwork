import { ChakraProvider } from "@chakra-ui/react";
import { LazyMotion, MotionConfig } from "framer-motion";

const composeProviders = (...providers) => props => {
  return providers.reduceRight(
    (children, Provider) => {
      return (
        <Provider {...props}>{children}</Provider>
      );
    },
    props.children
  );
};

export const AllProviders = composeProviders(
  ChakraProvider,
  LazyMotion,
  MotionConfig
);