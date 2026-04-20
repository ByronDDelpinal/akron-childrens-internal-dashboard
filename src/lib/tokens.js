/**
 * ACM Brand Design Tokens
 *
 * Single source of truth for all colors used in JavaScript-rendered
 * elements (e.g., Recharts charts, programmatic avatar colors).
 *
 * Tailwind utilities are driven by the @theme block in index.css.
 * Both must stay in sync.
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

// ── Chart Theme (Recharts-specific) ──
export const chartTheme = {
  primary:    colors.teal,
  secondary:  colors.purple,
  gridStroke: '#E5E7EB',
  tickFill:   '#666666',
  tickSize:   11,
  axisPadding: { top: 5, right: 5, bottom: 5, left: 0 },
  yAxisWidth: 50,
  barRadius:  [3, 3, 0, 0],
};
