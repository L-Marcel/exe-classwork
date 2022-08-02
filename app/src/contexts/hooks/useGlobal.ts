import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function useGlobal() {
  return useContextSelector(appContext, s => {
    return {
      global: s.global,
    };
  });
};

export { useGlobal };

