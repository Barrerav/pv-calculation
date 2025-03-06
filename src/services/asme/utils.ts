
// Utility functions for ASME calculations

// Format number with thousands separator and 2 decimal places
export const formatNumber = (num: number): string => {
  if (isNaN(num)) return '0,00';
  const fixed = num.toFixed(2);
  const parts = fixed.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return integerPart + ',' + parts[1];
};
