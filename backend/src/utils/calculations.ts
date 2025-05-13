export const calculatePercentage = (
  numerator: number,
  denominator: number,
  decimalPlaces: number = 2
): number => {
  if (denominator <= 0) return 0;
  return Number(((numerator / denominator) * 100).toFixed(decimalPlaces));
};
