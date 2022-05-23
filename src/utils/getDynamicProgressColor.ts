function getDynamicProgressColor(value: number) {
  if(value >= 80) return "primary.400";
  if(value >= 60) return "green.400";
  if(value >= 40) return "yellow.400";
  if(value >= 20) return "orange.400";
  return "red.400";  
};

export { getDynamicProgressColor };

