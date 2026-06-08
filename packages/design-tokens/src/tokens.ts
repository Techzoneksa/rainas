export const colors = {
  primaryYellow: "#FFCE00",
  charcoalBlack: "#171717",
  mainBackground: "#F8F8F6",
  cardBackground: "#FFFFFF",
  secondaryBackground: "#F1F1ED",
  primaryText: "#171717",
  secondaryText: "#6B6B66",
  mutedText: "#9A9A94",
  lightBorder: "#E6E6E0",
  strongBorder: "#D2D2CB",
  supportPurple: "#5B3FD6",
  lightPurple: "#EEEAFE",
  success: "#2E9D68",
  error: "#D94A4A",
  warning: "#F59E0B",
  information: "#3478F6"
} as const;

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  round: "999px"
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px"
} as const;

export const shadows = {
  subtle: "0 8px 22px rgba(23, 23, 23, 0.045)",
  elevated: "0 12px 30px rgba(23, 23, 23, 0.07)"
} as const;

export const typography = {
  arabic:
    '"IBM Plex Sans Arabic", "Tajawal", "Cairo", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  weights: {
    regular: "400",
    medium: "500",
    bold: "700"
  }
} as const;

export const zIndex = {
  base: 0,
  sticky: 20,
  overlay: 50,
  toast: 60
} as const;

export const tokens = {
  colors,
  radii,
  spacing,
  shadows,
  typography,
  zIndex
} as const;
