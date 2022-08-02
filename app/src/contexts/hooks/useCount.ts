import { useContextSelector } from "use-context-selector";
import { searchContext } from "../SearchProvider";

function useCount() {
  return useContextSelector(searchContext, c => {
    return {
      count: c.count,
      setCount: c.setCount
    };
  });
};

export { useCount };

