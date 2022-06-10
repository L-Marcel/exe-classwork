function getPercent(value: number, total: number) {
  if(total <= 0 && value <= 0) {
    return 100;
  } else if(total > 0 && value <= 0) {
    return 0;
  };

  return ((value / total) * 100).toFixed(2);
};

export { getPercent };
