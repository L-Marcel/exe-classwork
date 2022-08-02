function getDynamicContributionColor(value: number, max: number) {
  if(value/max > 0.8) return "var(--chakra-colors-primary-600)";
  if(value/max >= 0.6) return "var(--chakra-colors-green-400)";
  if(value/max >= 0.5) return "var(--chakra-colors-yellow-400)";
  if(value/max >= 0.4) return "var(--chakra-colors-orange-400)";
  return "var(--chakra-colors-red-400)";  
};

function getDynamicFillContributionColor(value: number, max: number) {
  if(value/max > 0.8) return "var(--chakra-colors-primary-900)";
  if(value/max >= 0.6) return "var(--chakra-colors-green-600)";
  if(value/max >= 0.5) return "var(--chakra-colors-yellow-600)";
  if(value/max >= 0.4) return "var(--chakra-colors-orange-600)";
  return "var(--chakra-colors-red-600)";  
};


export { getDynamicContributionColor, getDynamicFillContributionColor };

