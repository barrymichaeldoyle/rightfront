import { create } from "storybook/theming";

export default create({
  base: "dark",

  // Branding
  brandTitle: "RightFront Storybook",
  brandUrl: "https://rightfront.app",
  brandTarget: "_self",
  brandImage: undefined, // Add logo path if you have one

  // Colors matching your app (slate-950 theme)
  colorPrimary: "#2563eb", // blue-600 - primary actions
  colorSecondary: "#3b82f6", // blue-500 - secondary actions

  // UI colors
  appBg: "#020617", // slate-950 - main background
  appContentBg: "#020617", // slate-950 - content background
  appPreviewBg: "#020617", // slate-950 - preview/canvas background
  appBorderColor: "#1e293b", // slate-800 - borders
  appBorderRadius: 12, // matches your borderRadius: "12px"

  // Text colors
  textColor: "#e2e8f0", // slate-200 - primary text
  textInverseColor: "#020617", // slate-950 - inverse text
  textMutedColor: "#94a3b8", // slate-400 - secondary text

  // Bar colors (toolbar, sidebar)
  barBg: "#0f172a", // slate-900 - bar background
  barTextColor: "#e2e8f0", // slate-200 - bar text
  barSelectedColor: "#2563eb", // blue-600 - selected items
  barHoverColor: "#1e293b", // slate-800 - hover state

  // Input colors
  inputBg: "#1e293b", // slate-800 - input background
  inputBorder: "#334155", // slate-700 - input border
  inputTextColor: "#e2e8f0", // slate-200 - input text
  inputBorderRadius: 8, // slightly smaller for inputs

  // Button colors
  buttonBg: "#1e293b", // slate-800
  buttonBorder: "#334155", // slate-700
  booleanBg: "#1e293b", // slate-800
  booleanSelectedBg: "#2563eb", // blue-600

  // Typography
  fontBase: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontCode: 'ui-monospace, "SF Mono", Monaco, "Cascadia Code", monospace',
});
