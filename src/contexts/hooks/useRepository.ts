import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function useRepository() {
  return useContextSelector(appContext, c => {
    return {
      repository: c.repository,
      setRepository: c.setRepository
    };
  });
};

export { useRepository };

