import { useContextSelector } from "use-context-selector";
import { tableContext } from "../TableProvider";

function useTable() {
  return useContextSelector(tableContext, t => {
    return {
      search: t.search,
      filter: t.filter,
      count: t.count,
      page: t.page,
      columns: t.columns,
      rows: t.rows,
      setSearch: t.setSearch,
      setFilter: t.setFilter,
      setCount: t.setCount,
      setPage: t.setPage,
      onChangeColumnOrder: t.onChangeColumnOrder
    };
  });
};

export { useTable };

