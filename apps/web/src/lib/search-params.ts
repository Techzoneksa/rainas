import type { ApiSort } from "@raina/api-contracts";

export type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export function readSort(
  params: Record<string, string | string[] | undefined>,
  fallback: ApiSort = "created_desc"
): ApiSort {
  const value = readParam(params, "sort");
  if (
    value === "created_desc" ||
    value === "created_asc" ||
    value === "rating_desc" ||
    value === "rating_asc"
  ) {
    return value;
  }
  return fallback;
}
