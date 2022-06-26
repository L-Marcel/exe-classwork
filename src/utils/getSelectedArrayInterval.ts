function getSelectedArrayInterval(arr: any[], interval: [number, number]) {
  interval = [Math.round(interval[0]/100), Math.round(interval[1]/100)];
  return arr.slice(interval[0], interval[1] + 1);
};

export { getSelectedArrayInterval };

