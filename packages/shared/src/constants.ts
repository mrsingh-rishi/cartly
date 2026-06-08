export const DISCOUNT_ORDER_INTERVAL = 3;
export const DISCOUNT_PERCENT = 10;
export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
export const SHIPPING_FEE_CENTS = 799;

export const CATEGORY_CONFIG = {
  Accessories: { bg: "#fef3c7", stripe: "#fde68a", text: "#92400e" },
  Kitchen: { bg: "#d1fae5", stripe: "#a7f3d0", text: "#065f46" },
  Apparel: { bg: "#f1f5f9", stripe: "#e2e8f0", text: "#475569" },
  Office: { bg: "#fef9c3", stripe: "#fef08a", text: "#854d0e" },
  Home: { bg: "#dcfce7", stripe: "#bbf7d0", text: "#166534" },
  Lifestyle: { bg: "#e0f2fe", stripe: "#bae6fd", text: "#0369a1" }
} as const;

