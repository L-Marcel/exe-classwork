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

    const sloc = this.commits[this.commits.length - 1].sloc;
    const currentUserCommit = this.data.find(d => d.user.id === this.user);
    const count = currentUserCommit?.count;
    const numberOfCommitters = this.data.length;

    if(count >= sloc/(1000 * numberOfCommitters)) return {
      message: "Great version controller",
      icon: "crown",
      color: "primary.800"
    };

    if(count >= sloc/(2000 * numberOfCommitters)) return {
      message: "Nice version controller",
      icon: "floppy-disk",
      color: "green.600"
    };

    if(count >= sloc/(4000 * numberOfCommitters)) return {
      message: "Version controller",
      icon: "floppy-disk",
      color: "orange.600"
    };

    if(count >= sloc/(8000 * numberOfCommitters)) return {
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
    const sloc = this.commits[this.commits.length - 1].sloc;
    const currentUser = this.data.find(d => d.user.id === this.user);

    if(currentUser?.organization.methods <= 0) return {
      message: "Doesn't know methods",
      icon: "question",
      color: "red.600",
      size: 5
    };

    if(currentUser?.organization.methods <= (sloc/10000)) return {
      message: "Need more methods",
      icon: "tune",
      color: "orange.600"
    };

    if(currentUser?.organization.methods <= (sloc/1000)) return {
      message: "Likes methods",
      icon: "tune",
      color: "green.600"
    };

    if(currentUser?.organization.methods <= (sloc/100)) return {
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
    const sloc = this.commits[this.commits.length - 1].sloc;
    const currentUser = this.data.find(d => d.user.id === this.user);

    if(currentUser?.organization.classes <= 0) return {
      message: "Doesn't know classes",
      icon: "question",
      color: "red.600",
      size: 5
    };

    if(currentUser?.organization.classes <= (sloc/25000)) return {
      message: "Need more classes",
      icon: "class",
      color: "orange.600"
    };

    if(currentUser?.organization.classes <= (sloc/2500)) return {
      message: "Likes classes",
      icon: "class",
      color: "green.600"
    };

    if(currentUser?.organization.classes <= (sloc/250)) return {
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

