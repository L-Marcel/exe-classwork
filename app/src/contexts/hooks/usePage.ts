import { useContextSelector } from "use-context-selector";
import { searchContext } from "../SearchProvider";

function usePage() {
  return useContextSelector(searchContext, c => {
    return {
      page: c.page,
      setPage: c.setPage
    };
  });
};

export { usePage };

