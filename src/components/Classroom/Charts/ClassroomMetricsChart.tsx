import { Table } from "../../Table";
import { ClassroomRepositoryIsSelectedButton } from "./ClassroomRepositoryIsSelectedButton";
import { ClassroomRepositorySelectedText } from "./ClassroomRepositorySelectedText";

interface ClassroomMetricsChartProps {
  repositories: Repository[];
};

function ClassroomMetricsChart({ repositories }: ClassroomMetricsChartProps) {
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
        }, {
          value: "churn"
        }, {
          value: "methods"
        }, {
          value: "classes"
        }, {
          value: "sloc"
        }]}
        rows={data}
      />
      <ClassroomRepositorySelectedText
        data={data}
      />
    </>
  );
};

export { ClassroomMetricsChart };

