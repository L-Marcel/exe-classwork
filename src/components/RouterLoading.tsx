import { Progress } from "@chakra-ui/react";
import { m } from "framer-motion";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

function RouterLoading() {
  const { events } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartLoading = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  const handleOnLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    events.on("hashChangeStart", handleStartLoading);
    events.on("routeChangeStart", handleStartLoading);
    events.on("routeChangeComplete", handleOnLoadingComplete);

    return () => {
      events.off("hashChangeStart", handleStartLoading);
      events.off("routeChangeStart", handleStartLoading);
      events.off("routeChangeComplete", handleOnLoadingComplete);
    };
  }, [events, handleOnLoadingComplete, handleStartLoading]);

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
    />
  );
};

export { RouterLoading };

