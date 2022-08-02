import { format } from "date-fns";
import { useCommitsProfile } from "../../../contexts/hooks/useCommitsProfile";
import { Table } from "../../Table";

interface ClassroomContributorsTableContentProp {
  repositories: Repository[];
};

function ClasssroomContributorsTableContent({
  repositories
}: ClassroomContributorsTableContentProp) {
  const data = repositories.reduce((prev, cur) => {
    const repository = cur;

    for(let t in (repository.teams || [])) {
      const team = repository.teams[t];

      for(let u in (team.users || [])) {
        const userRelation = team.users[u];
        const user = userRelation.user;

        const filteredCommits = repository?.commits?.filter(c => c.filtered);
        const firstItemBefore = cur?.commits?.find(c => 
          filteredCommits && filteredCommits.length > 0 && c.order === filteredCommits[0].order - 1
        );

        const profile = useCommitsProfile({
          commits: (filteredCommits || []),
          selectedUser: user.githubId,
          allowNeverDate: true,
          firstItemBefore
        });

        const profileInTotal = useCommitsProfile({
          commits: (repository?.commits || []),
          selectedUser: user.githubId,
          allowNeverDate: true
        });

        //just format
        const favoriteHour = new Date();
        
        if(profile.result[2]?.value) {
          favoriteHour.setHours(profile.result[2].value);
        };

        prev.push({
          id: repository.fullname + team.title + (user.name || user.username),
          team: team.title,
          repository: repository.fullname,
          user: (user.name || user.username),
          role: userRelation.role,
          contribution: profile.userCommits?.contribution,
          totalContribution: 1,
          commits: profile.userCommits?.count,
          totalCommits: profileInTotal.total?.count,
          changes: profile.userCommits?.progress,
          totalChanges: profileInTotal.total?.progress,
          classes: profile.userCommits?.organization?.classes,
          totalClasses: profileInTotal.total?.organization?.classes,
          methods: profile.userCommits?.organization?.methods,
          totalMethods: profileInTotal.total?.organization?.methods,
          complexity: profile.userCommits?.complexity,
          totalComplexity: profileInTotal.total?.complexity,
          lastCommit: profile.lastDate,
          favoriteHour: profile.result[2]?.value && format(favoriteHour, "h aaa")
        });
      };
    };

    return prev;
  }, []);

  return (
    <Table
      columns={[{
        value: "team",
        icon: "teams",
        isPrimary: true
      }, {
        value: "repository",
      }, {
        value: "user",
        icon: "user",
        tdProps: {
          minW: "150px"
        }
      }, {
        value: "role",
        icon: "key"
      }, {
        value: "contribution",
        percentOfData: "totalContribution",
        showOnlyPercent: true,
        icon: "percent"
      }, {
        value: "commits",
        percentOfData: "totalCommits",
        icon: "number"
      }, {
        value: "changes",
        percentOfData: "totalChanges",
        icon: "tools"
      }, {
        value: "classes",
        percentOfData: "totalClasses",
        icon: "class"
      }, {
        value: "methods",
        percentOfData: "totalMethods",
        icon: "methods-icon"
      }, {
        value: "complexity",
        percentOfData: "totalComplexity",
        icon: "oriented"
      }, {
        value: "lastCommit",
        name: "last commit",
        icon: "calendar"
      }, {
        value: "favoriteHour",
        name: "favorite hour",
        icon: "clock"
      }]}
      rows={data}
    />
  );
};

export { ClasssroomContributorsTableContent };

