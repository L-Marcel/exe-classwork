function getPercent(value: number, total: number) {
  if(total <= 0 && value <= 0) {
    return 100;
  } else if(total > 0 && value <= 0) {
    return 0;
  };

  const result = (value / total) * 100;

  return result.toFixed(2);
};

function getPercentValue(value: number, total: number) {
  if(total <= 0 && value <= 0) {
    return 100;
  } else if(total > 0 && value <= 0) {
    return 0;
  };

  return (value / total) * 100;
};

export { getPercent, getPercentValue };

