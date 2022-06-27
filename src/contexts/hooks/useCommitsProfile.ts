import { formatDistance } from "date-fns";
import { ProfileAnalyzer } from "../../services/profile";
import { getDiffInCommitValue } from "../../utils/getDiffInCommitValue";

interface CommitsProfileProps {
  selectedUser: string;
  commits: Commit[];
  isFormatted?: boolean;
};

function useCommitsProfile({
  commits,
  selectedUser,
  isFormatted = false,
}: CommitsProfileProps) {
  const formattedCommits: (Omit<CommitChart, "files"> | any)[] = isFormatted? commits:commits.map(commit => {
    return {
      ...commit,
      methods: commit.methods.length,
      classes: commit.classes.length,
    };
  });

  let { data, total } = formattedCommits.reduce((prev, cur, index) => {
    const userAlreadyExistsInArray = prev.data.some(c => c.user.id === cur.userGithubId);
    
    let methodsDiff = getDiffInCommitValue({
      commits: formattedCommits,
      dataKey: "methods",
      order: index,
      value: cur.methods
    });

    let classesDiff = getDiffInCommitValue({
      commits: formattedCommits,
      dataKey: "classes",
      order: index,
      value: cur.classes
    });

    let complexityDiff = getDiffInCommitValue({
      commits: formattedCommits,
      dataKey: "complexity",
      order: index,
      value: cur.complexity
    });

    if(!userAlreadyExistsInArray) {
      prev.data.push({
        user: {
          name: cur.userGithubLogin,
          id: cur.userGithubId
        },
        count: 1,
        progress: cur.totalChanges,
        organization: {
          methods: methodsDiff,
          classes: classesDiff
        },
        complexity: complexityDiff,
        lastDate: cur.commitedAt,
        contribution: 0
      });

      prev.total.count += 1;
      prev.total.progress += cur.totalChanges;
      prev.total.organization.methods += methodsDiff;
      prev.total.organization.classes += classesDiff;
      prev.total.complexity += complexityDiff;
    } else {
      prev.data = prev.data.map(u => {
        if(u.user.id === cur.userGithubId) {
          u.count += 1;
          u.progress += cur.totalChanges;
          u.organization.methods += methodsDiff;
          u.organization.classes += classesDiff;
          u.complexity += complexityDiff;
          u.lastDate = cur.commitedAt;

          prev.total.count += 1;
          prev.total.progress += cur.totalChanges;
          prev.total.organization.methods += methodsDiff;
          prev.total.organization.classes += classesDiff;
          prev.total.complexity += complexityDiff;
        };

        return u;
      });
    };

    return prev;
  }, {
    data: [] as UserCommit[],
    total: {
      count: 0,
      progress: 0,
      organization: {
        methods: 0,
        classes: 0
      },
      complexity: 0,
      contribution: 0
    }
  });

  //just simplifying
  data = data.reduce((prev, cur) => {
    const progress = cur.progress;
    const classes = cur.organization.classes;
    const methods = cur.organization.methods;
    const complexity = cur.complexity;

    const totalProgress = total.progress;
    const totalClasses =  total.organization.classes;
    const totalMethods = total.organization.methods;
    const totalComplexity = total.complexity;

    let contribution = 
      (
        (2 * (totalProgress > 0? (progress/totalProgress):0)) + 
        (0.5 * (totalClasses > 0? (classes/totalClasses):0)) +
        (0.5 * (totalMethods > 0? (methods/totalMethods):0)) + 
        (1 * (totalComplexity > 0? (complexity/totalComplexity):0))
      ) /4;

    if(contribution < 0) {
      contribution = 0;
    };

    cur.contribution = contribution;
    prev.push(cur);
    return prev;
  }, []);

  const userCommits = data.find(u => u.user.id === selectedUser);

  const profile = new ProfileAnalyzer(data, formattedCommits, userCommits?.user?.id || "");

  const commitsCount = profile.getNumberOfCommits();
  const time = profile.getTimeOfCommits();
  const messages = profile.getChangesMessageLengthHistory();
  const commitContribution = profile.getContribution();
  const organizationByMethods = profile.getOrganizationByMethods();
  const organizationByClasses = profile.getOrganizationByClasses();

  const dateOfLastCommit = formatDistance(userCommits? new Date(userCommits?.lastDate):new Date(), new Date());

  const profileResult = [commitsCount, commitContribution, time, messages, organizationByMethods, organizationByClasses];

  return {
    result: profileResult,
    lastDate: dateOfLastCommit,
    userCommits,
    data,
    total
  };
};

export { useCommitsProfile };

