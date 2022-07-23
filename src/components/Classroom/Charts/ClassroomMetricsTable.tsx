import { getDiffInCommitValue } from "../../../utils/getDiffInCommitValue";
import { Table } from "../../Table";
import { ClassroomRepositoryIsSelectedButton } from "./ClassroomRepositoryIsSelectedButton";
import { ClassroomRepositorySelectedText } from "./ClassroomRepositorySelectedText";

interface ClassroomMetricsTableProps {
  repositories: Repository[];
};

function ClassroomMetricsTable({ repositories }: ClassroomMetricsTableProps) {
  const data = repositories.reduce((prev, cur, i) => {
    const filteredCommits = cur?.commits?.filter(d => d.filtered);
    const firstItemBefore = cur?.commits?.find(c => 
      filteredCommits && filteredCommits.length > 0 && c.order === filteredCommits[0].order - 1
    );

    let complexityDiff = filteredCommits? getDiffInCommitValue({
      commits: filteredCommits,
      dataKey: "complexity",
      indexOfLastItem: -1,
      firstItemBefore,
      value: filteredCommits[filteredCommits.length - 1]?.complexity
    }):0;

    let churnDiff = filteredCommits? getDiffInCommitValue({
      commits: filteredCommits,
      dataKey: "churn",
      indexOfLastItem: -1,
      firstItemBefore,
      value: filteredCommits[filteredCommits.length - 1]?.churn
    }):0;

    let classesDiff = filteredCommits? getDiffInCommitValue({
      commits: filteredCommits,
      dataKey: "classes",
      indexOfLastItem: -1,
      firstItemBefore,
      value: filteredCommits[filteredCommits.length - 1]?.classes
    }):0;

    let methodsDiff = filteredCommits? getDiffInCommitValue({
      commits: filteredCommits,
      dataKey: "methods",
      indexOfLastItem: -1,
      firstItemBefore,
      value: filteredCommits[filteredCommits.length - 1]?.methods
    }):0;

    let slocDiff = filteredCommits? getDiffInCommitValue({
      commits: filteredCommits,
      dataKey: "sloc",
      indexOfLastItem: -1,
      firstItemBefore,
      value: filteredCommits[filteredCommits.length - 1]?.sloc
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

