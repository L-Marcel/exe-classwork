import { useContextSelector } from "use-context-selector";
import { searchContext } from "../SearchProvider";

function useSearch() {
  return useContextSelector(searchContext, c => {
    return {
      search: c.search,
      setSearch: c.setSearch
    };
  });
};

export { useSearch };

