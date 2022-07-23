import { getDiffInCommitValue } from "../../../utils/getDiffInCommitValue";
import { Table } from "../../Table";
import { ClassroomRepositoryIsSelectedButton } from "./ClassroomRepositoryIsSelectedButton";
import { ClassroomRepositorySelectedText } from "./ClassroomRepositorySelectedText";

interface ClassroomMetricsTableProps {
  repositories: Repository[];
};

function ClassroomMetricsTable({ repositories }: ClassroomMetricsTableProps) {
  const data = repositories.reduce((prev, cur, i) => {
    let complexityDiff = cur.commits? getDiffInCommitValue({
      commits: cur.commits,
      dataKey: "complexity",
      indexOfLastItem: i - 1,
      value: cur.commits[cur.commits.length - 1]?.complexity
    }):0;

    let churnDiff = cur.commits? getDiffInCommitValue({
      commits: cur.commits,
      dataKey: "churn",
      indexOfLastItem: i - 1,
      value: cur.commits[cur.commits.length - 1]?.churn
    }):0;

    let classesDiff = cur.commits? getDiffInCommitValue({
      commits: cur.commits,
      dataKey: "classes",
      indexOfLastItem: i - 1,
      value: cur.commits[cur.commits.length - 1]?.classes
    }):0;

    let methodsDiff = cur.commits? getDiffInCommitValue({
      commits: cur.commits,
      dataKey: "methods",
      indexOfLastItem: i - 1,
      value: cur.commits[cur.commits.length - 1]?.methods
    }):0;

    let slocDiff = cur.commits? getDiffInCommitValue({
      commits: cur.commits,
      dataKey: "sloc",
      indexOfLastItem: i - 1,
      value: cur.commits[cur.commits.length - 1]?.sloc
    }):0;

    prev.push({
      ...cur,
      complexityDiff,
      churnDiff,
      classesDiff,
      methodsDiff,
      slocDiff,
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
          isPrimary: true,
        }, {
          value: "complexity",
          icon: "oriented"
        }, {
          value: "complexityDiff",
          percentOfData: "complexity",
          icon: "oriented",
          name: "in interval"
        }, {
          value: "churn",
          icon: "tools"
        }, {
          value: "churnDiff",
          percentOfData: "churn",
          icon: "tools",
          name: "in interval"
        }, {
          value: "methods",
          icon: "methods-icon"
        }, {
          value: "methodsDiff",
          percentOfData: "methods",
          icon: "methods-icon",
          name: "in interval"
        }, {
          value: "classes",
          icon: "class"
        }, {
          value: "classesDiff",
          percentOfData: "classes",
          icon: "class",
          name: "in interval"
        }, {
          value: "sloc",
          icon: "menu"
        }, {
          value: "slocDiff",
          percentOfData: "sloc",
          icon: "menu",
          name: "in interval"
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

