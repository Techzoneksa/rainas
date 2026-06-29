const arabicFontStack =
  '"Tajawal", "IBM Plex Sans Arabic", "Cairo", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const color = {
  brand: {
    primary: "#FFCE00",
    secondary: "#171717",
    support: "#5B3FD6",
    supportMuted: "#EEEAFE"
  },
  surface: {
    page: "#F8F8F6",
    card: "#FFFFFF",
    muted: "#F1F1ED",
    raised: "#FFFFFF",
    inverse: "#171717"
  },
  text: {
    primary: "#171717",
    secondary: "#5F5F5A",
    muted: "#777770",
    inverse: "#FFFFFF",
    link: "#3478F6"
  },
  border: {
    subtle: "#E6E6E0",
    strong: "#D2D2CB",
    focus: "#5B3FD6"
  },
  status: {
    success: "#2E9D68",
    error: "#D94A4A",
    warning: "#F59E0B",
    info: "#3478F6"
  },
  overlay: {
    scrim: "rgba(23, 23, 23, 0.56)",
    soft: "rgba(23, 23, 23, 0.08)"
  },
  interactive: {
    primary: "#FFCE00",
    primaryHover: "#F0C200",
    neutral: "#FFFFFF",
    neutralHover: "#F1F1ED",
    disabled: "#E6E6E0"
  },
  focus: {
    ring: "rgba(91, 63, 214, 0.38)"
  }
} as const;

export const colors = {
  primaryYellow: color.brand.primary,
  charcoalBlack: color.brand.secondary,
  mainBackground: color.surface.page,
  cardBackground: color.surface.card,
  secondaryBackground: color.surface.muted,
  primaryText: color.text.primary,
  secondaryText: color.text.secondary,
  mutedText: color.text.muted,
  lightBorder: color.border.subtle,
  strongBorder: color.border.strong,
  supportPurple: color.brand.support,
  lightPurple: color.brand.supportMuted,
  success: color.status.success,
  error: color.status.error,
  warning: color.status.warning,
  information: color.status.info
} as const;

export const spacing = {
  "0": "0",
  "2": "2px",
  "4": "4px",
  "6": "6px",
  "8": "8px",
  "12": "12px",
  "16": "16px",
  "20": "20px",
  "24": "24px",
  "32": "32px",
  "40": "40px",
  "48": "48px",
  "64": "64px",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px"
} as const;

export const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  full: "9999px"
} as const;

export const radii = {
  ...radius,
  round: radius.full
} as const;

export const shadow = {
  xs: "0 2px 8px rgba(23, 23, 23, 0.04)",
  sm: "0 8px 22px rgba(23, 23, 23, 0.045)",
  md: "0 12px 30px rgba(23, 23, 23, 0.07)",
  floating: "0 18px 42px rgba(23, 23, 23, 0.1)",
  overlay: "0 24px 64px rgba(23, 23, 23, 0.16)"
} as const;

export const shadows = {
  ...shadow,
  subtle: shadow.sm,
  elevated: shadow.md
} as const;

export const typography = {
  arabic: arabicFontStack,
  fontFamily: {
    arabic: arabicFontStack
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700"
  },
  display: {
    fontSize: "40px",
    lineHeight: "1.15",
    fontWeight: "700"
  },
  heading1: {
    fontSize: "32px",
    lineHeight: "1.2",
    fontWeight: "700"
  },
  heading2: {
    fontSize: "26px",
    lineHeight: "1.25",
    fontWeight: "700"
  },
  heading3: {
    fontSize: "22px",
    lineHeight: "1.3",
    fontWeight: "700"
  },
  bodyLarge: {
    fontSize: "18px",
    lineHeight: "1.8",
    fontWeight: "500"
  },
  body: {
    fontSize: "16px",
    lineHeight: "1.75",
    fontWeight: "500"
  },
  bodySmall: {
    fontSize: "14px",
    lineHeight: "1.7",
    fontWeight: "500"
  },
  label: {
    fontSize: "14px",
    lineHeight: "1.4",
    fontWeight: "700"
  },
  caption: {
    fontSize: "12px",
    lineHeight: "1.5",
    fontWeight: "500"
  }
} as const;

export const motion = {
  duration: {
    fast: "120ms",
    normal: "180ms",
    slow: "260ms"
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1.18)"
  }
} as const;

export const zIndex = {
  base: 0,
  sticky: 20,
  dropdown: 30,
  sheet: 40,
  modal: 50,
  overlay: 50,
  toast: 60
} as const;

export const touch = {
  targetMin: "44px"
} as const;

export const tokens = {
  color,
  colors,
  radius,
  radii,
  spacing,
  shadow,
  shadows,
  typography,
  motion,
  zIndex,
  touch
} as const;
