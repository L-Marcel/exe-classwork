function getSelectedArrayInterval<T = any[]>(arr: any[], interval: [number, number]): T[] {
  interval = [Math.round(interval[0]/100), Math.round(interval[1]/100)];
  return arr.slice(interval[0], interval[1] + 1);
};

export { getSelectedArrayInterval };

