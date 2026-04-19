/**
 * ACM Brand Design Tokens
 *
 * Single source of truth for all colors, fonts, and spacing.
 * Tailwind classes reference these via CSS custom properties in index.css.
 * JavaScript (e.g., Recharts props) imports from here.
 *
 * To update the brand, change values here AND in the @theme block in index.css.
 * Both must stay in sync — the CSS @theme drives Tailwind utilities,
 * and this file drives JS-rendered elements like SVG charts.
 */

// ── Brand Colors ──
export const colors = {
  teal:        '#00A89D',
  tealDark:    '#008C83',
  tealLight:   '#E6F7F6',
  purple:      '#5B2D8E',
  purpleDark:  '#4A2473',
  purpleLight: '#F0EAF5',
  orange:      '#F7941D',
  red:         '#ED1C24',
  yellow:      '#FFF200',
  green:       '#00A651',
  blue:        '#00AEEF',
  pink:        '#EC008C',
};

// ── Neutral Palette ──
export const neutrals = {
  dark:      '#333333',
  medGray:   '#666666',
  lightGray: '#F5F5F5',
  border:    '#E5E7EB',
  background:'#FAFAFA',
  white:     '#FFFFFF',
};

// ── Rainbow Gradient (ordered stops for the brand bar) ──
export const rainbowStops = [
  { color: colors.red,    offset: '0%' },
  { color: colors.orange, offset: '16%' },
  { color: colors.yellow, offset: '32%' },
  { color: colors.green,  offset: '48%' },
  { color: colors.blue,   offset: '64%' },
  { color: colors.purple, offset: '80%' },
  { color: colors.pink,   offset: '100%' },
];

// ── Chart Theme (Recharts-specific) ──
export const chartTheme = {
  primary:    colors.teal,
  secondary:  colors.purple,
  gridStroke: neutrals.border,
  tickFill:   neutrals.medGray,
  tickSize:   11,
  axisPadding: { top: 5, right: 5, bottom: 5, left: 0 },
  yAxisWidth: 50,
  barRadius:  [3, 3, 0, 0],
};
