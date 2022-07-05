import { Table } from "../../Table";
import { ClassroomRepositoryIsSelectedButton } from "./ClassroomRepositoryIsSelectedButton";
import { ClassroomRepositorySelectedText } from "./ClassroomRepositorySelectedText";

interface ClassroomMetricsTableProps {
  repositories: Repository[];
};

function ClassroomMetricsTable({ repositories }: ClassroomMetricsTableProps) {
  const data = repositories.reduce((prev, cur, i) => {
    prev.push({
      ...cur,
      _isSelectedButton: <ClassroomRepositoryIsSelectedButton
        index={i}
      />
    });
    return prev;
  }, []);

  return (
    <>
      <Table
        container={{
          minW: "100%",
          mb: 5
        }}
        columns={[{
          value: "_isSelectedButton",
          icon: "eye-closed",
          name: " ",
          reference: "fullname",
          thProps: {
            w: 10,
            maxW: 10
          }
        }, {
          value: "fullname",
          isPrimary: true
        }, {
          value: "complexity",
          icon: "oriented"
        }, {
          value: "churn",
          icon: "tools"
        }, {
          value: "methods",
          icon: "methods-icon"
        }, {
          value: "classes",
          icon: "class"
        }, {
          value: "sloc",
          icon: "menu"
        }]}
        rows={data}
      />
      <ClassroomRepositorySelectedText
        data={data}
      />
    </>
  );
};

export { ClassroomMetricsTable };

