import { throttle } from "lodash";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createContext } from "use-context-selector";
import { getChangedOrder } from "../utils/getChangedOrder";
import { getPercent, getPercentValue } from "../utils/getPercent";

interface TableProviderProps {
  children: ReactNode;
  columns: TableColumnData[];
  rows: any[];
};

export const tableContext = createContext({} as TableContext);

function TableProvider({ children, columns, rows }: TableProviderProps) {
  const [_rows, setRows] = useState(rows);
  const [filteredRows, setFilteredRows] = useState(_rows);

  const formattedColumns = columns.map(c => ({
    ...c,
    order: (c.isPrimary? "desc":"none") as TableColumnOrder,
  }));

  const [_columns, setColumns] = useState<TableColumn[]>(formattedColumns);
  const [filteredColumns, setFilteredColumns] = useState(_columns);

  const [count, setCount] = useState(rows.length);

  const [search, setSearch] = useState(columns.reduce((prev, cur) => {
    prev[cur.value] = "";
    return prev;
  }, {}));

  const [filter, setFilter] = useState(columns.reduce((prev, cur) => {
    if(!cur.reference) {
      prev[cur.value] = true;
    };
    return prev;
  }, {}));

  const [page, setPage] = useState(0);

  const throttleCallback = useRef(throttle((fn: Function) => {
    fn();
  }, 200));

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
          col.order = getChangedOrder(col.order, col.percentOfData? true:false);
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
        _rows = _rows.sort((a, b) => {
          const firstValue = a[currentColumn.value];
          const lastValue = b[currentColumn.value];
          const order = currentColumn.order;
          const firstTotal = currentColumn.percentOfData? a[currentColumn.percentOfData]:false;
          const lastTotal = currentColumn.percentOfData? b[currentColumn.percentOfData]:false;

          switch (typeof firstValue) {
            case "string":
              return order === "desc"? 
                ('' + firstValue).localeCompare(lastValue):
                ('' + lastValue).localeCompare(firstValue);
            case "number":
            default:
              if(
                (order === "percent-asc" || order === "percent-desc") &&
                typeof firstTotal === "number" &&
                typeof lastTotal === "number"
              ) {
                const firstPercent = getPercentValue(firstValue, firstTotal);
                const lastPercent = getPercentValue(lastValue, lastTotal);

                return order === "percent-desc"? 
                  (firstPercent - lastPercent):
                  (lastPercent - firstPercent);
              };

              return order === "desc"? 
                (firstValue - lastValue):
                (lastValue - firstValue);
          };
        });
      };
    };

    return _rows;
  };

  useEffect(() => {
    setRows(orderByColumn(rows, _columns));
  }, [_columns, rows, setRows]);

  function isFindInSearch(r: any, search: any, columns: TableColumnData[]) {
    const allSearchs: [string, string][] = Object.entries(search);

    for(let s in allSearchs) {
      const search = allSearchs[s];
      const column = columns.find(c => c.value == search[0]);
      
      const value = r[search[0]];
      const percentOfData = column.percentOfData? r[column.percentOfData]:false;
      const allIsNumber = 
          typeof value === "number" && 
          typeof percentOfData === "number";

      const percent = (percentOfData && allIsNumber)? 
        `${!column.showOnlyPercent? ` (`:""}${getPercent(value, percentOfData)}%${!column.showOnlyPercent? `)`:""}`
        :false;

      if(
        ((!allIsNumber || !percentOfData) || (percent && 
          !(
            String(value).toLowerCase() + 
            String(percent).toLowerCase()
          ).includes(search[1].toLowerCase())
        )) && 
        !String(value).toLowerCase().includes(search[1].toLowerCase())
      ) {
        return false;
      };
    };

    return true;
  };

  useEffect(() => {
    throttleCallback.current(() => {
      const filteredRows = _rows.map(r => {
        r["_isResult"] = isFindInSearch(r, search, columns);
        return r;
      });

      setFilteredRows(filteredRows);
      setCount(filteredRows.length);
    });
  }, [_rows, search, columns, setFilteredRows, setRows, setCount]);

  useEffect(() => {
    setFilteredColumns(_columns.filter(c => filter[c.reference || c.value]));
  }, [_columns, filter, setFilteredColumns]);

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
        initialColumns: _columns,
        columns: filteredColumns,
        initialRows: rows,
        rows: filteredRows,
        onChangeColumnOrder: _onChangeColumnOrder
      }}
    >
      {children}
    </tableContext.Provider>
  );
};

export { TableProvider };

