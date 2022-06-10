const specialKeys = [
  "totalDeletions", 
  "totalAdditions", 
  "totalChanges", 
  "filesAdded", 
  "filesRemoved", 
  "filesModified"
];

function getDiffInCommitValue({
  order = 0,
  dataKey = "",
  value = 0,
  commits = []
}) {
  let diff = 0;
            
  try {
    const indexOfLastItem = order-1;
    
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

