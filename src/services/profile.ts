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

    const currentUser = this.data.find(d => d.user.id === this.user);
    const count = currentUser?.count;
    const percentOfExpected = count/(total/this.data.length);
    const biggestCommitsCount = this.data.sort((a, b) => b.count - a.count)[0].count;

    if(biggestCommitsCount === count) return {
      message: "Biggest commiter",
      icon: "crown",
      color: "primary.800"
    };

    if(percentOfExpected >= 0.8) return {
      message: "Very frequent commiter",
      icon: "frequency",
      color: "primary.800"
    };

    if(count >= 0.6) return {
      message: "Frequent commiter",
      icon: "frequency",
      color: "green.600"
    };

    if(count >= 0.5) return {
      message: "Moderate commiter",
      icon: "hourglass",
      color: "orange.600",
      size: 5
    };

    if(count >= 0.25) return {
      message: "Occasional commiter",
      icon: "slepping",
      color: "red.600"
    };
    
    return {
      message: "Very occasional commiter",
      icon: "slepping",
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
      color: "green.600"
    };

    if(additions < deletions) return { 
      message: "Likes to remove", 
      icon: "remove-circle",
      color: "orange.600"
    };
  };

  getChangesMessageLengthHistory() {
    const userCommits = this.commits.filter(c => c.userGithubId === this.user);
    const averageOfMessagesLength = userCommits.reduce((prev, cur) => {
      prev += ((cur.message || "").length);
      return prev;
    }, 0)/userCommits.length;

    if(averageOfMessagesLength > 50) return {
      message: "Hyper messages",
      icon: "newspaper",
      color: "red.600"
    };

    if(averageOfMessagesLength >= 30) return {
      message: "Big messages",
      icon: "documentation",
      color: "orange.600"
    };

    if(averageOfMessagesLength >= 20) return {
      message: "Small messages", 
      icon: "like",
      color: "green.600"
    };

    if(averageOfMessagesLength >= 10) return {
      message: "Tiny messages", 
      icon: "paperplane",
      color: "orange.600",
      size: 5
    };

    return {
      message: "Bad messages", 
      icon: "warning",
      color: "red.600"
    };
  };

  getTeamwork() {
    const total = this.data.reduce((prev, cur) => {
      prev += cur.count;
      return prev;
    }, 0);

    const currentUser = this.data.find(d => d.user.id === this.user);
    const count = currentUser?.count;
    const percentOfExpected = count/(total/this.data.length);

    if(percentOfExpected <= 0.4) return {
      message: "Need more help",
      icon: "helping",
      color: "orange.600"
    };

    if(percentOfExpected <= 0.5) return {
      message: "Need a little help",
      icon: "helping",
      color: "orange.600"
    };

    if(percentOfExpected <= 0.6) return {
      message: "Can contribute more",
      icon: "sunrise",
      color: "green.600"
    };

    if(percentOfExpected <= 0.8) return {
      message: "Good contribution",
      icon: "like",
      color: "green.600"
    };

    if(percentOfExpected <= 1) return {
      message: "Very good contribution",
      icon: "sunglasses",
      color: "green.600",
      size: 5
    };

    return {
      message: "Solitary knight",
      icon: "sword",
      color: "red.600"
    };
  };
};

export { ProfileAnalyzer };

