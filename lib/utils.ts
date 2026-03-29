export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatInputNumber = (value: string) => {
  const number = parseInt(value.replace(/\D/g, '')) || 0;
  if (number === 0) return '';
  return new Intl.NumberFormat('id-ID').format(number);
};

export const parseInputNumber = (value: string) => {
  return parseInt(value.replace(/\D/g, '')) || 0;
};
