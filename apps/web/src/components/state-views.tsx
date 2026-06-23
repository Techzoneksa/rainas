import { Button, EmptyState, ErrorState, Skeleton, Stack } from "@raina/ui";

import { getApiErrorMessage, isRainaApiError } from "@/lib/api/errors";

export function ApiErrorState({ error }: Readonly<{ error: unknown }>) {
  const description = isRainaApiError(error)
    ? getApiErrorMessage(error)
    : "تعذر تحميل البيانات. تأكد أن خدمة رأينا تعمل ثم أعد المحاولة.";

  return (
    <ErrorState
      title="تعذر تحميل البيانات"
      description={description}
      retryAction={
        <Button variant="outline" type="button">
          أعد تحميل الصفحة
        </Button>
      }
    />
  );
}

export function NotFoundState({
  title = "لم يتم العثور على الصفحة"
}: Readonly<{ title?: string }>) {
  return (
    <EmptyState title={title} description="المحتوى المطلوب غير متاح أو لم يعد منشورا." icon="؟" />
  );
}

export function PageSkeleton() {
  return (
    <Stack gap="16" aria-label="جاري تحميل الصفحة">
      <Skeleton variant="text" />
      <Skeleton variant="card" />
      <Skeleton variant="card" />
    </Stack>
  );
}
