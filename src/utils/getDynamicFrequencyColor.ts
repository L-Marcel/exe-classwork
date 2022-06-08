function getDynamicFrequencyColor(value: number, max: number) {
  if(value >= max) return "var(--chakra-colors-primary-600)";
  if(value >= max/1.25) return "var(--chakra-colors-green-400)";
  if(value >= max/1.5) return "var(--chakra-colors-yellow-400)";
  if(value >= max/2) return "var(--chakra-colors-orange-400)";
  return "var(--chakra-colors-red-400)";  
};

function getDynamicFillFrequencyColor(value: number, max: number) {
  if(value >= max) return "var(--chakra-colors-primary-900)";
  if(value >= max/1.25) return "var(--chakra-colors-green-600)";
  if(value >= max/1.5) return "var(--chakra-colors-yellow-600)";
  if(value >= max/2) return "var(--chakra-colors-orange-600)";
  return "var(--chakra-colors-red-600)";  
};


export { getDynamicFrequencyColor, getDynamicFillFrequencyColor };

