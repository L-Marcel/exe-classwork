import { Section } from "../../components/Section";
import { Table } from "../../components/Table";
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
          "id",
          "name",
          "value"
        ]}
        rows={[{
          id: 0,
          name: "example",
          value: 59.5
        },
        {
          id: 1,
          name: "example",
          value: 59.2
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
        <Table/>
      </TableProvider>
    </Section>
  );
};

export default WithUserProps(TablePage);