import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function useProgress() {
  return useContextSelector(appContext, c => {
    return {
      progress: c.progress,
      setProgress: c.setProgress,
      addNamedProgress: c.addNamedProgress,
      getProgressByName: c.getProgressByName
    };
  });
};

export { useProgress };

