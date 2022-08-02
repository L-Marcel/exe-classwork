import { throttle } from "lodash";
import { ReactNode, useCallback, useRef, useState } from "react";
import { createContext } from "use-context-selector";

interface SearchProviderProps {
  children: ReactNode;
};

export const searchContext = createContext({} as SearchContext);

function SearchProvider({ children }: SearchProviderProps) {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const throttleCallback = useRef(throttle((fn: Function) => {
    fn();
  }, 100));

  const _setSearch = useCallback((search: string) => {
    throttleCallback.current(() => setSearch(search));
  }, [setSearch, throttleCallback]);

  const _setPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const _setCount = useCallback((page: number) => {
    setCount(page);
  }, [setCount]);

  return (
    <searchContext.Provider
      value={{
        search,
        setSearch: _setSearch,
        page,
        setPage: _setPage,
        count,
        setCount: _setCount
      }}
    >
      {children}
    </searchContext.Provider>
  );
};

export { SearchProvider };

