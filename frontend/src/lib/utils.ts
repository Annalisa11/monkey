import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculatePercentage = (
  numerator: number,
  denominator: number,
  decimalPlaces: number = 2
): number => {
  if (denominator <= 0) return 0;
  return Number(((numerator / denominator) * 100).toFixed(decimalPlaces));
};
