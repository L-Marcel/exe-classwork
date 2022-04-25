import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function usePage() {
  return useContextSelector(appContext, c => {
    return {
      page: c.page,
      setPage: c.setPage
    };
  });
};

export { usePage };

