import { categories, demoOtp, demoPhone, posts, products, users } from "./data.js";
import { loadState, resetState, saveState } from "./state.js";
import type { AppState, CommentItem, DraftPost, Post, Product, SavedList } from "./types.js";

type SheetState =
  | { kind: "auth"; path: string }
  | { kind: "addToList"; productId: string }
  | { kind: "report"; target: string; title: string }
  | { kind: "filters" }
  | { kind: "sort" };

interface UiState {
  toast: string;
  sheet: SheetState | null;
  formError: string;
  savedView: "products" | "posts" | "lists";
}

interface RouteResult {
  title: string;
  body: string;
  active?: string;
  bare?: boolean;
  subtitle?: string;
  showBack?: boolean;
}

const appRoot = document.querySelector<HTMLElement>("#app");
if (!appRoot) throw new Error("App root is missing");
const app = appRoot;

let state: AppState = loadState();
let ui: UiState = {
  toast: "",
  sheet: null,
  formError: "",
  savedView: "products"
};

const iconPaths = {
  home: '<path d="M3 10.8 12 4l9 6.8v8.7a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 0 1 3 19.5z" />',
  search: '<circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />',
  plus: '<path d="M12 5v14M5 12h14" />',
  bookmark: '<path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.4L6 21z" />',
  user: '<path d="M19 21a7 7 0 0 0-14 0" /><circle cx="12" cy="7" r="4" />',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" />',
  settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.06.06a2.1 2.1 0 0 1-2.97 2.97l-.06-.06a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.66V21a2.1 2.1 0 0 1-4.2 0v-.1a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-2 .36l-.06.06a2.1 2.1 0 0 1-2.97-2.97l.06-.06a1.8 1.8 0 0 0 .36-2A1.8 1.8 0 0 0 2.1 13H2a2.1 2.1 0 0 1 0-4.2h.1a1.8 1.8 0 0 0 1.66-1.1 1.8 1.8 0 0 0-.36-2l-.06-.06a2.1 2.1 0 0 1 2.97-2.97l.06.06a1.8 1.8 0 0 0 2 .36A1.8 1.8 0 0 0 9.5 1.4V1a2.1 2.1 0 0 1 4.2 0v.1a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 2-.36l.06-.06a2.1 2.1 0 0 1 2.97 2.97l-.06.06a1.8 1.8 0 0 0-.36 2A1.8 1.8 0 0 0 21.1 8H22a2.1 2.1 0 0 1 0 4.2h-.9a1.8 1.8 0 0 0-1.7 1.1Z" />',
  arrow: '<path d="M15 18 9 12l6-6" />',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z" />',
  message: '<path d="M21 12a8 8 0 0 1-8 8H6l-3 2 .9-4A8 8 0 1 1 21 12Z" />',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />',
  scale: '<path d="M12 3v18" /><path d="M5 7h14" /><path d="m6 7-3 7h6z" /><path d="m18 7-3 7h6z" />',
  flag: '<path d="M5 21V4" /><path d="M5 4h12l-1.5 4L17 12H5" />',
  check: '<path d="m20 6-11 11-5-5" />',
  close: '<path d="M18 6 6 18M6 6l12 12" />',
  filter: '<path d="M4 6h16M7 12h10M10 18h4" />',
  share: '<circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.8 6.8-4.6M8.6 13.2l6.8 4.6" />',
  edit: '<path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />',
  trash: '<path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 15h10l1-15" />'
} as const;

type IconName = keyof typeof iconPaths;

function icon(name: IconName, tiny = false): string {
  return `<svg class="icon${tiny ? " tiny-icon" : ""}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]}</svg>`;
}

