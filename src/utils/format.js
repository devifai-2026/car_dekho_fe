// Money/format helpers — single source of truth for price display.
// Prices are stored in INR rupees; the UI shows lakhs (₹X.XL).

export const inrToLakh = (inr) => inr / 100000;

/** Format a lakh value: lakhStr(12) -> "₹12.00L". */
export const lakhStr = (lakh, dp = 2) => `₹${Number(lakh).toFixed(dp)}L`;

/** Format an INR amount as lakhs: inrToLakhStr(1200000) -> "₹12.00L". */
export const inrToLakhStr = (inr, dp = 2) => lakhStr(inrToLakh(inr), dp);
