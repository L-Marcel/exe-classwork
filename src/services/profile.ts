import { getHours } from "date-fns";
import { RepositoryProfileItemProps } from "../components/Repository/RepositoryProfileItem";

class ProfileAnalyzer {
  constructor(
    private data: UserCommit[], 
    private commits: Omit<CommitChart, "files">[],
    private user: string
  ) {};

  getNumberOfCommits():  Omit<RepositoryProfileItemProps, "onSelect"> {
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

    const equation = {
      title: "How Classwork identify the programmer version control level?",
      instruction: 'The result is based on participation percent of ' + 
      'total number of commiter\'s commits (C) in relation with the total ' + 
      'no-empty lines (SL) in the code and the number of committers (N).',
      explanation: 'If the repository is big and have a great amount of programmers, ' + 
      'is natural that each should have a smaller number of commits that a small ' +
      'repository with one or three programmers.'
    };

    if(count >= sloc/(1000 * numberOfCommitters)) return {
      message: "Great version controller",
      icon: "crown",
      color: "primary.800",
      description: 'This programmer has a great experience with version control, ' +
      'keeping the changes safe, and resolving possible future errors in the code. ' + 
      'Even the small changes can carry a bug, lost feature, or deleted files.',
      equation: {
        ...equation,
        calc: " SL/(1000.N) \\eqslantless Cv \\quad \\text{(the current category)}"
      }
    };

    if(count >= sloc/(2000 * numberOfCommitters)) return {
      message: "Nice version controller",
      icon: "floppy-disk",
      color: "green.600",
      description: 'This programmer has an experience with version control, keeping some ' +
      'of the changes safe, and resolving some possible future errors in the code. ' + 
      'Even the small changes can carry a bug, lost feature, or deleted files.',
      equation: {
        ...equation,
        calc: "SL/(2000.N) \\eqslantless Cv < SL/(1000.N) \\quad \\text{(the current category)}",
      }
    };

    if(count >= sloc/(4000 * numberOfCommitters)) return {
      message: "Version controller",
      icon: "floppy-disk",
      color: "orange.600",
      description: 'This programmer knows the version control but does not use it frequently. ' +
      'Version control keeps the changes safe and resolves possible future errors in the code. ' + 
      'Even the small changes can carry a bug, lost feature, or deleted files.',
      equation: {
        ...equation,
        calc: "SL/(4000.N) \\eqslantless Cv < SL/(2000.N) \\quad \\text{(the current category)}",
      }
    };

    if(count >= sloc/(8000 * numberOfCommitters)) return {
      message: "Bad version controller",
      icon: "hater",
      color: "red.600",
      description: 'This programmer knows the version control but does not use it properly! ' +
      'Version control is important to keep the changes safe and resolve possible future errors ' +
      'in the code. Even the small changes can carry a bug, lost feature, or deleted files.',
      equation: {
        ...equation,
        calc: "SL/(8000.N) \\eqslantless Cv < SL/(4000.N) \\quad \\text{(the current category)}",
      }
    };
    
    return {
      message: "Versions hater",
      icon: "hater",
      color: "red.600",
      description: 'This programmer have a bad experience with version control! ' +
      'Version control is important to keep the changes safe and resolve possible ' +
      'future errors in the code. Even the small changes can carry a bug, lost feature, or deleted files.',
      equation: {
        ...equation,
        calc: "Cv < SL/(8000.N) \\quad \\text{(the current category... realy?)}",
      }
    };
  };

  getTimeOfCommits(): Omit<RepositoryProfileItemProps, "onSelect"> {
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
          };

