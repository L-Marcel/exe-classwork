import { ChakraProvider } from "@chakra-ui/react";
import { LazyMotion, MotionConfig } from "framer-motion";
import { AppProvider } from "./AppProvider";

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
  MotionConfig,
  AppProvider
);