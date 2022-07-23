const specialKeys = [
  "totalDeletions", 
  "totalAdditions", 
  "totalChanges", 
  "filesAdded", 
  "filesRemoved", 
  "filesModified"
];

interface GetDiffInCommitValueProps {
  dataKey?: string;
  value?: number;
  commits?: any[];
  indexOfLastItem?: number;
  firstItemBefore?: any;
};

function getDiffInCommitValue({
  dataKey = "",
  value = 0,
  commits = [],
  indexOfLastItem = 0,
  firstItemBefore
}: GetDiffInCommitValueProps) {
  let diff = 0;
            
  try {
    if(
      indexOfLastItem >= 0 && 
      !specialKeys.includes(dataKey)
    ) {
      diff = value - commits[indexOfLastItem][dataKey];
    } else if(
      indexOfLastItem < 0 && 
      !specialKeys.includes(dataKey)
    ) {
      diff = value - (firstItemBefore? firstItemBefore[dataKey]:0);
    };
  } catch(e) {};

  return diff;
};

export { getDiffInCommitValue };

