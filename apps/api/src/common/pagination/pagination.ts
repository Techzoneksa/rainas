import type { PaginationMeta } from "@raina/shared-types";

export interface PageResult<TItem> {
  data: TItem[];
  meta: PaginationMeta;
}

export function getPagination(page: number, limit: number): { skip: number; take: number } {
  return {
    skip: (page - 1) * limit,
    take: limit
  };
}

export function createPageResult<TItem>(
  data: TItem[],
  total: number,
  page: number,
  limit: number
): PageResult<TItem> {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
