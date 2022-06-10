import { getHours } from "date-fns";

class ProfileAnalyzer {
  constructor(
    private data: UserCommit[], 
    private commits: Commit[],
    private user: string
  ) {};

  getNumberOfCommits() {
    if(this.data.length <= 0) {
      return {
        message: "No commits",
        icon: "slepping",
        color: "red.600"
      };
    };

    const total = this.data.reduce((prev, cur) => {
      prev += cur.count;
      return prev;
    }, 0);

    const currentUserCommit = this.data.find(d => d.user.id === this.user);
    const count = currentUserCommit?.count;
    const percentOfExpected = total/this.data.length;
    const percent = (count/percentOfExpected);
    const biggestCommitsCount = this.data.sort((a, b) => b.count - a.count)[0].count;

    if(biggestCommitsCount === count) return {
      message: "Biggest version controller",
      icon: "crown",
      color: "primary.800"
    };

    if(percent >= 0.8) return {
      message: "Great version controller",
      icon: "floppy-disk",
      color: "primary.800"
    };

    if(percent >= 0.6) return {
      message: "Nice version controller",
      icon: "floppy-disk",
      color: "green.600"
    };

    if(percent >= 0.5) return {
      message: "Version controller",
      icon: "floppy-disk",
      color: "orange.600"
    };

    if(percent >= 0.25) return {
      message: "Bad version controller",
      icon: "hater",
      color: "red.600"
    };
    
    return {
      message: "Versions hater",
      icon: "hater",
      color: "red.600"
    };
  };

  getTimeOfCommits() {
    const timeOfCommits = this.commits.reduce((prev, cur) => {
      if(cur.userGithubId === this.user) {
        prev.push(getHours(new Date(cur.commitedAt)));
      };

      return prev;
    }, [] as number[]);


    const timeFrequency = timeOfCommits.reduce((prev, cur) => {
      const alreadyInArr = prev.find(d => d.hour === cur);

      if(!alreadyInArr) {
        prev.push({
          hour: cur,
          count: 1
        });
      } else {
        prev = prev.map(d => {
          if(d.hour === cur) {
            d.count++;
          }

          return d;
        });
      };

      return prev;
    }, [] as CommitTime[]).sort((a, b) => b.count - a.count);

    const favoriteHour = timeFrequency.length > 0? timeFrequency[0].hour:NaN;

    if(favoriteHour >= 23 || favoriteHour < 0) return {
      message: "Late night programmer",
      icon: "alt-moon",
      color: "orange.600",
      size: 5
    };

    if(favoriteHour <= 5) return {
      message: "Ambitious programmer",
      icon: "alt-moon",
      color: "red.600",
      size: 5
    };

    if(favoriteHour <= 12) return {
      message: "Morning programmer",
      icon: "afternoon",
      color: "primary.800"
    };

    if(favoriteHour <= 18) return {
      message: "Afternoon programmer",
      icon: "afternoon",
      color: "primary.800"
    };

    return {
      message: "Night programmer",
      icon: "alt-moon",
      color: "primary.800",
      size: 5
    };
  };

  getChangesHistory() {
    const { additions, deletions } = this.commits.reduce((prev, cur) => {
      if(cur.userGithubId === this.user) {
        prev.additions += cur.totalAdditions;
        prev.deletions += cur.totalDeletions
      };

      return prev;
    }, {
      additions: 0,
      deletions: 0
    });

    if(additions >= deletions) return { 
      message: "Likes to add", 
      icon: "add-circle",
      color: "primary.800"
    };

    if(additions < deletions) return { 
      message: "Likes to remove", 
      icon: "remove-circle",
      color: "green.600"
    };
  };

