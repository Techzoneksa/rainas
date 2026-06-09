import { categories, demoOtp, demoPhone, posts, products, users } from "./data.js";
import { loadState, resetState, saveState } from "./state.js";
import type { AppState, CommentItem, DraftPost, Post, Product, SavedList } from "./types.js";

type SheetState =
  | { kind: "auth"; path: string }
  | { kind: "addToList"; targetType: "product" | "post"; targetId: string }
  | { kind: "postActions"; postId: string }
  | { kind: "report"; target: string; title: string }
  | { kind: "filters" }
  | { kind: "sort" };

interface UiState {
  toast: string;
  sheet: SheetState | null;
  formError: string;
  savedView: "products" | "posts" | "lists";
  profileView: "posts" | "publicLists" | "saved";
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
  savedView: "products",
  profileView: "posts"
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
  more: '<circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" />',
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

function publicListById(id: string): SavedList | undefined {
  return state.publicLists.find((list) => list.id === id && list.visibility === "public");
}

function publicListsForUser(username: string): SavedList[] {
  return state.publicLists.filter((list) => list.ownerUsername === username && list.visibility === "public");
}

function personalSavedLists(): SavedList[] {
  return state.savedLists.filter((list) => list.ownerUsername === state.profile.username && list.purpose === "personal_save" && list.visibility === "private");
}

function publicListPath(list: SavedList): string {
  return list.ownerUsername === state.profile.username ? `/profile/public-lists/${list.id}` : `/profile/${list.ownerUsername}/lists/${list.id}`;
}

function publicListsForPost(post: Post): SavedList[] {
  const ownerLists = publicListsForUser(post.author);
  const primary = post.publicListId ? publicListById(post.publicListId) : undefined;
  const related = ownerLists.filter((list) => list.postIds.includes(post.id) || list.productIds.includes(post.productId));
  return [primary, ...related]
    .filter((list): list is SavedList => Boolean(list))
    .filter((list, index, listSet) => listSet.findIndex((item) => item.id === list.id) === index);
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "05•••••567";
  return `05•••••${digits.slice(-3)}`;
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
    path.startsWith("/profile/saved") ||
    path === "/profile/public-lists" ||
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
  if (path === "/verify-otp") {
    updateOtpSubmit();
    app.querySelector<HTMLInputElement>("[data-otp-input]")?.focus();
  }
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
  if (path === "/saved" || path === "/profile/saved") return { title: "المحفوظات", subtitle: "حفظ شخصي داخل حسابك فقط", body: renderSaved(), active: "profile", showBack: true };
  if (path === "/saved/lists" || path === "/profile/saved/lists") return { title: "قوائم الحفظ", subtitle: "قوائم شخصية لا تظهر للزوار", body: renderLists(), active: "profile", showBack: true };
  if (path.startsWith("/saved/lists/") || path.startsWith("/profile/saved/lists/")) return renderListRoute(path);
  if (path === "/profile/public-lists") return { title: "قوائمي العامة", subtitle: "قوائم تظهر للزوار في ملفك", body: renderPublicLists(state.profile.username), active: "profile", showBack: true };
  if (path.startsWith("/profile/public-lists/")) return renderPublicListRoute(path);
  if (path.includes("/lists/")) return renderPublicListRoute(path);
  if (path.endsWith("/lists")) return renderPublicListsRoute(path);
  if (path === "/following") return { title: "المتابعون", subtitle: "منشورات الحسابات التي تتابعها", body: renderFollowing(), active: "following" };
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
    ["following", "/following", "المتابعون", "users"],
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
    ["following", "/following", "المتابعون", "users"],
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
  if (path.startsWith("/following")) return "following";
  if (path.startsWith("/saved")) return "profile";
  if (path.startsWith("/profile") || path.startsWith("/settings") || path.startsWith("/notifications")) return "profile";
  return "home";
}

function renderSplash(): string {
  return `
    <section class="center-screen">
      <div class="brand-stack">
        <img class="brand-logo" src="${assetPath("raina_logo.svg")}" alt="شعار رأينا Raina" />
        <p class="brand-subtitle">مجتمع عربي لاكتشاف المنتجات وقراءة التجارب وحفظ الخيارات قبل قرار الشراء.</p>
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
    ["احفظ ونظم", "احفظ المنتجات والمنشورات التي تهمك داخل قوائم شخصية."]
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
  const phone = maskPhone(state.session.phone || state.profile.phone);
  const errorClass = ui.formError ? " otp-error" : "";
  return `
    <section class="center-screen">
      <div class="brand-stack">
        <div class="brand-mark" aria-hidden="true">#</div>
        <h1 class="brand-title">أدخل رمز التحقق</h1>
        <p class="brand-subtitle">أرسلنا رمزًا من 4 أرقام إلى رقم جوالك ${html(phone)}</p>
      </div>
      <form class="panel" data-form="otp">
        <div class="field">
          <label>رمز التحقق</label>
          <div class="otp-grid${errorClass}" dir="ltr" aria-describedby="otp-help">
            ${[0, 1, 2, 3]
              .map(
                (index) => `
                  <input
                    class="otp-input"
                    name="otp-${index}"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    autocomplete="${index === 0 ? "one-time-code" : "off"}"
                    maxlength="1"
                    data-otp-input
                    data-index="${index}"
                    aria-label="الخانة ${index + 1}"
                  />
                `
              )
              .join("")}
          </div>
          <span id="otp-help" class="caption">رمز التحقق التجريبي: ${demoOtp}</span>
          <span class="caption">يمكنك طلب رمز جديد بعد 30 ثانية.</span>
        </div>
        ${ui.formError ? `<p class="error-text">${html(ui.formError)}</p>` : ""}
        <button class="primary-button" type="submit" data-otp-submit disabled>تحقق وادخل</button>
      </form>
      <div class="button-row">
        <button class="secondary-button" data-action="resend-otp">إعادة إرسال</button>
        <button class="text-button" data-action="nav" data-path="/login">تغيير رقم الجوال</button>
      </div>
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
        <button class="text-button" data-action="nav" data-path="/profile/saved">المحفوظات</button>
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
      <p class="body-copy">وضع العرض يعمل محليا. الحفظ، المتابعة، التعليقات، المسودات، القوائم، والإعدادات تبقى بعد تحديث الصفحة.</p>
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
    .sort((a, b) => (sort === "price" ? (a.priceRange > b.priceRange ? 1 : a.priceRange < b.priceRange ? -1 : 0) : b.rating - a.rating));

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
        <button class="secondary-button" data-action="open-add-list" data-target-type="product" data-target-id="${product.id}">${icon("bookmark", true)} إضافة إلى قائمة حفظ</button>
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
  const comments = commentsForPost(post);
  return `
    <article class="grid">
      <div class="post-card">
        ${renderPostHeader(post)}
        <div class="split">
          <h2 class="post-title">${html(post.title)}</h2>
          ${renderRating(post.rating)}
        </div>
        <p class="post-body">${html(post.body)}</p>
        <div class="tag-row">${post.tags.map((tag) => `<span class="tag">${html(tag)}</span>`).join("")}</div>
        ${product ? `<button class="chip" data-action="nav" data-path="/product/${product.slug}">المنتج: ${html(product.name)}</button>` : ""}
        ${renderPublicListChip(post)}
        <div class="button-row">
          <button class="secondary-button" data-action="nav" data-path="/post/${post.id}">${icon("message", true)} التعليقات ${comments.length}</button>
          ${renderSavePostButton(post.id)}
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
  const ownPublicLists = publicListsForUser(state.profile.username);
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
      <div class="panel">
        <h2 class="section-title">إضافة المنتج إلى قائمة عامة</h2>
        <p class="body-copy section">ستظهر هذه القائمة للزوار في ملفك الشخصي.</p>
        <div class="field section">
          <label for="public-list">اختر قائمة عامة موجودة</label>
          <select id="public-list" name="publicListId">
            <option value="">بدون قائمة</option>
            ${ownPublicLists.map((list) => `<option value="${list.id}">${html(list.name)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="public-list-name">أو أنشئ قائمة عامة جديدة</label>
          <input id="public-list-name" name="publicListName" placeholder="مثال: عطور مناسبة للمناسبات" />
        </div>
        <div class="field">
          <label for="public-list-description">وصف اختياري</label>
          <input id="public-list-description" name="publicListDescription" placeholder="ما الذي يجمع عناصر هذه القائمة؟" />
        </div>
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
  const list = draft.publicListId ? publicListById(draft.publicListId) : undefined;
  return `
    <article class="post-card">
      <span class="caption">آخر تحديث: ${html(draft.updatedAt)}</span>
      <h2 class="post-title">${html(draft.title)}</h2>
      <p class="post-body">${html(draft.body)}</p>
      ${product ? `<span class="tag">${html(product.name)}</span>` : ""}
      ${list ? `<span class="tag">قائمة عامة: ${html(list.name)}</span>` : ""}
      <div class="button-row">
        <button class="primary-button" data-action="publish-draft" data-draft-id="${draft.id}">${icon("check", true)} نشر</button>
        <button class="danger-button" data-action="delete-draft" data-draft-id="${draft.id}">${icon("trash", true)} حذف</button>
      </div>
    </article>
  `;
}

function renderSaved(): string {
  const productList = state.savedProductIds.map(productById).filter((product): product is Product => Boolean(product));
  const postList = state.savedPostIds.map(postById).filter((post): post is Post => Boolean(post));
  const lists = personalSavedLists();
  return `
    <div class="tabs" role="tablist" aria-label="أقسام المحفوظات">
      <button class="tab${ui.savedView === "products" ? " active" : ""}" data-action="saved-view" data-view="products">منتجات</button>
      <button class="tab${ui.savedView === "posts" ? " active" : ""}" data-action="saved-view" data-view="posts">منشورات</button>
      <button class="tab${ui.savedView === "lists" ? " active" : ""}" data-action="saved-view" data-view="lists">قوائم الحفظ</button>
    </div>
    <p class="body-copy">هذه المحفوظات شخصية ولا تظهر في الملف العام.</p>
    <div class="grid">
      ${
        ui.savedView === "products"
          ? productList.length
            ? productList.map((product) => renderProductCard(product, "compact")).join("")
            : renderEmpty("لم تحفظ أي شيء بعد", "ابدأ بحفظ المنتجات التي تريد الرجوع إليها.")
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
          ? `${renderListForm()}${lists.length ? lists.map(renderListCard).join("") : renderEmpty("لا توجد قوائم بعد", "أنشئ قائمة لتنظيم المنتجات والمنشورات.")}`
          : ""
      }
    </div>
  `;
}

function renderLists(): string {
  const lists = personalSavedLists();
  return `
    ${renderListForm()}
    <div class="grid section">
      ${lists.length ? lists.map(renderListCard).join("") : renderEmpty("لا توجد قوائم بعد", "أنشئ قائمة لتنظيم المنتجات والمنشورات.")}
    </div>
  `;
}

function renderListRoute(path: string): RouteResult {
  const pathParts = path.split("/").filter(Boolean);
  const listId = pathParts[pathParts.length - 1] ?? "";
  const list = personalSavedLists().find((item) => item.id === listId);
  if (!list) return { title: "لا يمكنك الوصول إلى هذه القائمة", body: renderEmpty("لا يمكنك الوصول إلى هذه القائمة", "قوائم الحفظ الشخصية تظهر لصاحب الحساب فقط."), active: "profile", showBack: true };
  const listProducts = list.productIds.map(productById).filter((product): product is Product => Boolean(product));
  const listPosts = list.postIds.map(postById).filter((post): post is Post => Boolean(post));
  return {
    title: list.name,
    subtitle: list.description,
    active: "profile",
    showBack: true,
    body: `
      <div class="button-row single">
        <button class="danger-button" data-action="delete-list" data-list-id="${list.id}">${icon("trash", true)} حذف القائمة</button>
      </div>
      <section class="section">
        <h2 class="section-title">المنتجات</h2>
        <div class="grid section">
          ${listProducts.length ? listProducts.map((product) => renderListProductItem(product, list.id)).join("") : renderEmpty("لا توجد منتجات", "أضف منتجا من صفحة المنتج.")}
        </div>
      </section>
      <section class="section">
        <h2 class="section-title">المنشورات</h2>
        <div class="grid section">
          ${listPosts.length ? listPosts.map((post) => renderListPostItem(post, list.id)).join("") : renderEmpty("لا توجد منشورات", "احفظ منشورا داخل هذه القائمة لاحقا.")}
        </div>
      </section>
    `
  };
}

function renderListProductItem(product: Product, listId: string): string {
  return `
    <div class="list-item">
      ${renderProductCard(product, "compact")}
      <button class="danger-button" data-action="remove-list-item" data-list-id="${listId}" data-target-type="product" data-target-id="${product.id}">إزالة من القائمة</button>
    </div>
  `;
}

function renderListPostItem(post: Post, listId: string): string {
  return `
    <div class="list-item">
      ${renderPostCard(post)}
      <button class="danger-button" data-action="remove-list-item" data-list-id="${listId}" data-target-type="post" data-target-id="${post.id}">إزالة من القائمة</button>
    </div>
  `;
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
      <div class="button-row">
        <button class="secondary-button" data-action="nav" data-path="/profile/saved/lists/${list.id}">فتح القائمة</button>
        <button class="danger-button" data-action="delete-list" data-list-id="${list.id}">${icon("trash", true)} حذف</button>
      </div>
    </article>
  `;
}

function renderFollowing(): string {
  const params = routeParams();
  const selected = params.get("user") ?? "all";
  const followedUsers = state.followingUsernames.map(userByUsername).filter((user): user is (typeof users)[number] => Boolean(user));
  const followedPosts = allPosts().filter((post) => state.followingUsernames.includes(post.author) && (selected === "all" || post.author === selected));
  if (!followedUsers.length) {
    return `
      ${renderEmpty("لم تتابع أي حساب بعد", "تابع الحسابات التي تثق بتجاربها لتظهر منشوراتها هنا.")}
      <button class="primary-button section" data-action="nav" data-path="/search">استكشف الحسابات</button>
    `;
  }
  return `
    <section class="section">
      <div class="account-strip" aria-label="الحسابات المتابَعة">
        <article class="account-chip${selected === "all" ? " active" : ""}">
          <button class="avatar avatar-yellow" data-action="following-filter" data-username="all" aria-label="كل الحسابات">${icon("users")}</button>
          <button class="text-button" data-action="following-filter" data-username="all">كل الحسابات</button>
        </article>
        ${followedUsers
          .map(
            (user) => `
              <article class="account-chip${selected === user.username ? " active" : ""}">
                <button class="avatar avatar-${user.avatarTone}" data-action="nav" data-path="/profile/${user.username}" aria-label="${html(user.name)}">${html(user.name.slice(0, 1))}</button>
                <button class="account-name" data-action="following-filter" data-username="${user.username}">
                  <strong>${html(user.name)}</strong>
                  <span>@${html(user.username)}</span>
                </button>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">منشورات المتابَعين</h2>
        <span class="caption">${followedPosts.length}</span>
      </div>
      <div class="grid">
        ${followedPosts.length ? followedPosts.map(renderPostCard).join("") : renderEmpty("لا توجد منشورات جديدة حاليًا", "ارجع لاحقا أو اختر كل الحسابات.")}
      </div>
    </section>
  `;
}

function renderPublicLists(username: string): string {
  const lists = publicListsForUser(username);
  return `
    <div class="grid">
      ${lists.length ? lists.map(renderPublicListCard).join("") : renderEmpty("لا توجد قوائم عامة حتى الآن", "عند نشر تجربة مرتبطة بقائمة عامة ستظهر هنا.")}
    </div>
  `;
}

function renderPublicListsRoute(path: string): RouteResult {
  const username = path.split("/")[2] ?? "";
  const user = userByUsername(username);
  if (!user) return { title: "حساب غير موجود", body: renderMissing(), active: "profile", showBack: true };
  return {
    title: "القوائم",
    subtitle: user.name,
    active: "profile",
    showBack: true,
    body: renderPublicLists(username)
  };
}

function renderPublicListRoute(path: string): RouteResult {
  const parts = path.split("/").filter(Boolean);
  const isOwnPublicList = parts[0] === "profile" && parts[1] === "public-lists";
  const username = isOwnPublicList ? state.profile.username : parts[1] ?? "";
  const listId = isOwnPublicList ? parts[2] ?? "" : parts[3] ?? "";
  const user = username === state.profile.username ? undefined : userByUsername(username);
  const ownerName = user?.name ?? state.profile.name;
  const list = publicListById(listId);
  if (!list || list.ownerUsername !== username || list.purpose !== "publisher_public") {
    return { title: "قائمة غير متاحة", body: renderMissing(), active: "profile", showBack: true };
  }
  const listProducts = list.productIds.map(productById).filter((product): product is Product => Boolean(product));
  const listPosts = list.postIds.map(postById).filter((post): post is Post => Boolean(post));
  const otherLists = publicListsForUser(username).filter((item) => item.id !== list.id);
  return {
    title: list.name,
    subtitle: ownerName,
    active: "profile",
    showBack: true,
    body: `
      <section class="public-list-hero visual-${list.coverTone ?? "cream"}">
        <span class="caption">قائمة عامة للناشر</span>
        <h2 class="section-title">${html(list.name)}</h2>
        <p class="body-copy">${html(list.description)}</p>
        <button class="text-button" data-action="nav" data-path="${username === state.profile.username ? "/profile" : `/profile/${username}`}">فتح ملف الناشر</button>
      </section>
      <section class="section">
        <h2 class="section-title">المنتجات</h2>
        <div class="grid section">
          ${listProducts.length ? listProducts.map((product) => renderProductCard(product, "compact")).join("") : renderEmpty("لا توجد منتجات", "لم يربط الناشر منتجات بهذه القائمة بعد.")}
        </div>
      </section>
      <section class="section">
        <h2 class="section-title">المنشورات</h2>
        <div class="grid section">
          ${listPosts.length ? listPosts.map(renderPostCard).join("") : renderEmpty("لا توجد منشورات", "لم يربط الناشر منشورات بهذه القائمة بعد.")}
        </div>
      </section>
      <section class="section">
        <h2 class="section-title">قوائم أخرى</h2>
        <div class="grid section">
          ${otherLists.length ? otherLists.map(renderPublicListCard).join("") : renderEmpty("لا توجد قوائم أخرى", "هذه هي القائمة العامة الوحيدة حاليا.")}
        </div>
      </section>
    `
  };
}

function renderPublicListCard(list: SavedList): string {
  const thumbnails = list.productIds
    .slice(0, 3)
    .map(productById)
    .filter((product): product is Product => Boolean(product));
  const owner = userByUsername(list.ownerUsername);
  return `
    <article class="list-card public-list-card">
      <div class="list-cover visual-${list.coverTone ?? "cream"}">
        ${thumbnails.length ? thumbnails.map((product) => `<span>${html(product.brand.slice(0, 2))}</span>`).join("") : icon("bookmark")}
      </div>
      <div class="split">
        <div>
          <h2 class="post-title">${html(list.name)}</h2>
          <p class="product-summary">${html(list.description)}</p>
          <span class="caption">${owner ? html(owner.name) : html(state.profile.name)}</span>
        </div>
        <span class="rating-badge">${list.productIds.length + list.postIds.length}</span>
      </div>
      <button class="secondary-button" data-action="nav" data-path="${publicListPath(list)}">فتح القائمة</button>
    </article>
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
  const ownPublicLists = publicListsForUser(state.profile.username);
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
        <div class="stat"><strong>${ownPublicLists.length}</strong><span>قوائم عامة</span></div>
        <div class="stat"><strong>${state.followingUsernames.length}</strong><span>متابعة</span></div>
      </div>
      <div class="button-row section">
        <button class="primary-button" data-action="nav" data-path="/profile/edit">${icon("edit", true)} تعديل</button>
        <button class="secondary-button" data-action="nav" data-path="/settings">${icon("settings", true)} الإعدادات</button>
      </div>
    </section>
    <div class="tabs" role="tablist" aria-label="أقسام حسابي">
      <button class="tab${ui.profileView === "posts" ? " active" : ""}" data-action="profile-view" data-view="posts">منشوراتي</button>
      <button class="tab${ui.profileView === "publicLists" ? " active" : ""}" data-action="profile-view" data-view="publicLists">قوائمي العامة</button>
      <button class="tab${ui.profileView === "saved" ? " active" : ""}" data-action="profile-view" data-view="saved">المحفوظات</button>
    </div>
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">${ui.profileView === "posts" ? "منشوراتي" : ui.profileView === "publicLists" ? "قوائمي العامة" : "المحفوظات"}</h2>
        ${
          ui.profileView === "posts"
            ? `<button class="text-button" data-action="nav" data-path="/create">إضافة</button>`
            : ui.profileView === "publicLists"
              ? `<button class="text-button" data-action="nav" data-path="/profile/public-lists">فتح الكل</button>`
              : `<button class="text-button" data-action="nav" data-path="/profile/saved/lists">قوائم الحفظ</button>`
        }
      </div>
      <div class="grid">
        ${
          ui.profileView === "posts"
            ? ownPosts.length
              ? ownPosts.map(renderPostCard).join("")
              : renderEmpty("لم تنشر بعد", "اكتب تجربة تجريبية لتظهر في ملفك.")
            : ""
        }
        ${
          ui.profileView === "publicLists"
            ? ownPublicLists.length
              ? ownPublicLists.map(renderPublicListCard).join("")
              : renderEmpty("لا توجد قوائم عامة حتى الآن", "اربط منشورا بقائمة عامة عند النشر لتظهر هنا.")
            : ""
        }
        ${ui.profileView === "saved" ? renderSaved() : ""}
      </div>
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
  const userPosts = allPosts().filter((post) => post.author === user.username);
  const lists = publicListsForUser(user.username);
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
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">منشوراته</h2>
          <span class="caption">${userPosts.length}</span>
        </div>
        <div class="grid">${userPosts.length ? userPosts.map(renderPostCard).join("") : renderEmpty("لا توجد منشورات", "لم ينشر هذا الحساب تجارب بعد.")}</div>
      </section>
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">القوائم</h2>
          <button class="text-button" data-action="nav" data-path="/profile/${user.username}/lists">فتح الكل</button>
        </div>
        <div class="grid">${lists.length ? lists.map(renderPublicListCard).join("") : renderEmpty("لا توجد قوائم عامة حتى الآن", "القوائم العامة فقط تظهر للزوار.")}</div>
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
      ${renderInfoPanel("ما أهم تدفق للعرض؟", "ابدأ من العناية بالبشرة، افتح منتج CeraVe، احفظه داخل قائمة شخصية، ثم افتح تجربة مستخدم وأضف تعليقاً.")}
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
      <p class="body-copy">في هذه المرحلة تحفظ رأينا البيانات داخل LocalStorage فقط: الجلسة التجريبية، المحفوظات، القوائم، التعليقات، المسودات، والإعدادات.</p>
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
          ${renderSaveProductButton(product.id)}
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
  const comments = commentsForPost(post);
  return `
    <article class="post-card">
      ${renderPostHeader(post)}
      <div class="split">
        <h3 class="post-title">${html(post.title)}</h3>
        ${renderRating(post.rating)}
      </div>
      <p class="post-body">${html(post.body)}</p>
      ${product ? `<span class="tag">${html(product.name)}</span>` : ""}
      ${renderPublicListChip(post)}
      <div class="button-row">
        <button class="primary-button" data-action="nav" data-path="/post/${post.id}">${icon("message", true)} التعليقات ${comments.length}</button>
        ${renderSavePostButton(post.id)}
      </div>
    </article>
  `;
}

function renderPostHeader(post: Post): string {
  const user = userByUsername(post.author);
  const isOwnPost = post.author === state.profile.username;
  const name = user?.name ?? state.profile.name;
  const tone = user?.avatarTone ?? "yellow";
  const profilePath = user ? `/profile/${user.username}` : "/profile";
  const followed = state.followingUsernames.includes(post.author);
  return `
    <div class="post-header">
      <button class="post-head" data-action="nav" data-path="${profilePath}">
        <span class="avatar avatar-${tone}">${html(name.slice(0, 1))}</span>
        <span class="row-text">
          <strong>${html(name)}</strong>
          <span>@${html(post.author)} · ${html(post.createdAt)}</span>
        </span>
      </button>
      ${
        isOwnPost
          ? ""
          : `<button class="chip follow-chip" data-action="follow-user" data-username="${post.author}">${followed ? "تتم المتابعة" : "متابعة"}</button>`
      }
      <button class="icon-button post-menu-button" data-action="open-post-menu" data-post-id="${post.id}" aria-label="خيارات المنشور">${icon("more")}</button>
    </div>
  `;
}

function renderPublicListChip(post: Post): string {
  const lists = publicListsForPost(post);
  const [primary, ...rest] = lists;
  if (!primary) return "";
  return `
    <button class="chip public-list-chip" data-action="nav" data-path="${publicListPath(primary)}">
      ضمن قائمة: ${html(primary.name)}${rest.length ? ` +${rest.length} قوائم` : ""}
    </button>
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
    const targetLabel = sheet.targetType === "post" ? "المنشور" : "المنتج";
    const lists = personalSavedLists();
    return renderBottomSheet(`
      <h2 class="section-title">إضافة إلى قائمة حفظ</h2>
      <p class="body-copy">اختر قائمة شخصية خاصة لإضافة ${targetLabel} إليها.</p>
      <form class="grid" data-form="add-to-list" data-target-type="${sheet.targetType}" data-target-id="${sheet.targetId}">
        <div class="field">
          <label for="selected-list">اختر قائمة</label>
          <select id="selected-list" name="listId">
            ${lists.map((list) => `<option value="${list.id}">${html(list.name)}</option>`).join("")}
            <option value="__new">إنشاء قائمة جديدة</option>
          </select>
        </div>
        <div class="field">
          <label for="new-list-name">اسم قائمة جديدة</label>
          <input id="new-list-name" name="newListName" placeholder="مثال: منتجات أعود لها" />
        </div>
        <div class="field">
          <label for="new-list-description">وصف اختياري</label>
          <input id="new-list-description" name="newListDescription" placeholder="لماذا تحفظ هذه العناصر؟" />
        </div>
        <button class="primary-button" type="submit">إضافة</button>
      </form>
      <button class="text-button" data-action="nav" data-path="/profile/saved/lists">إدارة قوائم الحفظ</button>
    `);
  }

  if (sheet.kind === "postActions") {
    const post = postById(sheet.postId);
    if (!post) return "";
    const isOwnPost = post.author === state.profile.username;
    return renderBottomSheet(`
      <h2 class="section-title">خيارات المنشور</h2>
      <div class="grid">
        ${
          isOwnPost
            ? `
              <button class="secondary-button" data-action="nav" data-path="/create">${icon("edit", true)} تعديل المنشور</button>
              <button class="danger-button" data-action="delete-post" data-post-id="${post.id}">${icon("trash", true)} حذف المنشور</button>
            `
            : `<button class="danger-button" data-action="report" data-target="post:${post.id}" data-title="${html(post.title)}">${icon("flag", true)} الإبلاغ عن المنشور</button>`
        }
        <button class="secondary-button" data-action="share" data-path="/post/${post.id}">${icon("share", true)} مشاركة المنشور</button>
        <button class="secondary-button" data-action="share" data-path="/post/${post.id}">${icon("share", true)} نسخ الرابط</button>
      </div>
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
    ui.sheet = {
      kind: "addToList",
      targetType: target.dataset.targetType === "post" ? "post" : "product",
      targetId: target.dataset.targetId ?? ""
    };
    render();
    return;
  }

  if (action === "open-post-menu") {
    ui.sheet = { kind: "postActions", postId: target.dataset.postId ?? "" };
    render();
    return;
  }

  if (action === "resend-otp") {
    ui.formError = "";
    toast("تم إرسال رمز تحقق جديد");
    return;
  }

  if (action === "save-product") {
    if (!requireMember()) return;
    const productId = target.dataset.productId ?? "";
    const alreadySaved = state.savedProductIds.includes(productId);
    toggleArray(state.savedProductIds, productId);
    if (alreadySaved) removeTargetFromPersonalLists("product", productId);
    persist();
    if (alreadySaved) {
      toast("تمت إزالة المنتج من الحفظ");
    } else {
      ui.sheet = { kind: "addToList", targetType: "product", targetId: productId };
      toast("تم الحفظ");
    }
    return;
  }

  if (action === "save-post") {
    if (!requireMember()) return;
    const postId = target.dataset.postId ?? "";
    const alreadySaved = state.savedPostIds.includes(postId);
    toggleArray(state.savedPostIds, postId);
    if (alreadySaved) removeTargetFromPersonalLists("post", postId);
    persist();
    if (alreadySaved) {
      toast("تمت إزالة المنشور من الحفظ");
    } else {
      ui.sheet = { kind: "addToList", targetType: "post", targetId: postId };
      toast("تم الحفظ");
    }
    return;
  }

  if (action === "follow-user") {
    if (!requireMember()) return;
    const username = target.dataset.username ?? "";
    const wasFollowing = state.followingUsernames.includes(username);
    toggleArray(state.followingUsernames, username);
    persist();
    toast(wasFollowing ? "تم إلغاء المتابعة" : "تمت المتابعة");
    return;
  }

  if (action === "saved-view") {
    const view = target.dataset.view;
    if (view === "products" || view === "posts" || view === "lists") ui.savedView = view;
    render();
    return;
  }

  if (action === "profile-view") {
    const view = target.dataset.view;
    if (view === "posts" || view === "publicLists" || view === "saved") ui.profileView = view;
    render();
    return;
  }

  if (action === "following-filter") {
    const username = target.dataset.username ?? "all";
    navigate(username === "all" ? "/following" : `/following?user=${encodeURIComponent(username)}`);
    return;
  }

  if (action === "delete-list") {
    const listId = target.dataset.listId ?? "";
    state.savedLists = state.savedLists.filter(
      (list) => !(list.id === listId && list.ownerUsername === state.profile.username && list.purpose === "personal_save")
    );
    persist();
    toast("تم حذف القائمة");
    navigate("/profile/saved/lists");
    return;
  }

  if (action === "remove-list-item") {
    const listId = target.dataset.listId ?? "";
    const targetType = target.dataset.targetType === "post" ? "post" : "product";
    const targetId = target.dataset.targetId ?? "";
    state.savedLists = state.savedLists.map((list) =>
      list.id === listId
        ? {
            ...list,
            productIds: targetType === "product" ? list.productIds.filter((id) => id !== targetId) : list.productIds,
            postIds: targetType === "post" ? list.postIds.filter((id) => id !== targetId) : list.postIds
          }
        : list
    );
    persist();
    toast("تمت إزالة العنصر من القائمة");
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

  if (action === "delete-post") {
    const postId = target.dataset.postId ?? "";
    state.publishedPosts = state.publishedPosts.filter((post) => post.id !== postId);
    state.publicLists = state.publicLists.map((list) => ({ ...list, postIds: list.postIds.filter((id) => id !== postId) }));
    persist();
    ui.sheet = null;
    toast("تم حذف المنشور");
    navigate("/profile");
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
    ui = { toast: "", sheet: null, formError: "", savedView: "products", profileView: "posts" };
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
    const otp = [0, 1, 2, 3].map((index) => submitText(form, `otp-${index}`).replace(/\D/g, "").slice(0, 1)).join("");
    if (otp.length !== 4) {
      ui.formError = "أكمل رمز التحقق المكون من 4 أرقام.";
      render();
      return;
    }
    if (otp !== demoOtp) {
      ui.formError = "رمز التحقق غير صحيح";
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
    const publicListId = resolvePublicListFromForm(form, productId);
    const draft: DraftPost = {
      id: uid("draft"),
      productId,
      rating: Math.max(1, Math.min(10, rating)),
      title,
      body,
      publicListId,
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
    state.savedLists.unshift({
      id: uid("list"),
      ownerUsername: state.profile.username,
      name,
      description,
      purpose: "personal_save",
      visibility: "private",
      coverTone: "cream",
      productIds: [],
      postIds: []
    });
    persist();
    toast("تم إنشاء القائمة");
    return;
  }

  if (formName === "add-to-list") {
    let listId = submitText(form, "listId");
    const targetType = form.dataset.targetType === "post" ? "post" : "product";
    const targetId = form.dataset.targetId ?? "";
    if (listId === "__new" || !personalSavedLists().some((list) => list.id === listId)) {
      const name = submitText(form, "newListName") || "قائمة حفظ جديدة";
      const description = submitText(form, "newListDescription") || "قائمة شخصية خاصة";
      const list: SavedList = {
        id: uid("list"),
        ownerUsername: state.profile.username,
        name,
        description,
        purpose: "personal_save",
        visibility: "private",
        coverTone: "cream",
        productIds: [],
        postIds: []
      };
      state.savedLists.unshift(list);
      listId = list.id;
    }
    const list = state.savedLists.find((item) => item.id === listId && item.purpose === "personal_save");
    if (list && targetType === "product" && !list.productIds.includes(targetId)) list.productIds.push(targetId);
    if (list && targetType === "post" && !list.postIds.includes(targetId)) list.postIds.push(targetId);
    if (targetType === "product" && !state.savedProductIds.includes(targetId)) state.savedProductIds.push(targetId);
    if (targetType === "post" && !state.savedPostIds.includes(targetId)) state.savedPostIds.push(targetId);
    persist();
    ui.sheet = null;
    toast("تمت الإضافة إلى قائمة الحفظ");
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

document.addEventListener("input", (event) => {
  const input = (event.target as HTMLElement).closest<HTMLInputElement>("[data-otp-input]");
  if (!input) return;
  const digits = input.value.replace(/\D/g, "").slice(0, 1);
  input.value = digits;
  ui.formError = "";
  if (digits) {
    const next = otpInputs()[Number(input.dataset.index ?? "0") + 1];
    next?.focus();
  }
  updateOtpSubmit();
});

document.addEventListener("keydown", (event) => {
  const input = (event.target as HTMLElement).closest<HTMLInputElement>("[data-otp-input]");
  if (!input || event.key !== "Backspace" || input.value) return;
  const previous = otpInputs()[Number(input.dataset.index ?? "0") - 1];
  if (previous) {
    previous.value = "";
    previous.focus();
    updateOtpSubmit();
  }
});

document.addEventListener("paste", (event) => {
  const input = (event.target as HTMLElement).closest<HTMLInputElement>("[data-otp-input]");
  if (!input) return;
  event.preventDefault();
  const digits = event.clipboardData?.getData("text").replace(/\D/g, "").slice(0, 4) ?? "";
  otpInputs().forEach((field, index) => {
    field.value = digits[index] ?? "";
  });
  otpInputs()[Math.min(digits.length, 3)]?.focus();
  updateOtpSubmit();
});

window.addEventListener("popstate", render);
window.addEventListener("hashchange", render);

function otpInputs(): HTMLInputElement[] {
  return Array.from(app.querySelectorAll<HTMLInputElement>("[data-otp-input]"));
}

function updateOtpSubmit(): void {
  const inputs = otpInputs();
  const submit = app.querySelector<HTMLButtonElement>("[data-otp-submit]");
  if (!submit || !inputs.length) return;
  submit.disabled = inputs.some((input) => input.value.replace(/\D/g, "").length !== 1);
}

function toggleArray(list: string[], value: string): void {
  if (!value) return;
  const index = list.indexOf(value);
  if (index >= 0) list.splice(index, 1);
  else list.push(value);
}

function removeTargetFromPersonalLists(targetType: "product" | "post", targetId: string): void {
  state.savedLists = state.savedLists.map((list) =>
    targetType === "product"
      ? { ...list, productIds: list.productIds.filter((id) => id !== targetId) }
      : { ...list, postIds: list.postIds.filter((id) => id !== targetId) }
  );
}

function resolvePublicListFromForm(form: HTMLFormElement, productId: string): string | undefined {
  const newListName = submitText(form, "publicListName");
  if (newListName) {
    const list: SavedList = {
      id: uid("public"),
      ownerUsername: state.profile.username,
      name: newListName,
      description: submitText(form, "publicListDescription") || "قائمة عامة تظهر للزوار في الملف الشخصي.",
      purpose: "publisher_public",
      visibility: "public",
      coverTone: "rose",
      productIds: productId ? [productId] : [],
      postIds: []
    };
    state.publicLists.unshift(list);
    return list.id;
  }
  const selectedListId = submitText(form, "publicListId");
  const selected = state.publicLists.find((list) => list.id === selectedListId && list.ownerUsername === state.profile.username);
  if (selected && productId && !selected.productIds.includes(productId)) selected.productIds.push(productId);
  return selected?.id;
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
    publicListId: draft.publicListId,
    rating: draft.rating,
    title: draft.title,
    body: draft.body,
    tags: ["تجربة جديدة"],
    createdAt: "الآن",
    comments: []
  };
  state.publishedPosts.unshift(post);
  if (draft.publicListId) {
    state.publicLists = state.publicLists.map((list) =>
      list.id === draft.publicListId
        ? {
            ...list,
            productIds: list.productIds.includes(post.productId) ? list.productIds : [...list.productIds, post.productId],
            postIds: list.postIds.includes(post.id) ? list.postIds : [...list.postIds, post.id]
          }
        : list
    );
  }
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
