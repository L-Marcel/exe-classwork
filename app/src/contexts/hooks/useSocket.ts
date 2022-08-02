import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function useSocket() {
  return useContextSelector(appContext, s => {
    return {
      socket: s.socket,
    };
  });
};

export { useSocket };

