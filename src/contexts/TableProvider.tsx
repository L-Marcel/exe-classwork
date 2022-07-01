import { throttle } from "lodash";
import { ReactNode, useCallback, useRef, useState } from "react";
import { createContext } from "use-context-selector";

interface TableProviderProps {
  children: ReactNode;
  columns: string[];
  rows: any[];
};

export const tableContext = createContext({} as TableContext);

function TableProvider({ children, columns, rows }: TableProviderProps) {
  const [count, setCount] = useState(rows.length);

  const [search, setSearch] = useState(columns.reduce((prev, cur) => {
    prev[cur] = "";
    return prev;
  }, {}));

  const [filter, setFilter] = useState(columns.reduce((prev, cur) => {
    prev[cur] = true;
    return prev;
  }, {}));

  const [page, setPage] = useState(0);

  const throttleCallback = useRef(throttle((fn: Function) => {
    fn();
  }, 100));

  const _setSearch = useCallback((search: string, column: string) => {
    throttleCallback.current(() => setSearch(s => {
      return {
        ...s,
        [column]: search
      };
    }));
  }, [setSearch, throttleCallback]);

  const _setFilter = useCallback((isVisible: boolean, column: string) => {
    throttleCallback.current(() => setFilter(s => {
      return {
        ...s,
        [column]: isVisible
      };
    }));
  }, [setFilter, throttleCallback]);

  const _setPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const _setCount = useCallback((page: number) => {
    setCount(page);
  }, [setCount]);

  return (
    <tableContext.Provider
      value={{
        search,
        setSearch: _setSearch,
        filter,
        setFilter: _setFilter,
        page,
        setPage: _setPage,
        count,
        setCount: _setCount,
        columns,
        rows
      }}
    >
      {children}
    </tableContext.Provider>
  );
};

export { TableProvider };