  getChangesMessageLengthHistory() {
    const userCommits = this.commits.filter(c => c.userGithubId === this.user);
    const averageOfMessagesLength = userCommits.reduce((prev, cur) => {
      prev += ((cur.message || "").length);
      return prev;
    }, 0)/userCommits.length;

    if(averageOfMessagesLength > 70) return {
      message: "Articles, not messages",
      icon: "newspaper",
      color: "red.600"
    };

    if(averageOfMessagesLength > 50) return {
      message: "Extra long messages",
      icon: "newspaper",
      color: "orange.600"
    };

    if(averageOfMessagesLength >= 40) return {
      message: "Long messages",
      icon: "documentation",
      color: "green.600"
    };

    if(averageOfMessagesLength >= 20) return {
      message: "Small messages", 
      icon: "documentation",
      color: "primary.800"
    };

    if(averageOfMessagesLength >= 10) return {
      message: "Short messages", 
      icon: "paperplane",
      color: "primary.800",
      size: 5
    };

    return {
      message: "Bad messages", 
      icon: "warning",
      color: "red.600"
    };
  };

  getContribution() {
    const total = this.data.reduce((prev, cur) => {
      prev += cur.contribution;
      return prev;
    }, 0);

    const currentUser = this.data.find(d => d.user.id === this.user);
    const contribution = currentUser?.contribution;
    const percentOfExpected = total/this.data.length;
    const percent = contribution/percentOfExpected;

    if(percent <= 0.4) return {
      message: "Need more help",
      icon: "helping",
      color: "orange.600"
    };

    if(percent <= 0.5) return {
      message: "Need a little help",
      icon: "helping",
      color: "orange.600"
    };

    if(percent <= 0.6) return {
      message: "Can contribute more",
      icon: "sunrise",
      color: "green.600"
    };

    if(percent <= 0.8) return {
      message: "Good contribution",
      icon: "sunrise",
      color: "green.600"
    };

    if(percent <= 1) return {
      message: "Very good contribution",
      icon: "sunglasses",
      color: "primary.800",
      size: 5
    };

    return {
      message: "Solitary knight",
      icon: "sword",
      color: "red.600"
    };
  };

  getOrganizationByMethods() {
    const total = this.data.reduce((prev, cur) => {
      prev += cur.organization.methods;
      return prev;
    }, 0);

    const currentUser = this.data.find(d => d.user.id === this.user);
    const methods = currentUser?.organization.methods;
    const percentOfExpected = total/this.data.length;
    const percent = methods/percentOfExpected;

    if(percent <= 0) return {
      message: "Doesn't know methods",
      icon: "question",
      color: "red.600",
      size: 5
    };

    if(percent <= 0.25) return {
      message: "Need more methods",
      icon: "tune",
      color: "orange.600"
    };

    if(percent <= 0.5) return {
      message: "Likes methods",
      icon: "tune",
      color: "green.600"
    };

    if(percent <= 0.75) return {
      message: "Methodological programmer",
      icon: "methods-icon",
      color: "green.600"
    };

    return {
      message: "Methodological programmer",
      icon: "methods-icon",
      color: "primary.800"
    };
  };

  getOrganizationByClasses() {
    const total = this.data.reduce((prev, cur) => {
      prev += cur.organization.classes;
      return prev;
    }, 0);

    const currentUser = this.data.find(d => d.user.id === this.user);
    const classes = currentUser?.organization.classes;
    const percentOfExpected = total/this.data.length;
    const percent = classes/percentOfExpected;

    console.log(percent);

    if(percent <= 0) return {
      message: "Doesn't know classes",
      icon: "question",
      color: "red.600",
      size: 5
    };

    if(percent <= 0.25) return {
      message: "Need more classes",
      icon: "class",
      color: "orange.600"
    };

    if(percent <= 0.5) return {
      message: "Likes classes",
      icon: "class",
      color: "green.600"
    };

    if(percent <= 0.75) return {
      message: "Oriented by objects",
      icon: "class",
      color: "green.600"
    };

    return {
      message: "Oriented by objects",
      icon: "class",
      color: "primary.800"
    };
  };
};

export { ProfileAnalyzer };

