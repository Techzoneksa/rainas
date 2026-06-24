import type { Route } from "next";
import Link from "next/link";
import type { PaginationMeta } from "@raina/shared-types";

function buildHref(path: string, params: Record<string, string | undefined>, page: number) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value.length > 0) search.set(key, value);
  }
  search.set("page", String(page));
  return `${path}?${search.toString()}` as Route;
}

export function PaginationControls({
  meta,
  path,
  params = {}
}: Readonly<{
  meta: PaginationMeta;
  path: string;
  params?: Record<string, string | undefined>;
}>) {
  const currentPage = meta.page ?? 1;
  const totalPages = meta.totalPages ?? currentPage;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  if (!hasPrevious && !hasNext) return null;

  return (
    <nav className="web-pagination" aria-label="التنقل بين الصفحات">
      {hasPrevious ? (
        <Link className="web-action" href={buildHref(path, params, currentPage - 1)}>
          السابق
        </Link>
      ) : (
        <span className="web-pagination__disabled">السابق</span>
      )}
      <span className="web-muted">
        صفحة {currentPage} من {totalPages}
      </span>
      {hasNext ? (
        <Link className="web-action" href={buildHref(path, params, currentPage + 1)}>
          التالي
        </Link>
      ) : (
        <span className="web-pagination__disabled">التالي</span>
      )}
    </nav>
  );
}
