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
};

function getDiffInCommitValue({
  dataKey = "",
  value = 0,
  commits = [],
  indexOfLastItem = 0
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
      diff = value;
    };
  } catch(e) {};

  return diff;
};

export { getDiffInCommitValue };