          return d;
        });
      };

      return prev;
    }, [] as CommitTime[]).sort((a, b) => b.count - a.count);

    const favoriteHour = timeFrequency.length > 0? timeFrequency[0].hour:NaN;

    const equation = {
      title: "How Classwork identify the programmer's frequent working hours?",
      instruction: 'Get the most frequent hour of the programmer\'s commits. ' +
      'The Classwork use the mode of this values (H).',
    };

    if(favoriteHour >= 22 || favoriteHour < 1) return {
      message: "Late night programmer",
      icon: "alt-moon",
      color: "orange.600",
      size: 5,
      equation: {
        ...equation,
        calc: "22 \\eqslantless H < 1 \\quad \\text{(the current category)}"
      }
    };

    if(favoriteHour <= 5) return {
      message: "Ambitious programmer",
      icon: "alt-moon",
      color: "red.600",
      size: 5,
      equation: {
        ...equation,
        calc: "1 < H \\eqslantless 5 \\quad \\text{(the current category)}"
      }
    };

    if(favoriteHour <= 12) return {
      message: "Morning programmer",
      icon: "afternoon",
      color: "primary.800",
      equation: {
        ...equation,
        calc: "5 < H \\eqslantless 12 \\quad \\text{(the current category)}"
      }
    };

    if(favoriteHour <= 18) return {
      message: "Afternoon programmer",
      icon: "afternoon",
      color: "primary.800",
      equation: {
        ...equation,
        calc: "12 < H \\eqslantless 18 \\quad \\text{(the current category)}"
      }
    };

    return {
      message: "Night programmer",
      icon: "alt-moon",
      color: "primary.800",
      size: 5,
      equation: {
        ...equation,
        calc: "18 < H \\eqslantless 22 \\quad \\text{(the current category)}"
      }
    };
  };

  /*getChangesHistory(): Omit<RepositoryProfileItemProps, "onSelect"> {
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
  };*/

  getChangesMessageLengthHistory(): Omit<RepositoryProfileItemProps, "onSelect"> {
    const userCommits = this.commits.filter(c => c.userGithubId === this.user);
    const averageOfMessagesLength = userCommits.reduce((prev, cur) => {
      prev += ((cur.message || "").length);
      return prev;
    }, 0)/userCommits.length;

    const equation = {
      title: "How Classwork calculate the commit's messages length?",
      instruction: 'Get the average of all the programmer\'s commit message lengths (M).'
    };

    if(averageOfMessagesLength > 70) return {
      message: "Articles, not messages",
      icon: "newspaper",
      color: "red.600",
      equation: {
        ...equation,
        calc: "70 < M \\quad \\text{(the current category)}"
      }
    };

    if(averageOfMessagesLength > 50) return {
      message: "Extra long messages",
      icon: "newspaper",
      color: "orange.600",
      equation: {
        ...equation,
        calc: "50 < M \\quad \\text{(the current category)}"
      }
    };

    if(averageOfMessagesLength >= 40) return {
      message: "Long messages",
      icon: "messages",
      color: "green.600",
      equation: {
        ...equation,
        calc: "40 \\eqslantless M \\quad \\text{(the current category)}"
      }
    };

    if(averageOfMessagesLength >= 20) return {
      message: "Small messages", 
      icon: "messages",
      color: "primary.800",
      equation: {
        ...equation,
        calc: "20 \\eqslantless M \\quad \\text{(the current category)}"
      }
    };

    if(averageOfMessagesLength >= 10) return {
      message: "Short messages", 
      icon: "paperplane",
      color: "primary.800",
      size: 5,
      equation: {
        ...equation,
        calc: "10 \\eqslantless M \\quad \\text{(the current category)}"
      }
    };

    return {
      message: "Bad messages", 
      icon: "warning",
      color: "red.600",
      equation: {
        ...equation,
        calc: "M < 10 \\quad \\text{(the current category)}"
      }
    };
  };

  getContribution(): Omit<RepositoryProfileItemProps, "onSelect"> {
    const total = this.data.reduce((prev, cur) => {
      prev += cur.contribution;
      return prev;
    }, 0);

    const currentUser = this.data.find(d => d.user.id === this.user);
    const contribution = currentUser?.contribution;
    const percentOfExpected = total/this.data.length;

    const percent = contribution/percentOfExpected;

    const equation = {
      title: "How Classwork calculate the programmer contribution?",
      instruction: 'Get the  programmer  percent of: ' + 
      'changes(CH); methods (MT); classes(CS) and complexity(CM). ' +
      'In sequence, apply the following formula:',
      calc: "C_u = \\dfrac{(2.CH_u) + (0.5.MT_u) + (0.5.CS_u) + CM_u}{4}\\\\ \\space \\\\E=100/N",
      explanation: 'Based on the formula above, the expected programmer contribution (E) ' +
      'is calculated using the number of committers (N). In this case, is expected that each programmer ' +
      `has ${(percentOfExpected * 100).toFixed(2)}% (E) of the contribution. With these values, Classwork set ` +
      'the classification is as this way: '
    };

    if(percent <= 0.4) return {
      message: "Need more help",
      icon: "helping",
      color: "orange.600",
      description: 'Unfortunately, the current programmer doesn\'t contribute much to the project. ' +
      'He/she should get more help from the rest of the team! ' + 
      'Especially if he/she are someone who is starting to programming...',
      equation: {
        ...equation,
        explanationCalc: `C_u/${(percentOfExpected).toFixed(2).replace(".", ",")} \\eqslantless 0,4  \\quad \\text{(the current category)}`
      }
    };

    if(percent <= 0.5) return {
      message: "Need a little help",
      icon: "helping",
      color: "orange.600",
      equation: {
        ...equation,
        explanationCalc: `0,5 \\eqslantless C_u/${(percentOfExpected).toFixed(2).replace(".", ",")} < 0,6 \\quad \\text{(the current category)}`
      }
    };

    if(percent <= 0.6) return {
      message: "Can contribute more",
      icon: "sunrise",
      color: "green.600",
      equation: {
        ...equation,
        explanationCalc: `0,6 \\eqslantless C_u/${(percentOfExpected).toFixed(2).replace(".", ",")} < 0,8 \\quad \\text{(the current category)}`
      }
    };

    if(percent <= 0.8) return {
      message: "Good contribution",
      icon: "tools",
      color: "green.600",
      equation: {
        ...equation,
        explanationCalc: `0,8 \\eqslantless C_u/${(percentOfExpected).toFixed(2).replace(".", ",")} < 1,2 \\quad \\text{(the current category)}`
      }
    };

    if(percent <= 1.2) return {
      message: "Very good contribution",
      icon: "tools",
      color: "primary.800",
      size: 5,
      equation: {
        ...equation,
        explanationCalc: `1,2 \\eqslantless C_u/${(percentOfExpected).toFixed(2).replace(".", ",")} < 1,3 \\quad \\text{(the current category)}`
      }
    };

    return {
      message: "Solitary programmer",
      icon: "tools",
      color: "red.600",
      equation: {
        ...equation,
        explanationCalc: `1,2 < C_u/${(percentOfExpected).toFixed(2).replace(".", ",")} \\quad \\text{(the current category)}`
      }
    };
  };

  getOrganizationByMethods(): Omit<RepositoryProfileItemProps, "onSelect"> {
    const sloc = this.commits[this.commits.length - 1].sloc;
    const currentUser = this.data.find(d => d.user.id === this.user);

    const equation = {
      title: "How Classwork understand the frequency of methods usage?",
      instruction: 'The result is based on the participation of the total number of ' +
      'the project methods (M) concerning the total no-empty lines (SL) in the code.'
    };

    if(currentUser?.organization.methods <= 0) return {
      message: "Doesn't know methods",
      icon: "question",
      color: "red.600",
      size: 5,
      equation: {
        ...equation,
        calc: "M \\eqslantless 0 \\quad \\text{(the current category)}"
      }
    };

    if(currentUser?.organization.methods <= (sloc/10000)) return {
      message: "Need more methods",
      icon: "tune",
      color: "orange.600",
      equation: {
        ...equation,
        calc: "0 < M \\eqslantless (SL/10000) \\quad \\text{(the current category)}"
      }
    };

    if(currentUser?.organization.methods <= (sloc/1000)) return {
      message: "Likes methods",
      icon: "tune",
      color: "green.600",
      equation: {
        ...equation,
        calc: "(SL/10000) < M \\eqslantless (SL/1000) \\quad \\text{(the current category)}"
      }
    };

    if(currentUser?.organization.methods <= (sloc/100)) return {
      message: "Methodological programmer",
      icon: "methods-icon",
      color: "green.600",
      equation: {
        ...equation,
        calc: "(SL/1000) < M \\eqslantless (SL/100)M \\eqslantless (SL/100) \\quad \\text{(the current category)}"
      }
    };

    return {
      message: "Methodological programmer",
      icon: "methods-icon",
      color: "primary.800",
      equation: {
        ...equation,
        calc: "(SL/100) < M \\quad \\text{(the current category)}"
      }
    };
  };

  getOrganizationByClasses(): Omit<RepositoryProfileItemProps, "onSelect"> {
    const sloc = this.commits[this.commits.length - 1].sloc;
    const currentUser = this.data.find(d => d.user.id === this.user);

    const equation = {
      title: "How Classwork understand the frequency of methods usage?",
      instruction: 'The result is based on the participation of the total number of ' +
      'the project classes (C) concerning the total no-empty lines (SL) in the code.'
    };
    
    if(currentUser?.organization.classes <= 0) return {
      message: "Doesn't know classes",
      icon: "question",
      color: "red.600",
      size: 5,
      equation: {
        ...equation,
        calc: "C \\eqslantless 0 \\quad \\text{(the current category)}"
      }
    };

    if(currentUser?.organization.classes <= (sloc/25000)) return {
      message: "Need more classes",
      icon: "class",
      color: "orange.600",
      equation: {
        ...equation,
        calc: "0 < C \\eqslantless (SL/25000) \\quad \\text{(the current category)}"
      }
    };

    if(currentUser?.organization.classes <= (sloc/2500)) return {
      message: "Likes classes",
      icon: "class",
      color: "green.600",
      equation: {
        ...equation,
        calc: "(SL/25000) < C \\eqslantless (SL/2500) \\quad \\text{(the current category)}"
      }
    };

    if(currentUser?.organization.classes <= (sloc/250)) return {
      message: "Oriented by objects",
      icon: "class",
      color: "green.600",
      equation: {
        ...equation,
        calc: "(SL/2500) < C \\eqslantless (SL/250) \\quad \\text{(the current category)}"
      }
    };

    return {
      message: "Oriented by objects",
      icon: "class",
      color: "primary.800",
      equation: {
        ...equation,
        calc: "(SL/250) < C \\quad \\text{(the current category)}"
      }
    };
  };
};

export { ProfileAnalyzer };

