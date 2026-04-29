const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function priceToPence(price) {
  const numericValue = Number.parseFloat(String(price).replace(/[^0-9.]/g, ""));

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return Math.round(numericValue * 100);
}

export function formatPenceAsPounds(amountInPence) {
  return currencyFormatter.format(amountInPence / 100);
}
