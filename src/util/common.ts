// Convert a floating number into a currency format
export const formatNumberIntoCurrency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(number);
}