function html(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function memberActive(): boolean {
  return state.session.mode === "member";
}

function runningFromFile(): boolean {
  return window.location.protocol === "file:";
}

function assetPath(path: string): string {
  return runningFromFile() ? `./${path}` : `/${path}`;
}

function currentPath(): string {
  if (runningFromFile()) {
    const hashPath = window.location.hash.slice(1);
    return normalizePath((hashPath || "/").split("?")[0] ?? "/");
  }
  return normalizePath(window.location.pathname);
}

function routeParams(): URLSearchParams {
  if (runningFromFile()) {
    const hashPath = window.location.hash.slice(1);
    return new URLSearchParams(hashPath.split("?")[1] ?? "");
  }
  return new URLSearchParams(window.location.search);
}

function shareUrl(path: string): string {
  if (runningFromFile()) {
    return `${window.location.href.split("#")[0]}#${path}`;
  }
  return `${window.location.origin}${path}`;
}

function normalizePath(path: string): string {
  if (!path || path === "/index.html") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function navigate(path: string): void {
  ui.formError = "";
  ui.sheet = null;
  if (runningFromFile()) {
    window.history.pushState({}, "", `${window.location.pathname}#${path}`);
  } else {
    window.history.pushState({}, "", path);
  }
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function persist(nextState = state): void {
  state = nextState;
  saveState(state);
}

function toast(message: string): void {
  ui.toast = message;
  render();
  window.setTimeout(() => {
    if (ui.toast === message) {
      ui.toast = "";
      render();
    }
  }, 2400);
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function productById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

function productBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

function categoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

function userByUsername(username: string) {
  return users.find((user) => user.username === username);
}

function allPosts(): Post[] {
  return [...state.publishedPosts, ...posts];
}

function postById(id: string): Post | undefined {
  return allPosts().find((post) => post.id === id);
}

function commentsForPost(post: Post): CommentItem[] {
  return state.commentsByPostId[post.id] ?? post.comments;
}

function commentsForProduct(productId: string): CommentItem[] {
  return state.commentsByProductId[productId] ?? [];
}

function isProtected(path: string): boolean {
  return (
    path === "/create" ||
    path === "/drafts" ||
    path === "/following" ||
    path === "/notifications" ||
    path === "/profile" ||
    path === "/profile/edit" ||
    path.startsWith("/saved") ||
    path.startsWith("/settings")
  );
}

function requireMember(path = currentPath()): boolean {
  if (memberActive()) return true;
  state.session.intendedPath = path;
  persist();
  ui.sheet = { kind: "auth", path };
  render();
  return false;
}

function render(): void {
  const path = currentPath();
  const route = buildRoute(path);
  const shell = route.bare ? route.body : renderShell(route);
  app.innerHTML = `
    <div class="viewport">
      ${route.bare ? "" : renderDesktopRail(route.active ?? "")}
      <div class="app-shell">${shell}</div>
    </div>
    ${ui.toast ? `<div class="toast">${icon("check", true)}<span>${html(ui.toast)}</span></div>` : ""}
    ${ui.sheet ? renderSheet(ui.sheet) : ""}
  `;
}

function buildRoute(path: string): RouteResult {
  if (path === "/" || path === "/splash") {
    return { title: "رأينا", body: renderSplash(), bare: true };
  }

  if (path === "/onboarding") {
    return { title: "البداية", body: renderOnboarding(), bare: true };
  }

  if (path === "/login") {
    return { title: "تسجيل الدخول", body: renderLogin(), bare: true };
  }

  if (path === "/verify-otp") {
    return { title: "رمز التحقق", body: renderOtp(), bare: true };
  }

  if (isProtected(path) && !memberActive()) {
    return {
      title: "تسجيل الدخول مطلوب",
      subtitle: "يمكنك الرجوع لنفس المسار بعد التحقق",
      body: renderAuthRequired(path),
      active: activeFromPath(path),
      showBack: true
    };
  }

  if (path === "/home") return { title: "الرئيسية", subtitle: "اكتشاف وتجارب من المجتمع", body: renderHome(), active: "home" };
  if (path === "/search") return { title: "البحث", subtitle: "منتجات وتجارب قابلة للفلترة", body: renderSearch(), active: "search" };
  if (path === "/categories") return { title: "التصنيفات", subtitle: "ابدأ من المجال الأقرب لك", body: renderCategories(), active: "search" };
  if (path.startsWith("/category/")) return renderCategoryRoute(path);
  if (path.startsWith("/product/")) return renderProductRoute(path);
  if (path.startsWith("/post/")) return renderPostRoute(path);
  if (path === "/create") return { title: "إنشاء تجربة", subtitle: "اكتب تجربة قابلة للحفظ أو النشر", body: renderCreate(), active: "create" };
  if (path === "/drafts") return { title: "المسودات", subtitle: "تجارب محفوظة محليا", body: renderDrafts(), active: "create", showBack: true };
  if (path === "/compare") return { title: "المقارنة", subtitle: "اختيار أوضح قبل القرار", body: renderCompare(), active: "compare" };
  if (path === "/saved") return { title: "المحفوظات", subtitle: "منتجات ومنشورات وقوائم", body: renderSaved(), active: "saved" };
  if (path === "/saved/lists") return { title: "القوائم", subtitle: "نظم المنتجات والمنشورات", body: renderLists(), active: "saved", showBack: true };
  if (path.startsWith("/saved/lists/")) return renderListRoute(path);
  if (path === "/following") return { title: "المتابعة", subtitle: "حسابات وتجارب جديدة", body: renderFollowing(), active: "profile" };
  if (path === "/notifications") return { title: "الإشعارات", subtitle: "تعليقات وتنبيهات العرض", body: renderNotifications(), active: "profile" };
  if (path === "/profile") return { title: "ملفي", subtitle: state.profile.username, body: renderProfile(), active: "profile" };
  if (path === "/profile/edit") return { title: "تعديل الملف", subtitle: "بيانات محفوظة محليا", body: renderEditProfile(), active: "profile", showBack: true };
  if (path.startsWith("/profile/")) return renderPublicProfileRoute(path);
  if (path === "/settings") return { title: "الإعدادات", subtitle: "تحكم بتجربة العرض", body: renderSettings(), active: "profile" };
  if (path === "/settings/privacy") return { title: "الخصوصية", subtitle: "إعدادات الحساب التجريبية", body: renderPrivacySettings(), active: "profile", showBack: true };
  if (path === "/settings/notifications") return { title: "إعدادات الإشعارات", subtitle: "تنبيهات محلية للعرض", body: renderNotificationSettings(), active: "profile", showBack: true };
  if (path === "/help") return { title: "المساعدة", subtitle: "إرشادات مختصرة للتجربة", body: renderHelp(), active: "profile", showBack: true };
  if (path === "/terms") return { title: "الشروط", subtitle: "نص تجريبي للعرض", body: renderTerms(), active: "profile", showBack: true };
  if (path === "/privacy") return { title: "الخصوصية", subtitle: "نص تجريبي للعرض", body: renderPrivacy(), active: "profile", showBack: true };

  return { title: "لم نجد الصفحة", body: renderMissing(), active: "home", showBack: true };
}

function renderShell(route: RouteResult): string {
  return `
    ${renderHeader(route)}
    <section class="screen">${route.body}</section>
    ${renderBottomNav(route.active ?? "")}
  `;
}

function renderHeader(route: RouteResult): string {
  return `
    <header class="app-header">
      ${
        route.showBack
          ? `<button class="icon-button" data-action="back" aria-label="رجوع">${icon("arrow")}</button>`
          : `<img class="header-logo" src="${assetPath("raina_logo.svg")}" alt="شعار رأينا Raina" />`
      }
      <div class="header-title">
        <h1>${html(route.title)}</h1>
        ${route.subtitle ? `<p>${html(route.subtitle)}</p>` : ""}
      </div>
      <button class="icon-button" data-action="nav" data-path="/notifications" aria-label="الإشعارات">${icon("bell")}</button>
    </header>
  `;
}

function renderDesktopRail(active: string): string {
  const links = [
    ["home", "/home", "الرئيسية", "home"],
    ["search", "/search", "البحث", "search"],
    ["create", "/create", "إنشاء", "plus"],
    ["compare", "/compare", "المقارنة", "scale"],
    ["saved", "/saved", "الحفظ", "bookmark"],
    ["profile", "/profile", "حسابي", "user"]
  ] as const;

  return `
    <aside class="desktop-rail" aria-label="تنقل سطح المكتب">
      <img class="brand-logo" src="${assetPath("raina_logo.svg")}" alt="شعار رأينا Raina" />
      <div class="grid">
        ${links
          .map(
            ([key, path, label, iconName]) => `
              <button class="desktop-link${active === key ? " active" : ""}" data-action="nav" data-path="${path}">
                ${icon(iconName)}<span>${label}</span>
              </button>
            `
          )
          .join("")}
      </div>
    </aside>
  `;
}

function renderBottomNav(active: string): string {
  const items = [
    ["home", "/home", "الرئيسية", "home"],
    ["search", "/search", "بحث", "search"],
    ["create", "/create", "إنشاء", "plus"],
    ["saved", "/saved", "الحفظ", "bookmark"],
    ["profile", "/profile", "حسابي", "user"]
  ] as const;

  return `
    <nav class="bottom-nav" aria-label="التنقل الرئيسي">
      ${items
        .map(
          ([key, path, label, iconName]) => `
            <button class="nav-item${active === key ? " active" : ""}" data-action="nav" data-path="${path}" aria-label="${label}">
              ${icon(iconName)}<span>${label}</span>
            </button>
          `
        )
        .join("")}
    </nav>
  `;
}

function activeFromPath(path: string): string {
  if (path.startsWith("/search") || path.startsWith("/category") || path.startsWith("/product")) return "search";
  if (path.startsWith("/create") || path.startsWith("/drafts")) return "create";
  if (path.startsWith("/saved")) return "saved";
  if (path.startsWith("/profile") || path.startsWith("/settings") || path.startsWith("/notifications")) return "profile";
  if (path.startsWith("/compare")) return "compare";
  return "home";
}

function renderSplash(): string {
  return `
    <section class="center-screen">
      <div class="brand-stack">
        <img class="brand-logo" src="${assetPath("raina_logo.svg")}" alt="شعار رأينا Raina" />
        <p class="brand-subtitle">مجتمع عربي لاكتشاف المنتجات وقراءة التجارب ومقارنة الخيارات قبل قرار الشراء.</p>
      </div>
      <div class="hero-panel">
        <div class="skeleton" aria-label="تحميل تجريبي">
          <span style="width: 78%"></span>
          <span style="width: 100%"></span>
          <span style="width: 62%"></span>
        </div>
        <button class="primary-button" data-action="nav" data-path="/onboarding">${icon("arrow", true)} متابعة</button>
      </div>
    </section>
  `;
}

function renderOnboarding(): string {
  const slides = [
    ["اكتشف المنتجات", "تصفح تصنيفات وتجارب عربية مرتبطة بالسوق السعودي والخليجي."],
    ["اقرأ قبل القرار", "شاهد تقييمات من 10، مميزات، ملاحظات، وتعليقات من المجتمع."],
    ["قارن واحفظ", "ضع المنتجات في مقارنة واضحة ونظم ما يهمك داخل قوائم."]
  ];

  return `
    <section class="center-screen">
      <div class="brand-stack">
        <img class="brand-logo" src="${assetPath("raina_logo.svg")}" alt="شعار رأينا Raina" />
        <h1 class="brand-title">مرحباً بك في رأينا</h1>
        <p class="brand-subtitle">تجربة عربية بالكامل، تعمل محليا ببيانات تجريبية قابلة للحفظ بعد التحديث.</p>
      </div>
      <div class="grid">
        ${slides
          .map(
            ([title, body], index) => `
              <article class="panel">
                <div class="split">
                  <strong>${html(title)}</strong>
                  <span class="rating-badge">${index + 1}</span>
                </div>
                <p class="body-copy">${html(body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="grid">
        <button class="primary-button" data-action="start-member">ابدأ الآن</button>
        <button class="secondary-button" data-action="continue-visitor">تصفح كزائر</button>
      </div>
    </section>
  `;
}

function renderLogin(): string {
  return `
    <section class="center-screen">
      <div class="brand-stack">
        <img class="brand-logo" src="${assetPath("raina_logo.svg")}" alt="شعار رأينا Raina" />
        <h1 class="brand-title">تسجيل الدخول</h1>
        <p class="brand-subtitle">أدخل رقم الجوال السعودي للانتقال إلى رمز التحقق التجريبي.</p>
      </div>
      <form class="panel" data-form="login">
        <div class="field">
          <label for="phone">رقم الجوال</label>
          <input id="phone" name="phone" inputmode="numeric" autocomplete="tel" value="${demoPhone}" aria-describedby="phone-help" />
          <span id="phone-help" class="caption">رقم العرض: ${demoPhone}</span>
        </div>
        ${ui.formError ? `<p class="error-text">${html(ui.formError)}</p>` : ""}
        <button class="primary-button" type="submit">إرسال الرمز</button>
      </form>
      <button class="text-button" data-action="continue-visitor">المتابعة كزائر</button>
    </section>
  `;
}

function renderOtp(): string {
  return `
    <section class="center-screen">
      <div class="brand-stack">
        <div class="brand-mark" aria-hidden="true">1234</div>
        <h1 class="brand-title">رمز التحقق</h1>
        <p class="brand-subtitle">استخدم الرمز التجريبي الثابت لإكمال الدخول.</p>
      </div>
      <form class="panel" data-form="otp">
        <div class="field">
          <label for="otp">OTP</label>
          <input id="otp" name="otp" inputmode="numeric" maxlength="4" value="${demoOtp}" aria-describedby="otp-help" />
          <span id="otp-help" class="caption">الرمز التجريبي: ${demoOtp}</span>
        </div>
        ${ui.formError ? `<p class="error-text">${html(ui.formError)}</p>` : ""}
        <button class="primary-button" type="submit">تحقق وادخل</button>
      </form>
      <button class="text-button" data-action="nav" data-path="/login">تغيير الرقم</button>
    </section>
  `;
}

function renderHome(): string {
  const featuredProducts = products.slice(0, 4);
  const feed = allPosts().slice(0, 3);

  return `
    ${renderDemoNotice()}
    <button class="search-bar" data-action="nav" data-path="/search" aria-label="افتح البحث">
      ${icon("search")}
      <span class="muted">ابحث عن منتج أو تجربة أو تصنيف</span>
    </button>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">تصنيفات نشطة</h2>
        <button class="text-button" data-action="nav" data-path="/categories">الكل</button>
      </div>
      <div class="scroll-row">
        ${categories.map(renderCategoryChip).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">منتجات مقترحة</h2>
        <button class="text-button" data-action="nav" data-path="/compare">المقارنة</button>
      </div>
      <div class="grid">
        ${featuredProducts.map((product) => renderProductCard(product, "full")).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">تجارب من المجتمع</h2>
        <button class="text-button" data-action="nav" data-path="/following">المتابعة</button>
      </div>
      <div class="grid">
        ${feed.map(renderPostCard).join("")}
      </div>
    </section>
  `;
}

function renderDemoNotice(): string {
  return `
    <div class="notice">
      ${icon("check")}
      <p class="body-copy">وضع العرض يعمل محليا. الحفظ، التعليقات، المسودات، الإعدادات، والمقارنة تبقى بعد تحديث الصفحة.</p>
    </div>
  `;
}

function renderSearch(): string {
  const params = routeParams();
  const query = params.get("q")?.trim() ?? "";
  const category = params.get("category") ?? "all";
  const sort = params.get("sort") ?? "rating";
  const filtered = products
    .filter((product) => category === "all" || product.categorySlug === category)
    .filter((product) => {
      if (!query) return true;
      const text = `${product.name} ${product.brand} ${product.summary} ${product.tags.join(" ")}`;
      return text.toLocaleLowerCase("ar").includes(query.toLocaleLowerCase("ar"));
    })
    .sort((a, b) => (sort === "price" ? a.priceRange.localeCompare(b.priceRange, "ar") : b.rating - a.rating));

  return `
    <form class="search-bar" data-form="search">
      ${icon("search")}
      <input name="q" value="${html(query)}" placeholder="مثال: CeraVe أو مرطب" aria-label="بحث" />
      <button class="icon-button" type="submit" aria-label="تنفيذ البحث">${icon("check")}</button>
    </form>
    <div class="tag-row section">
      <button class="chip${category === "all" ? " active" : ""}" data-action="set-search-category" data-category="all">الكل</button>
      ${categories
        .map(
          (item) => `<button class="chip${category === item.slug ? " active" : ""}" data-action="set-search-category" data-category="${item.slug}">${html(item.name)}</button>`
        )
        .join("")}
    </div>
    <div class="button-row section">
      <button class="secondary-button" data-action="open-sheet" data-sheet="filters">${icon("filter", true)} فلاتر</button>
      <button class="primary-button" data-action="open-sheet" data-sheet="sort">ترتيب: ${sort === "price" ? "السعر" : "التقييم"}</button>
    </div>
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">${filtered.length} منتجات</h2>
        <span class="caption">بدون شراء أو سلة</span>
      </div>
      <div class="grid">
        ${
          filtered.length
            ? filtered.map((product) => renderProductCard(product, "compact")).join("")
            : renderEmpty("لا توجد نتائج", "جرب كلمة بحث مختلفة أو أزل الفلاتر.")
        }
      </div>
    </section>
  `;
}

function renderCategories(): string {
  return `
    <div class="grid">
      ${categories
        .map(
          (category) => `
            <button class="category-chip tone-${category.tone}" data-action="nav" data-path="/category/${category.slug}">
              <strong>${html(category.name)}</strong>
              <span>${html(category.description)}</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderCategoryRoute(path: string): RouteResult {
  const slug = path.split("/")[2] ?? "";
  const category = categoryBySlug(slug);
  if (!category) return { title: "تصنيف غير موجود", body: renderMissing(), active: "search", showBack: true };
  const list = products.filter((product) => product.categorySlug === category.slug);
  return {
    title: category.name,
    subtitle: category.description,
    active: "search",
    showBack: true,
    body: `
      <div class="grid">
        ${list.map((product) => renderProductCard(product, "compact")).join("")}
      </div>
    `
  };
}

function renderProductRoute(path: string): RouteResult {
  const slug = path.split("/")[2] ?? "";
  const product = productBySlug(slug);
  if (!product) return { title: "منتج غير موجود", body: renderMissing(), active: "search", showBack: true };
  return {
    title: product.name,
    subtitle: product.brand,
    active: "search",
    showBack: true,
    body: renderProductDetail(product)
  };
}

function renderProductDetail(product: Product): string {
  const relatedPosts = allPosts().filter((post) => post.productId === product.id);
  const productComments = commentsForProduct(product.id);
  return `
    <article class="grid">
      ${renderProductVisual(product)}
      <div class="panel">
        <div class="split">
          <div>
            <p class="caption">${html(product.brand)}</p>
            <h2 class="product-name">${html(product.name)}</h2>
          </div>
          ${renderRating(product.rating)}
        </div>
        <p class="product-summary">${html(product.summary)}</p>
        <div class="tag-row">${product.tags.map((tag) => `<span class="tag">${html(tag)}</span>`).join("")}</div>
      </div>
      <div class="button-row">
        ${renderSaveProductButton(product.id)}
        ${renderCompareButton(product.id)}
      </div>
      <div class="button-row">
        <button class="secondary-button" data-action="open-add-list" data-product-id="${product.id}">${icon("bookmark", true)} إضافة لقائمة</button>
        <button class="danger-button" data-action="report" data-target="product:${product.id}" data-title="${html(product.name)}">${icon("flag", true)} إبلاغ</button>
      </div>

      <section class="panel">
        <div class="section-header">
          <h2 class="section-title">ملخص التقييم</h2>
          <span class="caption">${product.ratingCount} تقييم</span>
        </div>
        <div class="distribution">
          ${product.distribution
            .map(
              (item) => `
                <div class="bar-row">
                  <span>${html(item.label)}</span>
                  <div class="bar"><span style="width: ${item.value}%"></span></div>
                  <strong>${item.value}</strong>
                </div>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="panel">
        <h2 class="section-title">تفاصيل مفيدة</h2>
        <div class="grid">
          ${Object.entries(product.specs)
            .map(([key, value]) => `<div class="split"><strong>${html(key)}</strong><span class="muted">${html(value)}</span></div>`)
            .join("")}
          <div class="split"><strong>نطاق السعر</strong><span class="muted">${html(product.priceRange)}</span></div>
        </div>
      </section>

      <section class="panel">
        <h2 class="section-title">يناسب</h2>
        <div class="tag-row">${product.suitableFor.map((item) => `<span class="tag">${html(item)}</span>`).join("")}</div>
        <h2 class="section-title section">ملاحظات قبل الاستخدام</h2>
        <div class="tag-row">${product.cautions.map((item) => `<span class="tag">${html(item)}</span>`).join("")}</div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-title">تجارب مرتبطة</h2>
          <button class="text-button" data-action="nav" data-path="/create">اكتب تجربة</button>
        </div>
        <div class="grid">
          ${relatedPosts.length ? relatedPosts.map(renderPostCard).join("") : renderEmpty("لا توجد تجارب بعد", "كن أول من يكتب تجربة لهذا المنتج.")}
        </div>
      </section>

      <section class="panel">
        <div class="section-header">
          <h2 class="section-title">تعليقات المنتج</h2>
          <span class="caption">${productComments.length}</span>
        </div>
        ${renderComments(productComments)}
        <form class="field" data-form="product-comment" data-product-id="${product.id}">
          <label for="product-comment">أضف تعليقاً</label>
          <textarea id="product-comment" name="body" placeholder="اكتب سؤالا أو ملاحظة عن المنتج"></textarea>
          <button class="primary-button" type="submit">${icon("message", true)} نشر التعليق</button>
        </form>
      </section>
    </article>
  `;
}

function renderPostRoute(path: string): RouteResult {
  const id = path.split("/")[2] ?? "";
  const post = postById(id);
  if (!post) return { title: "منشور غير موجود", body: renderMissing(), active: "home", showBack: true };
  const product = productById(post.productId);
  return {
    title: post.title,
    subtitle: product?.name ?? "تجربة مستخدم",
    active: "home",
    showBack: true,
    body: renderPostDetail(post)
  };
}

function renderPostDetail(post: Post): string {
  const product = productById(post.productId);
  const author = userByUsername(post.author) ?? users[0];
  const comments = commentsForPost(post);
  return `
    <article class="grid">
      <div class="post-card">
        ${renderUserLine(author.username)}
        <div class="split">
          <h2 class="post-title">${html(post.title)}</h2>
          ${renderRating(post.rating)}
        </div>
        <p class="post-body">${html(post.body)}</p>
        <div class="tag-row">${post.tags.map((tag) => `<span class="tag">${html(tag)}</span>`).join("")}</div>
        ${product ? `<button class="chip" data-action="nav" data-path="/product/${product.slug}">المنتج: ${html(product.name)}</button>` : ""}
        <div class="button-row">
          ${renderSavePostButton(post.id)}
          <button class="secondary-button" data-action="follow-user" data-username="${author.username}">${icon("users", true)} ${state.followingUsernames.includes(author.username) ? "إلغاء المتابعة" : "متابعة"}</button>
        </div>
        <div class="button-row">
          <button class="primary-button" data-action="share" data-path="/post/${post.id}">${icon("share", true)} مشاركة</button>
          <button class="danger-button" data-action="report" data-target="post:${post.id}" data-title="${html(post.title)}">${icon("flag", true)} إبلاغ</button>
        </div>
      </div>
      <section class="panel">
        <div class="section-header">
          <h2 class="section-title">التعليقات والردود</h2>
          <span class="caption">${comments.length}</span>
        </div>
        ${renderComments(comments)}
        <form class="field" data-form="post-comment" data-post-id="${post.id}">
          <label for="post-comment">أضف تعليقاً</label>
          <textarea id="post-comment" name="body" placeholder="اكتب تعليقاً مفيداً"></textarea>
          <button class="primary-button" type="submit">${icon("message", true)} نشر التعليق</button>
        </form>
      </section>
    </article>
  `;
}

function renderCreate(): string {
  return `
    <form class="grid" data-form="draft">
      <div class="panel">
        <div class="field">
          <label for="product">المنتج</label>
          <select id="product" name="productId">
            ${products.map((product) => `<option value="${product.id}">${html(product.name)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="rating">التقييم من 10</label>
          <input id="rating" name="rating" type="number" min="1" max="10" step="1" value="8" />
        </div>
        <div class="field">
          <label for="title">عنوان التجربة</label>
          <input id="title" name="title" placeholder="مثال: مناسب للبشرة الجافة" />
        </div>
        <div class="field">
          <label for="body">التفاصيل</label>
          <textarea id="body" name="body" placeholder="اكتب مدة الاستخدام، النتيجة، والملاحظات المهمة"></textarea>
        </div>
        ${ui.formError ? `<p class="error-text">${html(ui.formError)}</p>` : ""}
      </div>
      <div class="button-row">
        <button class="secondary-button" name="intent" value="draft" type="submit">${icon("bookmark", true)} حفظ كمسودة</button>
        <button class="primary-button" name="intent" value="publish" type="submit">${icon("check", true)} نشر التجربة</button>
      </div>
      <button class="text-button" type="button" data-action="nav" data-path="/drafts">عرض المسودات</button>
    </form>
  `;
}

function renderDrafts(): string {
  return `
    <div class="grid">
      ${
        state.drafts.length
          ? state.drafts.map(renderDraftCard).join("")
          : renderEmpty("لا توجد مسودات", "احفظ تجربة من صفحة الإنشاء لتظهر هنا.")
      }
    </div>
  `;
}

function renderDraftCard(draft: DraftPost): string {
  const product = productById(draft.productId);
  return `
    <article class="post-card">
      <span class="caption">آخر تحديث: ${html(draft.updatedAt)}</span>
      <h2 class="post-title">${html(draft.title)}</h2>
      <p class="post-body">${html(draft.body)}</p>
      ${product ? `<span class="tag">${html(product.name)}</span>` : ""}
      <div class="button-row">
        <button class="primary-button" data-action="publish-draft" data-draft-id="${draft.id}">${icon("check", true)} نشر</button>
        <button class="danger-button" data-action="delete-draft" data-draft-id="${draft.id}">${icon("trash", true)} حذف</button>
      </div>
    </article>
  `;
}

function renderCompare(): string {
  const selected = state.compareProductIds.map(productById).filter((product): product is Product => Boolean(product));
  const available = products.filter((product) => !state.compareProductIds.includes(product.id));
  if (!selected.length) {
    return `
      ${renderEmpty("لم تضف منتجات للمقارنة", "افتح أي منتج واضغط إضافة للمقارنة.")}
      <section class="section grid">${products.slice(0, 3).map((product) => renderProductCard(product, "compact")).join("")}</section>
    `;
  }

  const rows = [
    ["التقييم", ...selected.map((product) => `${product.rating} / 10`)],
    ["السعر", ...selected.map((product) => product.priceRange)],
    ["الملاءمة", ...selected.map((product) => product.suitableFor.slice(0, 2).join("، "))],
    ["ملاحظات", ...selected.map((product) => product.cautions[0] ?? "لا توجد ملاحظة")]
  ];

  return `
    <div class="table-wrap">
      <table class="comparison">
        <thead>
          <tr>
            <th>البند</th>
            ${selected.map((product) => `<th>${html(product.name)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${html(cell)}</td>`).join("")}</tr>`).join("")}
          <tr>
            <td>إجراء</td>
            ${selected
              .map(
                (product) => `
                  <td>
                    <button class="danger-button" data-action="remove-compare" data-product-id="${product.id}">
                      ${icon("close", true)} إزالة
                    </button>
                  </td>
                `
              )
              .join("")}
          </tr>
        </tbody>
      </table>
    </div>
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">أضف منتجاً آخر</h2>
        <span class="caption">${selected.length} / 4</span>
      </div>
      <div class="grid">
        ${available.length ? available.slice(0, 3).map((product) => renderProductCard(product, "compact")).join("") : renderEmpty("كل المنتجات المختارة", "أزل منتجا لإضافة خيار آخر.")}
      </div>
    </section>
  `;
}

function renderSaved(): string {
  const productList = state.savedProductIds.map(productById).filter((product): product is Product => Boolean(product));
  const postList = state.savedPostIds.map(postById).filter((post): post is Post => Boolean(post));
  return `
    <div class="tabs" role="tablist" aria-label="أقسام المحفوظات">
      <button class="tab${ui.savedView === "products" ? " active" : ""}" data-action="saved-view" data-view="products">منتجات</button>
      <button class="tab${ui.savedView === "posts" ? " active" : ""}" data-action="saved-view" data-view="posts">منشورات</button>
      <button class="tab${ui.savedView === "lists" ? " active" : ""}" data-action="saved-view" data-view="lists">قوائم</button>
    </div>
    <div class="grid">
      ${
        ui.savedView === "products"
          ? productList.length
            ? productList.map((product) => renderProductCard(product, "compact")).join("")
            : renderEmpty("لا توجد منتجات محفوظة", "ابدأ بحفظ المنتجات التي تريد الرجوع إليها.")
          : ""
      }
      ${
        ui.savedView === "posts"
          ? postList.length
            ? postList.map(renderPostCard).join("")
            : renderEmpty("لا توجد منشورات محفوظة", "احفظ التجارب التي تهمك من صفحة المنشور.")
          : ""
      }
      ${
        ui.savedView === "lists"
          ? `${renderListForm()}${state.savedLists.map(renderListCard).join("")}`
          : ""
      }
    </div>
  `;
}

function renderLists(): string {
  return `
    ${renderListForm()}
    <div class="grid section">
      ${state.savedLists.length ? state.savedLists.map(renderListCard).join("") : renderEmpty("لا توجد قوائم بعد", "أنشئ قائمة لتنظيم المنتجات والمنشورات.")}
    </div>
  `;
}

function renderListRoute(path: string): RouteResult {
  const listId = path.split("/")[3] ?? "";
  const list = state.savedLists.find((item) => item.id === listId);
  if (!list) return { title: "قائمة غير موجودة", body: renderMissing(), active: "saved", showBack: true };
  const listProducts = list.productIds.map(productById).filter((product): product is Product => Boolean(product));
  const listPosts = list.postIds.map(postById).filter((post): post is Post => Boolean(post));
  return {
    title: list.name,
    subtitle: list.description,
    active: "saved",
    showBack: true,
    body: `
      <section class="section">
        <h2 class="section-title">المنتجات</h2>
        <div class="grid section">
          ${listProducts.length ? listProducts.map((product) => renderProductCard(product, "compact")).join("") : renderEmpty("لا توجد منتجات", "أضف منتجا من صفحة المنتج.")}
        </div>
      </section>
      <section class="section">
        <h2 class="section-title">المنشورات</h2>
        <div class="grid section">
          ${listPosts.length ? listPosts.map(renderPostCard).join("") : renderEmpty("لا توجد منشورات", "احفظ منشورا داخل هذه القائمة لاحقا.")}
        </div>
      </section>
    `
  };
}

function renderListForm(): string {
  return `
    <form class="panel" data-form="list">
      <div class="field">
        <label for="list-name">اسم القائمة</label>
        <input id="list-name" name="name" placeholder="مثال: اختيارات العناية الأسبوعية" />
      </div>
      <div class="field">
        <label for="list-description">وصف مختصر</label>
        <input id="list-description" name="description" placeholder="لماذا تحفظ هذه المنتجات؟" />
      </div>
      <button class="primary-button" type="submit">${icon("plus", true)} إنشاء قائمة</button>
    </form>
  `;
}

function renderListCard(list: SavedList): string {
  return `
    <article class="list-card">
      <div class="split">
        <div>
          <h2 class="post-title">${html(list.name)}</h2>
          <p class="product-summary">${html(list.description)}</p>
        </div>
        <span class="rating-badge">${list.productIds.length + list.postIds.length}</span>
      </div>
      <button class="secondary-button" data-action="nav" data-path="/saved/lists/${list.id}">فتح القائمة</button>
    </article>
  `;
}

function renderFollowing(): string {
  const followedPosts = allPosts().filter((post) => state.followingUsernames.includes(post.author));
  return `
    <section class="grid">
      ${users.map(renderUserCard).join("")}
    </section>
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">منشورات الحسابات المتابعة</h2>
        <span class="caption">${followedPosts.length}</span>
      </div>
      <div class="grid">
        ${followedPosts.length ? followedPosts.map(renderPostCard).join("") : renderEmpty("لا توجد منشورات جديدة", "تابع حسابات جديدة لتظهر تجاربها هنا.")}
      </div>
    </section>
  `;
}

function renderNotifications(): string {
  return `
    <div class="button-row single">
      <button class="primary-button" data-action="mark-notifications">${icon("check", true)} تعليم الكل كمقروء</button>
    </div>
    <div class="grid section">
      ${
        state.notifications.length
          ? state.notifications
              .map(
                (item) => `
                  <article class="panel notification-row">
                    <span class="avatar ${item.read ? "avatar-blue" : "avatar-yellow"}">${item.read ? icon("check") : icon("bell")}</span>
                    <div class="row-text">
                      <strong>${html(item.title)}</strong>
                      <span>${html(item.body)} · ${html(item.createdAt)}</span>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmpty("لا توجد إشعارات جديدة", "سنخبرك عند وصول تعليق أو متابعة جديدة.")
      }
    </div>
  `;
}

function renderProfile(): string {
  const ownPosts = allPosts().filter((post) => post.author === state.profile.username);
  return `
    <section class="panel">
      <div class="user-row">
        <span class="avatar avatar-yellow">${html(state.profile.name.slice(0, 1))}</span>
        <div class="row-text">
          <strong>${html(state.profile.name)}</strong>
          <span>@${html(state.profile.username)} · ${html(state.profile.city)}</span>
        </div>
      </div>
      <p class="body-copy section">${html(state.profile.bio)}</p>
      <div class="stats section">
        <div class="stat"><strong>${ownPosts.length}</strong><span>منشورات</span></div>
        <div class="stat"><strong>${state.savedProductIds.length}</strong><span>منتجات</span></div>
        <div class="stat"><strong>${state.followingUsernames.length}</strong><span>متابعة</span></div>
      </div>
      <div class="button-row section">
        <button class="primary-button" data-action="nav" data-path="/profile/edit">${icon("edit", true)} تعديل</button>
        <button class="secondary-button" data-action="nav" data-path="/settings">${icon("settings", true)} الإعدادات</button>
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">منشوراتي</h2>
        <button class="text-button" data-action="nav" data-path="/create">إضافة</button>
      </div>
      <div class="grid">${ownPosts.length ? ownPosts.map(renderPostCard).join("") : renderEmpty("لم تنشر بعد", "اكتب تجربة تجريبية لتظهر في ملفك.")}</div>
    </section>
  `;
}

function renderEditProfile(): string {
  return `
    <form class="panel" data-form="profile">
      <div class="field">
        <label for="name">الاسم</label>
        <input id="name" name="name" value="${html(state.profile.name)}" />
      </div>
      <div class="field">
        <label for="city">المدينة</label>
        <input id="city" name="city" value="${html(state.profile.city)}" />
      </div>
      <div class="field">
        <label for="bio">نبذة</label>
        <textarea id="bio" name="bio">${html(state.profile.bio)}</textarea>
      </div>
      <button class="primary-button" type="submit">${icon("check", true)} حفظ التعديلات</button>
    </form>
  `;
}

function renderPublicProfileRoute(path: string): RouteResult {
  const username = path.split("/")[2] ?? "";
  const user = userByUsername(username);
  if (!user) return { title: "حساب غير موجود", body: renderMissing(), active: "profile", showBack: true };
  return {
    title: user.name,
    subtitle: user.title,
    active: "profile",
    showBack: true,
    body: `
      <section class="panel">
        ${renderUserLine(user.username)}
        <p class="body-copy section">${html(user.bio)}</p>
        <button class="primary-button section" data-action="follow-user" data-username="${user.username}">
          ${icon("users", true)} ${state.followingUsernames.includes(user.username) ? "إلغاء المتابعة" : "متابعة الحساب"}
        </button>
      </section>
      <section class="section grid">
        ${allPosts()
          .filter((post) => post.author === user.username)
          .map(renderPostCard)
          .join("")}
      </section>
    `
  };
}

function renderSettings(): string {
  return `
    <div class="grid">
      <button class="panel setting-row" data-action="nav" data-path="/settings/privacy">
        ${icon("user")}<div class="row-text"><strong>الخصوصية</strong><span>ملف خاص وإعدادات الظهور</span></div>
      </button>
      <button class="panel setting-row" data-action="nav" data-path="/settings/notifications">
        ${icon("bell")}<div class="row-text"><strong>الإشعارات</strong><span>التعليقات والتنبيهات الأسبوعية</span></div>
      </button>
      <button class="panel setting-row" data-action="nav" data-path="/help">
        ${icon("message")}<div class="row-text"><strong>المساعدة</strong><span>أسئلة سريعة عن العرض</span></div>
      </button>
      <button class="panel setting-row" data-action="nav" data-path="/terms">
        ${icon("flag")}<div class="row-text"><strong>الشروط</strong><span>نص تجريبي للعرض</span></div>
      </button>
      <button class="panel setting-row" data-action="nav" data-path="/privacy">
        ${icon("settings")}<div class="row-text"><strong>سياسة الخصوصية</strong><span>شرح مختصر للبيانات المحلية</span></div>
      </button>
      <button class="secondary-button" data-action="logout">${icon("user", true)} تسجيل الخروج</button>
      <button class="danger-button" data-action="reset-demo">${icon("trash", true)} إعادة ضبط بيانات العرض</button>
    </div>
  `;
}

function renderPrivacySettings(): string {
  return `
    <div class="grid">
      ${renderSettingToggle("privateProfile", "ملف خاص", "إخفاء ملفك عن الزوار في العرض.")}
    </div>
  `;
}

function renderNotificationSettings(): string {
  return `
    <div class="grid">
      ${renderSettingToggle("productAlerts", "تنبيهات المنتجات", "إظهار إشعار عند تحديث تجربة مرتبطة بمنتج محفوظ.")}
      ${renderSettingToggle("commentAlerts", "تعليقات وردود", "إظهار إشعار عند وصول تعليق جديد.")}
      ${renderSettingToggle("weeklyDigest", "ملخص أسبوعي", "عرض ملخص تجريبي لأبرز المنتجات.")}
    </div>
  `;
}

function renderSettingToggle(key: keyof AppState["settings"], title: string, body: string): string {
  const active = state.settings[key];
  return `
    <article class="panel setting-row">
      <div class="row-text">
        <strong>${html(title)}</strong>
        <span>${html(body)}</span>
      </div>
      <button class="toggle${active ? " active" : ""}" data-action="toggle-setting" data-setting="${key}" aria-label="${html(title)}"></button>
    </article>
  `;
}

function renderHelp(): string {
  return `
    <div class="grid">
      ${renderInfoPanel("كيف أجرّب الدخول؟", `استخدم رقم الجوال ${demoPhone} ثم رمز التحقق ${demoOtp}.`)}
      ${renderInfoPanel("هل توجد بيانات حقيقية؟", "لا، كل شيء في هذه المرحلة بيانات عرض محفوظة داخل المتصفح.")}
      ${renderInfoPanel("ما أهم تدفق للعرض؟", "ابدأ من العناية بالبشرة، افتح منتج CeraVe، احفظه، أضفه للمقارنة، ثم افتح تجربة مستخدم وأضف تعليقاً.")}
    </div>
  `;
}

function renderTerms(): string {
  return `
    <div class="panel">
      <p class="body-copy">هذه نسخة عرض من رأينا. المحتوى التجريبي مخصص لتوضيح تجربة المستخدم ولا يمثل نصائح طبية أو توصيات شراء ملزمة.</p>
    </div>
  `;
}

function renderPrivacy(): string {
  return `
    <div class="panel">
      <p class="body-copy">في هذه المرحلة تحفظ رأينا البيانات داخل LocalStorage فقط: الجلسة التجريبية، المحفوظات، القوائم، المقارنة، التعليقات، المسودات، والإعدادات.</p>
    </div>
  `;
}

function renderInfoPanel(title: string, body: string): string {
  return `<article class="panel"><h2 class="section-title">${html(title)}</h2><p class="body-copy">${html(body)}</p></article>`;
}

function renderMissing(): string {
  return `
    ${renderEmpty("الصفحة غير متاحة", "تحقق من المسار أو ارجع إلى الرئيسية.")}
    <button class="primary-button section" data-action="nav" data-path="/home">العودة للرئيسية</button>
  `;
}

function renderAuthRequired(path: string): string {
  state.session.intendedPath = path;
  persist();
  return `
    <div class="empty-state">
      ${icon("user")}
      <h3>تحتاج تسجيل دخول</h3>
      <p>هذا المسار يحفظ بيانات أو ينفذ إجراء مرتبط بحسابك التجريبي.</p>
      <button class="primary-button" data-action="nav" data-path="/login">تسجيل الدخول</button>
      <button class="secondary-button" data-action="nav" data-path="/home">العودة للرئيسية</button>
    </div>
  `;
}

function renderCategoryChip(category: (typeof categories)[number]): string {
  return `
    <button class="category-chip tone-${category.tone}" data-action="nav" data-path="/category/${category.slug}">
      <strong>${html(category.name)}</strong>
      <span>${html(category.description)}</span>
    </button>
  `;
}

function renderProductCard(product: Product, variant: "full" | "compact"): string {
  return `
    <article class="product-card ${variant === "compact" ? "compact" : ""}">
      ${renderProductVisual(product, variant === "compact")}
      <div class="product-meta">
        <div class="split">
          <span class="caption">${html(product.brand)}</span>
          ${renderRating(product.rating)}
        </div>
        <h3 class="product-name">${html(product.name)}</h3>
        <p class="product-summary">${html(product.summary)}</p>
        <div class="tag-row">${product.tags.slice(0, 3).map((tag) => `<span class="tag">${html(tag)}</span>`).join("")}</div>
        <div class="button-row">
          <button class="primary-button" data-action="nav" data-path="/product/${product.slug}">فتح المنتج</button>
          ${renderCompareButton(product.id)}
        </div>
      </div>
    </article>
  `;
}

function renderProductVisual(product: Product, compact = false): string {
  return `
    <div class="product-visual visual-${product.imageTone}" role="img" aria-label="صورة توضيحية للمنتج ${html(product.name)}">
      <div class="product-bottle" aria-hidden="true">
        <span></span>
        ${compact ? "" : `<strong>${html(product.brand.slice(0, 3))}</strong>`}
      </div>
    </div>
  `;
}

function renderPostCard(post: Post): string {
  const product = productById(post.productId);
  return `
    <article class="post-card">
      ${renderUserLine(post.author)}
      <div class="split">
        <h3 class="post-title">${html(post.title)}</h3>
        ${renderRating(post.rating)}
      </div>
      <p class="post-body">${html(post.body)}</p>
      ${product ? `<span class="tag">${html(product.name)}</span>` : ""}
      <div class="button-row">
        <button class="primary-button" data-action="nav" data-path="/post/${post.id}">${icon("message", true)} قراءة التجربة</button>
        ${renderSavePostButton(post.id)}
      </div>
    </article>
  `;
}

function renderUserCard(user: (typeof users)[number]): string {
  return `
    <article class="user-card">
      ${renderUserLine(user.username)}
      <p class="body-copy">${html(user.bio)}</p>
      <div class="button-row">
        <button class="primary-button" data-action="follow-user" data-username="${user.username}">
          ${icon("users", true)} ${state.followingUsernames.includes(user.username) ? "إلغاء المتابعة" : "متابعة"}
        </button>
        <button class="secondary-button" data-action="nav" data-path="/profile/${user.username}">الملف</button>
      </div>
    </article>
  `;
}

function renderUserLine(username: string): string {
  const user = userByUsername(username);
  const name = user?.name ?? state.profile.name;
  const title = user?.title ?? "حسابي في رأينا";
  const tone = user?.avatarTone ?? "yellow";
  return `
    <button class="post-head" data-action="nav" data-path="${user ? `/profile/${user.username}` : "/profile"}">
      <span class="avatar avatar-${tone}">${html(name.slice(0, 1))}</span>
      <span class="row-text">
        <strong>${html(name)}</strong>
        <span>${html(title)}</span>
      </span>
    </button>
  `;
}

function renderRating(score: number): string {
  const tone = score >= 8 ? "rating-good" : score >= 6 ? "rating-mid" : "rating-low";
  return `<span class="rating-badge ${tone}">${icon("star", true)} ${score.toFixed(1)} / 10</span>`;
}

function renderSaveProductButton(productId: string): string {
  const saved = state.savedProductIds.includes(productId);
  return `
    <button class="${saved ? "secondary-button" : "primary-button"}" data-action="save-product" data-product-id="${productId}">
      ${icon("bookmark", true)} ${saved ? "محفوظ" : "حفظ"}
    </button>
  `;
}

function renderSavePostButton(postId: string): string {
  const saved = state.savedPostIds.includes(postId);
  return `
    <button class="${saved ? "secondary-button" : "primary-button"}" data-action="save-post" data-post-id="${postId}">
      ${icon("bookmark", true)} ${saved ? "محفوظ" : "حفظ"}
    </button>
  `;
}

function renderCompareButton(productId: string): string {
  const selected = state.compareProductIds.includes(productId);
  return `
    <button class="${selected ? "secondary-button" : "primary-button"}" data-action="compare-product" data-product-id="${productId}">
      ${icon("scale", true)} ${selected ? "في المقارنة" : "قارن"}
    </button>
  `;
}

function renderComments(comments: CommentItem[]): string {
  if (!comments.length) return renderEmpty("لا توجد تعليقات بعد", "ابدأ بسؤال واضح أو ملاحظة مفيدة.");
  const parents = comments.filter((comment) => !comment.parentId);
  return `
    <div class="grid">
      ${parents
        .map((comment) => {
          const replies = comments.filter((reply) => reply.parentId === comment.id);
          return `
            <article class="panel">
              ${renderCommentLine(comment)}
              ${replies.map((reply) => `<div style="margin-inline-start: 24px; margin-top: 10px">${renderCommentLine(reply)}</div>`).join("")}
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderCommentLine(comment: CommentItem): string {
  const user = userByUsername(comment.author);
  const name = user?.name ?? state.profile.name;
  return `
    <div class="user-row">
      <span class="avatar avatar-${user?.avatarTone ?? "yellow"}">${html(name.slice(0, 1))}</span>
      <div class="row-text">
        <strong>${html(name)}</strong>
        <span>${html(comment.createdAt)}</span>
      </div>
    </div>
    <p class="body-copy">${html(comment.body)}</p>
  `;
}

function renderEmpty(title: string, body: string): string {
  return `
    <div class="empty-state">
      ${icon("bookmark")}
      <h3>${html(title)}</h3>
      <p>${html(body)}</p>
    </div>
  `;
}

function renderSheet(sheet: SheetState): string {
  if (sheet.kind === "auth") {
    return renderBottomSheet(`
      <h2 class="section-title">سجل الدخول للمتابعة</h2>
      <p class="body-copy">سنرجعك إلى نفس المكان بعد إدخال رمز التحقق التجريبي.</p>
      <button class="primary-button" data-action="nav" data-path="/login">تسجيل الدخول</button>
      <button class="secondary-button" data-action="close-sheet">ليس الآن</button>
    `);
  }

  if (sheet.kind === "addToList") {
    return renderBottomSheet(`
      <h2 class="section-title">إضافة إلى قائمة</h2>
      <form class="grid" data-form="add-to-list" data-product-id="${sheet.productId}">
        <div class="field">
          <label for="selected-list">اختر قائمة</label>
          <select id="selected-list" name="listId">
            ${state.savedLists.map((list) => `<option value="${list.id}">${html(list.name)}</option>`).join("")}
          </select>
        </div>
        <button class="primary-button" type="submit">إضافة</button>
      </form>
      <button class="text-button" data-action="nav" data-path="/saved/lists">إدارة القوائم</button>
    `);
  }

  if (sheet.kind === "report") {
    return renderBottomSheet(`
      <h2 class="section-title">الإبلاغ عن محتوى</h2>
      <p class="body-copy">${html(sheet.title)}</p>
      <form class="grid" data-form="report" data-target="${html(sheet.target)}">
        <div class="field">
          <label for="report-body">سبب الإبلاغ</label>
          <textarea id="report-body" name="body" placeholder="اكتب السبب باختصار"></textarea>
        </div>
        <button class="danger-button" type="submit">${icon("flag", true)} إرسال البلاغ</button>
      </form>
    `);
  }

  if (sheet.kind === "filters") {
    return renderBottomSheet(`
      <h2 class="section-title">الفلاتر</h2>
      <div class="tag-row">
        ${categories.map((category) => `<button class="chip" data-action="set-search-category" data-category="${category.slug}">${html(category.name)}</button>`).join("")}
        <button class="chip" data-action="set-search-category" data-category="all">كل التصنيفات</button>
      </div>
    `);
  }

  return renderBottomSheet(`
    <h2 class="section-title">ترتيب النتائج</h2>
    <div class="grid">
      <button class="primary-button" data-action="set-search-sort" data-sort="rating">الأعلى تقييماً</button>
      <button class="secondary-button" data-action="set-search-sort" data-sort="price">حسب نطاق السعر</button>
    </div>
  `);
}

function renderBottomSheet(content: string): string {
  return `
    <div class="sheet-backdrop" role="presentation">
      <section class="sheet" role="dialog" aria-modal="true">
        <div class="sheet-grip" aria-hidden="true"></div>
        <button class="icon-button" data-action="close-sheet" aria-label="إغلاق">${icon("close")}</button>
        ${content}
      </section>
    </div>
  `;
}

function submitText(form: HTMLFormElement, name: string): string {
  return String(new FormData(form).get(name) ?? "").trim();
}

function updateSearchParam(key: string, value: string): void {
  const params = routeParams();
  params.set(key, value);
  ui.sheet = null;
  navigate(`/search?${params.toString()}`);
}

document.addEventListener("click", async (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset.action ?? "";

  if (action === "nav") {
    navigate(target.dataset.path ?? "/home");
    return;
  }

  if (action === "back") {
    window.history.length > 1 ? window.history.back() : navigate("/home");
    return;
  }

  if (action === "start-member") {
    state.onboardingDone = true;
    persist();
    navigate("/login");
    return;
  }

  if (action === "continue-visitor") {
    state.onboardingDone = true;
    state.session.mode = "visitor";
    persist();
    navigate("/home");
    return;
  }

  if (action === "close-sheet") {
    ui.sheet = null;
    render();
    return;
  }

  if (action === "open-sheet") {
    const kind = target.dataset.sheet === "sort" ? "sort" : "filters";
    ui.sheet = { kind };
    render();
    return;
  }

  if (action === "open-add-list") {
    if (!requireMember()) return;
    ui.sheet = { kind: "addToList", productId: target.dataset.productId ?? "" };
    render();
    return;
  }

  if (action === "save-product") {
    if (!requireMember()) return;
    toggleArray(state.savedProductIds, target.dataset.productId ?? "");
    persist();
    toast("تم تحديث حفظ المنتج");
    return;
  }

  if (action === "save-post") {
    if (!requireMember()) return;
    toggleArray(state.savedPostIds, target.dataset.postId ?? "");
    persist();
    toast("تم تحديث حفظ المنشور");
    return;
  }

  if (action === "compare-product") {
    const productId = target.dataset.productId ?? "";
    if (state.compareProductIds.includes(productId)) {
      state.compareProductIds = state.compareProductIds.filter((id) => id !== productId);
      persist();
      toast("تمت إزالة المنتج من المقارنة");
      return;
    }
    if (state.compareProductIds.length >= 4) {
      toast("يمكن مقارنة أربعة منتجات كحد أقصى");
      return;
    }
    state.compareProductIds.push(productId);
    persist();
    toast("تمت إضافة المنتج للمقارنة");
    return;
  }

  if (action === "remove-compare") {
    state.compareProductIds = state.compareProductIds.filter((id) => id !== target.dataset.productId);
    persist();
    toast("تمت الإزالة من المقارنة");
    return;
  }

  if (action === "follow-user") {
    if (!requireMember()) return;
    toggleArray(state.followingUsernames, target.dataset.username ?? "");
    persist();
    toast("تم تحديث المتابعة");
    return;
  }

  if (action === "saved-view") {
    const view = target.dataset.view;
    if (view === "products" || view === "posts" || view === "lists") ui.savedView = view;
    render();
    return;
  }

  if (action === "set-search-category") {
    updateSearchParam("category", target.dataset.category ?? "all");
    return;
  }

  if (action === "set-search-sort") {
    updateSearchParam("sort", target.dataset.sort ?? "rating");
    return;
  }

  if (action === "report") {
    if (!requireMember()) return;
    ui.sheet = {
      kind: "report",
      target: target.dataset.target ?? "",
      title: target.dataset.title ?? "محتوى"
    };
    render();
    return;
  }

  if (action === "share") {
    const path = target.dataset.path ?? currentPath();
    const url = shareUrl(path);
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      await nav.share({ title: "رأينا", text: "تجربة من رأينا", url }).catch(() => undefined);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url).catch(() => undefined);
      toast("تم نسخ الرابط");
    }
    return;
  }

  if (action === "publish-draft") {
    const draft = state.drafts.find((item) => item.id === target.dataset.draftId);
    if (!draft) return;
    publishDraft(draft);
    toast("تم نشر التجربة");
    return;
  }

  if (action === "delete-draft") {
    state.drafts = state.drafts.filter((draft) => draft.id !== target.dataset.draftId);
    persist();
    toast("تم حذف المسودة");
    return;
  }

  if (action === "mark-notifications") {
    state.notifications = state.notifications.map((item) => ({ ...item, read: true }));
    persist();
    toast("تم تحديث الإشعارات");
    return;
  }

  if (action === "toggle-setting") {
    const key = target.dataset.setting as keyof AppState["settings"];
    state.settings[key] = !state.settings[key];
    persist();
    render();
    return;
  }

  if (action === "logout") {
    state.session.mode = "visitor";
    state.session.phone = "";
    persist();
    toast("تم تسجيل الخروج");
    navigate("/home");
    return;
  }

  if (action === "reset-demo") {
    state = resetState();
    ui = { toast: "", sheet: null, formError: "", savedView: "products" };
    navigate("/splash");
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target as HTMLFormElement;
  const formName = form.dataset.form;
  if (!formName) return;
  event.preventDefault();

  if (formName === "login") {
    const phone = submitText(form, "phone").replace(/\D/g, "");
    if (phone.length < 9 || !phone.startsWith("5")) {
      ui.formError = "أدخل رقم جوال سعودي يبدأ بالرقم 5.";
      render();
      return;
    }
    state.session.phone = phone;
    state.profile.phone = phone;
    persist();
    ui.formError = "";
    navigate("/verify-otp");
    return;
  }

  if (formName === "otp") {
    const otp = submitText(form, "otp");
    if (otp !== demoOtp) {
      ui.formError = "رمز التحقق غير صحيح. استخدم 1234 في وضع العرض.";
      render();
      return;
    }
    state.session.mode = "member";
    state.onboardingDone = true;
    const intendedPath = state.session.intendedPath || "/home";
    persist();
    ui.formError = "";
    navigate(intendedPath);
    return;
  }

  if (formName === "search") {
    const query = submitText(form, "q");
    const params = routeParams();
    if (query) params.set("q", query);
    else params.delete("q");
    navigate(`/search?${params.toString()}`);
    return;
  }

  if (formName === "product-comment") {
    if (!requireMember()) return;
    const productId = form.dataset.productId ?? "";
    const body = submitText(form, "body");
    if (!body) return toast("اكتب التعليق أولا");
    const comment = createComment(body);
    state.commentsByProductId[productId] = [...(state.commentsByProductId[productId] ?? []), comment];
    persist();
    toast("تم نشر التعليق");
    return;
  }

  if (formName === "post-comment") {
    if (!requireMember()) return;
    const postId = form.dataset.postId ?? "";
    const body = submitText(form, "body");
    if (!body) return toast("اكتب التعليق أولا");
    const comment = createComment(body);
    state.commentsByPostId[postId] = [...(state.commentsByPostId[postId] ?? []), comment];
    persist();
    toast("تم نشر التعليق");
    return;
  }

  if (formName === "draft") {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = submitter?.value === "publish" ? "publish" : "draft";
    const productId = submitText(form, "productId");
    const rating = Number(submitText(form, "rating"));
    const title = submitText(form, "title");
    const body = submitText(form, "body");
    if (!title || !body || Number.isNaN(rating)) {
      ui.formError = "اكتب عنوانا وتفاصيل واضحة للتجربة.";
      render();
      return;
    }
    const draft: DraftPost = {
      id: uid("draft"),
      productId,
      rating: Math.max(1, Math.min(10, rating)),
      title,
      body,
      updatedAt: "الآن"
    };
    if (intent === "publish") {
      publishDraft(draft);
      toast("تم نشر التجربة");
      navigate("/profile");
    } else {
      state.drafts.unshift(draft);
      persist();
      toast("تم حفظ المسودة");
      navigate("/drafts");
    }
    return;
  }

  if (formName === "list") {
    const name = submitText(form, "name");
    const description = submitText(form, "description") || "قائمة محفوظة للعرض";
    if (!name) return toast("اكتب اسم القائمة");
    state.savedLists.unshift({ id: uid("list"), name, description, productIds: [], postIds: [] });
    persist();
    toast("تم إنشاء القائمة");
    return;
  }

  if (formName === "add-to-list") {
    const listId = submitText(form, "listId");
    const productId = form.dataset.productId ?? "";
    const list = state.savedLists.find((item) => item.id === listId);
    if (list && !list.productIds.includes(productId)) list.productIds.push(productId);
    if (!state.savedProductIds.includes(productId)) state.savedProductIds.push(productId);
    persist();
    ui.sheet = null;
    toast("تمت إضافة المنتج للقائمة");
    return;
  }

  if (formName === "profile") {
    state.profile.name = submitText(form, "name") || state.profile.name;
    state.profile.city = submitText(form, "city") || state.profile.city;
    state.profile.bio = submitText(form, "bio") || state.profile.bio;
    persist();
    toast("تم حفظ الملف");
    navigate("/profile");
    return;
  }

  if (formName === "report") {
    const body = submitText(form, "body");
    if (!body) return toast("اكتب سبب الإبلاغ");
    ui.sheet = null;
    toast("تم إرسال البلاغ التجريبي");
  }
});

window.addEventListener("popstate", render);
window.addEventListener("hashchange", render);

function toggleArray(list: string[], value: string): void {
  if (!value) return;
  const index = list.indexOf(value);
  if (index >= 0) list.splice(index, 1);
  else list.push(value);
}

function createComment(body: string): CommentItem {
  return {
    id: uid("comment"),
    author: state.profile.username,
    body,
    createdAt: "الآن"
  };
}

function publishDraft(draft: DraftPost): void {
  const post: Post = {
    id: uid("post"),
    productId: draft.productId,
    author: state.profile.username,
    rating: draft.rating,
    title: draft.title,
    body: draft.body,
    tags: ["تجربة جديدة"],
    createdAt: "الآن",
    comments: []
  };
  state.publishedPosts.unshift(post);
  state.commentsByPostId[post.id] = [];
  state.drafts = state.drafts.filter((item) => item.id !== draft.id);
  state.notifications.unshift({
    id: uid("note"),
    title: "تم نشر تجربتك",
    body: "ظهرت التجربة في ملفك الشخصي.",
    createdAt: "الآن",
    read: false
  });
  persist();
}

render();
