import { throttle } from "lodash";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createContext } from "use-context-selector";
import { getChangedOrder } from "../utils/getChangedOrder";

interface TableProviderProps {
  children: ReactNode;
  columns: string[];
  rows: any[];
};

export const tableContext = createContext({} as TableContext);

function TableProvider({ children, columns, rows }: TableProviderProps) {
  const [_rows, setRows] = useState(rows);

  const [_columns, setColumns] = useState<TableColumn[]>(columns.map(c => ({
    value: c,
    order: c === "id"? "desc":"none"
  })));

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

  const _onChangeColumnOrder = useCallback((column: string) => {
    setColumns(c => {
      return c.map(col => {
        if(col.value === column) {
          col.order = getChangedOrder(col.order);
        } else {
          col.order = "none";
        };

        return col;
      });
    });
  }, [setColumns]);

  function orderByColumn(rows: any[], columns: TableColumn[]) {
    let _rows = [...rows];

    for(let c in columns) {
      const currentColumn = columns[c];

      if(currentColumn.order !== "none") {
        _rows = _rows.sort((a, b) => 
          currentColumn.order === "desc"? 
            (a[currentColumn.value] - b[currentColumn.value]):(b[currentColumn.value] - a[currentColumn.value])
        );
      };
    };

    return _rows;
  };

  useEffect(() => {
    setRows(orderByColumn(rows, _columns));
  }, [_columns, rows, setRows]);

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
        columns: _columns,
        rows: _rows,
        onChangeColumnOrder: _onChangeColumnOrder
      }}
    >
      {children}
    </tableContext.Provider>
  );
};

export { TableProvider };

