export function getIsBeta() {
  return new Boolean(process.env.NEXT_PUBLIC_IS_BETA).valueOf();
};