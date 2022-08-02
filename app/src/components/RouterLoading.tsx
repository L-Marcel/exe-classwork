import { Progress } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useIsLoading } from "../contexts/hooks/useIsLoading";

function RouterLoading() {
  const { events } = useRouter();
  const { 
    startLoading, 
    stopLoading, 
    isLoading 
  } = useIsLoading();

  useEffect(() => {
    events.on("routeChangeStart", startLoading);
    events.on("routeChangeComplete", stopLoading);

    return () => {
      events.off("routeChangeStart", startLoading);
      events.off("routeChangeComplete", stopLoading);
    };
  }, [events, stopLoading, startLoading]);

  if(!isLoading) {
    return null;
  };

  return (
    <Progress
      as={m.div}
      position="absolute"
      top="-3px"
      isIndeterminate
      w="100%"
      h={2}
      zIndex={1000}
    />
  );
};

export { RouterLoading };

