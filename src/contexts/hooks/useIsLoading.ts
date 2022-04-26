import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function useIsLoading() {
  return useContextSelector(appContext, c => {
    return {
      isLoading: c.isLoading,
      startLoading: () => c.setIsLoading(true),
      stopLoading: () => c.setIsLoading(false)
    };
  });
};

export { useIsLoading };

