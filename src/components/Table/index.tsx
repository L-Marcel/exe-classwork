import { Box, BoxProps } from "@chakra-ui/react";
import { TableProvider } from "../../contexts/TableProvider";
import { TableContent } from "./TableContent";
import { TableFilter } from "./TableFilter";
import { TablePagination } from "./TablePagination";

interface TableProps {
  rows: any[];
  columns: TableColumnData[];
  container?: BoxProps;
  caption?: string;
};

function Table({
  rows,
  columns,
  container,
  caption
}: TableProps) {
  return (
    <TableProvider
      rows={rows}
      columns={columns}
    >
      <Box
        display="flex"
        flexDir="column"
        maxW="100%"
        minW={["100%", "100%", "100%", 400]}
        {...container}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          gap={2}
        >
          <TableFilter/>
          <TablePagination/>
        </Box>
        <TableContent
          caption={caption}
        />
      </Box>
    </TableProvider>
  );
};

export { Table };

