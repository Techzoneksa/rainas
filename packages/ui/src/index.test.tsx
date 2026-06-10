import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  BottomSheet,
  Button,
  Dialog,
  EmptyState,
  ErrorState,
  Input,
  OtpInput,
  Tabs,
  Toast
} from "./index";

describe("ui primitives", () => {
  it("renders button variants with loading state", () => {
    const html = renderToStaticMarkup(<Button isLoading>حفظ</Button>);

    expect(html).toContain("raina-button--primary");
    expect(html).toContain("aria-busy");
    expect(html).toContain("جاري التحميل");
    expect(html).toContain("disabled");
  });

  it("associates input labels and errors", () => {
    const html = renderToStaticMarkup(
      <Input
        label="رقم الجوال"
        kind="phone"
        prefix="+966"
        errorText="رقم الجوال غير صحيح"
        required
      />
    );

    expect(html).toContain("<label");
    expect(html).toContain("aria-invalid");
    expect(html).toContain('inputMode="numeric"');
    expect(html).toContain("رقم الجوال غير صحيح");
  });

  it("renders four numeric otp boxes", () => {
    const html = renderToStaticMarkup(
      <OtpInput defaultValue="12" errorText="الرمز يجب أن يتكون من 4 أرقام" />
    );

    expect(html.match(/inputMode="numeric"/g)?.length).toBe(4);
    expect(html).toContain('autoComplete="one-time-code"');
    expect(html).toContain("الرمز يجب أن يتكون من 4 أرقام");
  });

  it("renders tabs with the active panel", () => {
    const html = renderToStaticMarkup(
      <Tabs
        ariaLabel="أقسام العرض"
        tabs={[
          { id: "first", label: "الأول", content: "محتوى أول" },
          { id: "second", label: "الثاني", content: "محتوى ثان" }
        ]}
      />
    );

    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain("محتوى أول");
  });

  it("renders dialog and bottom sheet with modal semantics", () => {
    const dialog = renderToStaticMarkup(
      <Dialog title="تأكيد" description="وصف مختصر" defaultOpen>
        نص داخلي
      </Dialog>
    );
    const sheet = renderToStaticMarkup(
      <BottomSheet title="خيارات" defaultOpen>
        محتوى
      </BottomSheet>
    );

    expect(dialog).toContain('role="dialog"');
    expect(dialog).toContain('aria-modal="true"');
    expect(sheet).toContain("raina-sheet");
    expect(sheet).toContain('aria-modal="true"');
  });

  it("renders toast and state components accessibly", () => {
    const toast = renderToStaticMarkup(
      <Toast variant="error" title="تعذر الحفظ" description="حاول مرة أخرى" />
    );
    const empty = renderToStaticMarkup(
      <EmptyState title="لا توجد عناصر" description="سيظهر المحتوى هنا لاحقا" />
    );
    const error = renderToStaticMarkup(
      <ErrorState title="تعذر التحميل" retryAction={<Button>إعادة المحاولة</Button>} />
    );

    expect(toast).toContain('role="alert"');
    expect(empty).toContain("aria-labelledby");
    expect(error).toContain("إعادة المحاولة");
  });
});
