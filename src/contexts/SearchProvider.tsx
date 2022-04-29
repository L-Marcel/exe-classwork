import { ReactNode, useCallback, useState } from "react";
import { createContext } from "use-context-selector";

interface SearchProviderProps {
  children: ReactNode;
};

export const searchContext = createContext({} as SearchContext);

function SearchProvider({ children }: SearchProviderProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  let timer;

  const _setSearch = useCallback((search: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setSearch(search);
    }, 300);
  }, [setSearch]);

  const _setPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  return (
    <searchContext.Provider
      value={{
        search,
        setSearch: _setSearch,
        page,
        setPage: _setPage
      }}
    >
      {children}
    </searchContext.Provider>
  );
};

export { SearchProvider };

