import { Box } from "@chakra-ui/react";
import { Button } from "../../components/Buttons/Button";
import { Section } from "../../components/Section";
import { Table } from "../../components/Table";
import { TableFilter } from "../../components/Table/Filter";
import { TablePagination } from "../../components/Table/Pagination";
import { Title } from "../../components/Title";
import { TableProvider } from "../../contexts/TableProvider";
import { WithUserProps } from "../../utils/routes/WithUserProps";

function TablePage() {
  return (
    <Section
      isNeabyOfNavigation
    >
      <Title mb={5}>Example of a table</Title>
      <TableProvider
        columns={[
          {
            value: "id",
            icon: "key"
          },
          {
            value: "name",
            icon: "user"
          },
          {
            value: "value"
          },
          {
            value: "button"
          }
        ]}
        rows={[{
          id: 17,
          name: "example abcdef 1234567891011121314 1234567891011121314 1234567891011121314 1234567891011121314 1234567891011121314 1234567891011121314 1234567891011121314",
          value: 59.5,
          button: <Button w="100%">abc</Button>
        },
        {
          id: 15,
          name: "example",
          value: 59.2,
          button: <Button w="100%">abc</Button>
        },
        {
          id: 20,
          name: "last example",
          value: 59.5
        },
        {
          id: 30,
          name: "example",
          value: 59.5
        },
        {
          id: 40,
          name: "example",
          value: 59.2
        },
        {
          id: 50,
          name: "last example",
          value: 59.5
        },
        {
          id: 60,
          name: "example",
          value: 59.5
        },
        {
          id: 70,
          name: "example",
          value: 59.2
        },
        {
          id: 80,
          name: "last example",
          value: 59.5
        },
        {
          id: 90,
          name: "example",
          value: 59.5
        },
        {
          id: 100,
          name: "example",
          value: 59.2
        },
        {
          id: 101,
          name: "last example",
          value: 59.5
        },
        {
          id: 102,
          name: "example",
          value: 59.5
        },
        {
          id: 103,
          name: "example",
          value: 59.2
        },
        {
          id: 104,
          name: "last example",
          value: 59.5
        },
        {
          id: 0,
          name: "example abcdef 1234567891011121314 1234567891011121314 1234567891011121314 1234567891011121314 1234567891011121314 1234567891011121314 1234567891011121314",
          value: 59.5,
          button: <Button w="100%">abc</Button>
        },
        {
          id: 1,
          name: "example",
          value: 59.2,
          button: <Button w="100%">abc</Button>
        },
        {
          id: 2,
          name: "last example",
          value: 59.5
        },
        {
          id: 3,
          name: "example",
          value: 59.5
        },
        {
          id: 4,
          name: "example",
          value: 59.2
        },
        {
          id: 5,
          name: "last example",
          value: 59.5
        },
        {
          id: 6,
          name: "example",
          value: 59.5
        },
        {
          id: 7,
          name: "example",
          value: 59.2
        },
        {
          id: 8,
          name: "last example",
          value: 59.5
        },
        {
          id: 9,
          name: "example",
          value: 59.5
        },
        {
          id: 10,
          name: "example",
          value: 59.2
        },
        {
          id: 11,
          name: "last example",
          value: 59.5
        },
        {
          id: 12,
          name: "example",
          value: 59.5
        },
        {
          id: 13,
          name: "example",
          value: 59.2
        },
        {
          id: 14,
          name: "last example",
          value: 59.5
        }]}
      >
        <Box
          display="flex"
          flexDir="column"
          maxW="100%"
          minW={["100%", "100%", "100%", 400]}
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
          <Table/>
        </Box>
      </TableProvider>
    </Section>
  );
};

export default WithUserProps(TablePage);