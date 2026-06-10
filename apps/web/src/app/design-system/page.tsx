"use client";

import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  BottomSheet,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DropdownMenu,
  EmptyState,
  ErrorState,
  Grid,
  Inline,
  Input,
  OtpInput,
  Progress,
  Radio,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Stack,
  Switch,
  Tabs,
  Textarea,
  Toast,
  Tooltip
} from "@raina/ui";

const selectOptions = [
  { value: "first", label: "خيار أول" },
  { value: "second", label: "خيار ثان" },
  { value: "third", label: "خيار ثالث" }
];

export default function WebDesignSystemPage() {
  return (
    <main className="design-system-page">
      <Container size="lg">
        <Stack gap="32">
          <section className="design-system-hero" aria-labelledby="web-design-system-title">
            <span className="design-system-eyebrow">Raina Design System</span>
            <h1 id="web-design-system-title" className="design-system-title">
              أساس واجهة عربية RTL قابلة لإعادة الاستخدام
            </h1>
            <p className="design-system-copy">
              هذه الصفحة تعرض الرموز والمكونات العامة فقط. لا تحتوي على منطق منتج، ولا تعتمد على
              بيانات حقيقية.
            </p>
            <Inline gap="8">
              <Badge variant="primary">Mobile First</Badge>
              <Badge variant="purple">RTL</Badge>
              <Badge variant="info">Accessibility</Badge>
            </Inline>
          </section>

          <Separator />

          <section className="design-system-section" aria-labelledby="colors-title">
            <h2 id="colors-title">الألوان</h2>
            <Grid columns="4" gap="12">
              <div className="design-system-swatch design-system-swatch--primary">
                <strong>Primary</strong>
                <span>#FFCE00</span>
              </div>
              <div className="design-system-swatch design-system-swatch--charcoal">
                <strong>Charcoal</strong>
                <span>#171717</span>
              </div>
              <div className="design-system-swatch design-system-swatch--page">
                <strong>Page</strong>
                <span>#F8F8F6</span>
              </div>
              <div className="design-system-swatch design-system-swatch--muted">
                <strong>Muted</strong>
                <span>#F1F1ED</span>
              </div>
              <div className="design-system-swatch design-system-swatch--purple">
                <strong>Support</strong>
                <span>#5B3FD6</span>
              </div>
              <div className="design-system-swatch design-system-swatch--success">
                <strong>Success</strong>
                <span>#2E9D68</span>
              </div>
              <div className="design-system-swatch design-system-swatch--error">
                <strong>Error</strong>
                <span>#D94A4A</span>
              </div>
              <div className="design-system-swatch design-system-swatch--info">
                <strong>Info</strong>
                <span>#3478F6</span>
              </div>
            </Grid>
          </section>

          <section className="design-system-section" aria-labelledby="type-title">
            <h2 id="type-title">الخطوط</h2>
            <Grid columns="3" gap="16">
              <div className="design-system-type-sample">
                <span className="design-system-display">رأينا</span>
                <span className="design-system-muted">Display</span>
              </div>
              <div className="design-system-type-sample">
                <h3>عنوان رئيسي</h3>
                <span className="design-system-muted">Heading</span>
              </div>
              <div className="design-system-type-sample">
                <p className="design-system-muted">
                  نص عربي واضح ومريح للقراءة على الجوال وسطح المكتب.
                </p>
                <span className="design-system-muted">Body</span>
              </div>
            </Grid>
          </section>

          <section className="design-system-section" aria-labelledby="buttons-title">
            <h2 id="buttons-title">الأزرار</h2>
            <Inline gap="8">
              <Button>إجراء رئيسي</Button>
              <Button variant="secondary">إجراء ثانوي</Button>
              <Button variant="outline">إطار</Button>
              <Button variant="ghost">هادئ</Button>
              <Button variant="danger">إجراء خطر</Button>
              <Button variant="success">تم</Button>
              <Button variant="link">رابط</Button>
              <Button isLoading>تحميل</Button>
              <Tooltip content="زر أيقونة باسم واضح">
                <Button size="icon" variant="outline" aria-label="فتح الخيارات">
                  ⋯
                </Button>
              </Tooltip>
            </Inline>
          </section>

          <section className="design-system-section" aria-labelledby="forms-title">
            <h2 id="forms-title">النماذج</h2>
            <div className="design-system-form-grid">
              <Input
                label="اسم تجريبي"
                placeholder="اكتب الاسم"
                helperText="يظهر هذا النص كإرشاد قصير."
              />
              <Input label="رقم الجوال" kind="phone" prefix="+966" placeholder="5XXXXXXXX" />
              <Input label="بحث" kind="search" placeholder="ابحث عن عنصر" suffix="⌕" />
              <Input label="حقل بخطأ" errorText="هذا الحقل مطلوب" />
              <OtpInput errorText="الرمز يجب أن يتكون من 4 أرقام" />
              <Select
                label="قائمة اختيار"
                placeholder="اختر قيمة"
                options={selectOptions}
                defaultValue=""
              />
              <Textarea
                label="وصف قصير"
                maxCount={140}
                defaultValue="نص قصير لاختبار المساحة والقراءة."
              />
              <Stack gap="8">
                <Checkbox label="خيار قابل للتحديد" description="الوصف ليس بديلا عن التسمية." />
                <Radio name="web-demo-radio" label="اختيار أول" defaultChecked />
                <Radio name="web-demo-radio" label="اختيار ثان" />
                <Switch label="تفعيل إعداد" description="يوضح الحالة بصريا وبالنص." />
              </Stack>
            </div>
          </section>

          <section className="design-system-section" aria-labelledby="surface-title">
            <h2 id="surface-title">البطاقات والعلامات</h2>
            <Grid columns="3" gap="16">
              <Card
                title="بطاقة أساسية"
                description="مكون عام بدون دلالة منتج."
                footer={<Button variant="outline">إجراء</Button>}
              >
                <Inline gap="8">
                  <Badge>محايد</Badge>
                  <Badge variant="success">ناجح</Badge>
                  <Badge variant="warning">تنبيه</Badge>
                  <Badge variant="error">خطأ</Badge>
                </Inline>
              </Card>
              <Card title="شرائح" variant="outlined">
                <Inline gap="8">
                  <Chip selected>مختار</Chip>
                  <Chip removable>قابل للإزالة</Chip>
                  <Chip disabled>معطل</Chip>
                </Inline>
              </Card>
              <Card title="الصورة الرمزية" variant="elevated">
                <Inline gap="12">
                  <Avatar name="اسم المستخدم" size="sm" />
                  <Avatar name="اسم المستخدم" status="online" />
                  <Avatar name="اسم المستخدم" size="lg" />
                </Inline>
              </Card>
            </Grid>
          </section>

          <section className="design-system-section" aria-labelledby="navigation-title">
            <h2 id="navigation-title">التنقل داخل المكونات</h2>
            <Grid columns="2" gap="16">
              <Tabs
                ariaLabel="تبويبات عامة"
                tabs={[
                  { id: "one", label: "الأول", content: <p>محتوى عام للتبويب الأول.</p> },
                  { id: "two", label: "الثاني", content: <p>محتوى عام للتبويب الثاني.</p> },
                  { id: "three", label: "معطل", content: <p>غير ظاهر.</p>, disabled: true }
                ]}
              />
              <Accordion
                items={[
                  { id: "a", title: "عنصر قابل للفتح", content: "محتوى مختصر داخل المكون." },
                  { id: "b", title: "عنصر آخر", content: "يدعم القراءة بلوحة المفاتيح." }
                ]}
              />
            </Grid>
          </section>

          <section className="design-system-section" aria-labelledby="layers-title">
            <h2 id="layers-title">الطبقات والتنبيهات</h2>
            <Inline gap="8">
              <Dialog
                triggerLabel="افتح Dialog"
                title="تأكيد عام"
                description="مثال على نافذة حوار بدون منطق أعمال."
                footer={
                  <>
                    <Button variant="ghost">إلغاء</Button>
                    <Button>تأكيد</Button>
                  </>
                }
              >
                <p>المحتوى هنا عام ومخصص لاختبار التركيز والإغلاق.</p>
              </Dialog>
              <BottomSheet
                triggerLabel="افتح Sheet"
                title="لوحة سفلية"
                description="مناسبة للجوال وتدعم safe area."
                footer={<Button>إجراء</Button>}
              >
                <p>هذا مثال عام للوحة سفلية.</p>
              </BottomSheet>
              <DropdownMenu
                label="قائمة"
                items={[
                  { id: "copy", label: "نسخ الرابط", description: "مثال داخل قائمة الإجراءات" },
                  { id: "report", label: "إبلاغ", tone: "danger" }
                ]}
              />
            </Inline>
            <Grid columns="2" gap="16">
              <Toast
                variant="success"
                title="تم الحفظ"
                description="تنبيه عام قابل للاستخدام لاحقا."
              />
              <Alert variant="warning" title="تنبيه" description="رسالة داخلية تظهر ضمن الصفحة." />
            </Grid>
          </section>

          <section className="design-system-section" aria-labelledby="states-title">
            <h2 id="states-title">الحالات والتحميل</h2>
            <Grid columns="3" gap="16">
              <Card title="Skeleton">
                <Stack gap="12">
                  <Skeleton variant="text" />
                  <Skeleton variant="image" />
                  <Skeleton variant="avatar" />
                </Stack>
              </Card>
              <EmptyState
                title="لا توجد عناصر"
                description="صياغة عامة لحالة فارغة."
                icon="✓"
                primaryAction={<Button>إجراء</Button>}
              />
              <ErrorState
                title="تعذر التحميل"
                description="رسالة خطأ عامة."
                retryAction={<Button variant="outline">إعادة المحاولة</Button>}
              />
            </Grid>
            <Inline gap="16">
              <Spinner label="تحميل المحتوى" />
              <Progress value={64} label="تقدم العملية" />
            </Inline>
          </section>

          <section className="design-system-section" aria-labelledby="layout-title">
            <h2 id="layout-title">Layout Primitives</h2>
            <Card title="Stack / Inline / Grid">
              <Stack gap="16">
                <Inline gap="8">
                  <Badge variant="primary">Inline</Badge>
                  <Badge>Wrap</Badge>
                  <Badge variant="purple">RTL</Badge>
                </Inline>
                <Grid columns="3" gap="12">
                  <Card title="عمود 1">محتوى عام</Card>
                  <Card title="عمود 2">محتوى عام</Card>
                  <Card title="عمود 3">محتوى عام</Card>
                </Grid>
              </Stack>
            </Card>
          </section>
        </Stack>
      </Container>
    </main>
  );
}
