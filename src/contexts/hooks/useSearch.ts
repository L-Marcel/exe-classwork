import { useContextSelector } from "use-context-selector";
import { appContext } from "../AppProvider";

function useSearch() {
  return useContextSelector(appContext, c => {
    return {
      search: c.search,
      setSaerch: c.setSearch
    };
  });
};

export { useSearch };
