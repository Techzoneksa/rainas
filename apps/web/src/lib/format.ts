const arabicDateFormatter = new Intl.DateTimeFormat("ar-SA", {
  day: "numeric",
  month: "short",
  year: "numeric"
});

const arabicNumberFormatter = new Intl.NumberFormat("ar-SA", {
  maximumFractionDigits: 1
});

export function formatDate(value: string | null | undefined): string {
  if (!value) return "بدون تاريخ";
  return arabicDateFormatter.format(new Date(value));
}

export function formatRating(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "بدون تقييم";
  const rating = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(rating)) return "بدون تقييم";
  return `${arabicNumberFormatter.format(rating)} من 10`;
}

export function formatCount(value: number | null | undefined, label: string): string {
  return `${arabicNumberFormatter.format(value ?? 0)} ${label}`;
}

export function formatPrice(
  min: string | null | undefined,
  max: string | null | undefined,
  currency: string | null | undefined
): string {
  if (!min && !max) return "السعر غير محدد";
  const resolvedCurrency = currency ?? "SAR";
  if (min && max && min !== max) return `${min} - ${max} ${resolvedCurrency}`;
  return `${min ?? max} ${resolvedCurrency}`;
}

export function excerpt(value: string | null | undefined, length = 130): string {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length).trim()}...` : value;
}

export function clampRating(value: number): number {
  return Math.max(1, Math.min(10, value));
}
