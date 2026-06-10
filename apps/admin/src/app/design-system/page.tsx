"use client";

import {
  Alert,
  AppShell,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Container,
  DataTable,
  Dialog,
  DropdownMenu,
  EmptyState,
  Grid,
  Inline,
  Input,
  Pagination,
  Select,
  Separator,
  Stack,
  StatCard,
  Switch,
  Tabs,
  Textarea
} from "@raina/ui";

const options = [
  { value: "draft", label: "مسودة" },
  { value: "active", label: "نشط" },
  { value: "paused", label: "متوقف" }
];

const columns = [
  { id: "name", header: "الاسم" },
  { id: "status", header: "الحالة" },
  { id: "date", header: "التاريخ" }
];

const rows = [
  {
    id: "row-1",
    cells: {
      name: "عنصر إداري أول",
      status: <Badge variant="success">نشط</Badge>,
      date: "2026-06-10"
    },
    actions: (
      <DropdownMenu
        label="إجراءات"
        items={[
          { id: "view", label: "عرض مختصر" },
          { id: "flag", label: "مراجعة", tone: "danger" }
        ]}
      />
    )
  },
  {
    id: "row-2",
    cells: {
      name: "عنصر إداري ثان",
      status: <Badge variant="warning">قيد المراجعة</Badge>,
      date: "2026-06-11"
    },
    actions: <Button variant="outline">فتح</Button>
  }
];

export default function AdminDesignSystemPage() {
  return (
    <main className="design-system-page">
      <Container size="lg">
        <Stack gap="32">
          <section className="design-system-hero" aria-labelledby="admin-design-system-title">
            <span className="design-system-eyebrow">Raina Admin Design System</span>
            <h1 id="admin-design-system-title" className="design-system-title">
              أساس واجهات الإدارة دون بناء لوحة فعلية
            </h1>
            <p className="design-system-copy">
              هذه الصفحة تختبر المكونات المشتركة مع أمثلة إدارية عامة، ولا تعرض بيانات حقيقية أو
              وظائف إدارة.
            </p>
            <Breadcrumb items={[{ label: "النظام" }, { label: "المكونات" }, { label: "العرض" }]} />
          </section>

          <Separator />

          <section className="design-system-section" aria-labelledby="admin-stats-title">
            <h2 id="admin-stats-title">مؤشرات عامة</h2>
            <Grid columns="4" gap="16">
              <StatCard label="عنصر عام" value="128" hint="قيمة تجريبية" icon="•" trend="+8%" />
              <StatCard label="مراجعات" value="24" hint="للعرض فقط" icon="!" />
              <StatCard label="مكتمل" value="91%" hint="حالة عامة" icon="✓" />
              <StatCard label="تنبيهات" value="3" hint="بدون ربط فعلي" icon="i" />
            </Grid>
          </section>

          <section className="design-system-section" aria-labelledby="admin-shell-title">
            <h2 id="admin-shell-title">AppShell إداري</h2>
            <AppShell
              header={
                <Inline justify="between" gap="12">
                  <strong>ترويسة عامة</strong>
                  <Button size="sm">إجراء</Button>
                </Inline>
              }
              sidebar={
                <Stack gap="8">
                  <Button variant="ghost">قسم أول</Button>
                  <Button variant="ghost">قسم ثان</Button>
                  <Button variant="ghost">قسم ثالث</Button>
                </Stack>
              }
              footer={<span className="design-system-muted">تذييل عام لا يحتوي على وظائف.</span>}
            >
              <Card
                title="منطقة المحتوى"
                description="هذا Shell عام مع slot للترويسة والقائمة والمحتوى."
              />
            </AppShell>
          </section>

          <section className="design-system-section" aria-labelledby="admin-table-title">
            <h2 id="admin-table-title">DataTable وPagination</h2>
            <DataTable columns={columns} rows={rows} caption="جدول إداري تجريبي" />
            <Pagination page={2} totalPages={5} />
          </section>

          <section className="design-system-section" aria-labelledby="admin-forms-title">
            <h2 id="admin-forms-title">نماذج إدارية عامة</h2>
            <div className="design-system-form-grid">
              <Input label="عنوان عام" placeholder="اكتب عنوانا" />
              <Select label="الحالة" options={options} defaultValue="active" />
              <Textarea
                label="ملاحظة داخلية"
                defaultValue="نص عام لا يرتبط ببيانات فعلية."
                maxCount={160}
              />
              <Stack gap="8">
                <Checkbox label="إظهار تنبيه" description="خيار تجريبي فقط." />
                <Switch label="تفعيل حالة عامة" />
              </Stack>
            </div>
          </section>

          <section className="design-system-section" aria-labelledby="admin-feedback-title">
            <h2 id="admin-feedback-title">الحوار والحالات</h2>
            <Inline gap="8">
              <Dialog
                triggerLabel="تأكيد إداري"
                title="تأكيد إجراء"
                description="مثال عام على Dialog تأكيدي."
                destructive
                footer={
                  <>
                    <Button variant="ghost">إلغاء</Button>
                    <Button variant="danger">تأكيد</Button>
                  </>
                }
              >
                <p>لا يرتبط هذا المثال بأي عملية حقيقية.</p>
              </Dialog>
              <Alert variant="info" title="معلومة" description="تنبيه داخلي عام للاختبار." />
            </Inline>
            <Grid columns="2" gap="16">
              <Tabs
                ariaLabel="تبويبات إدارية"
                tabs={[
                  { id: "summary", label: "ملخص", content: <p>محتوى إداري عام.</p> },
                  {
                    id: "settings",
                    label: "إعدادات",
                    content: <p>إعدادات عرض غير متصلة ببيانات.</p>
                  }
                ]}
              />
              <EmptyState
                title="لا توجد صفوف"
                description="حالة فارغة للجدول أو القائمة."
                primaryAction={<Button>إجراء عام</Button>}
              />
            </Grid>
          </section>
        </Stack>
      </Container>
    </main>
  );
}
