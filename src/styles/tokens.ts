/**
 * Career Intelligence Design & Motion Tokens
 * System: Editorial Career Intelligence Platform (Spacious & Calm Evolution)
 * Preserves Brand Identity: Editorial Ivory Canvas, Charcoal Ink, Flame Orange Accent.
 */

export const TOKENS = {
  // Centralized Spacing System (Multiples of 4/8: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96px)
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  // Semantic Layout Spacing
  layout: {
    pagePaddingX: 'clamp(1.5rem, 3.5vw, 3.25rem)',
    pagePaddingY: 'clamp(2rem, 3.5vw, 3.5rem)',
    sectionGap: 'clamp(2.5rem, 4vw, 4.5rem)',
    cardPadding: 'clamp(1.5rem, 2.2vw, 2.25rem)',
    cardPaddingLg: 'clamp(2rem, 3vw, 3rem)',
    cardPaddingSm: '1.25rem',
    cardGap: '1.5rem',
    contentMaxWidth: '1360px',
  },

  // Refined Color Palette
  colors: {
    canvas: '#FAF9F5',
    canvasWarm: '#F5F2EA',
    canvasDeep: '#EFECE2',
    paper: '#FFFFFF',
    paperSubtle: '#F7F6F1',
    paperElevated: '#FFFFFF',
    paperInset: '#F3EFE6',

    border: '#E8E4DA',
    borderSubtle: 'rgba(24, 24, 27, 0.06)',
    borderStrong: '#D3CEC2',

    ink: {
      primary: '#14171A',    // Dominant titles & primary metrics
      secondary: '#454F5B',  // Body copy & descriptions
      muted: '#6E7A8A',      // Supporting labels & secondary metadata
      ghost: '#9AA5B5',      // Subdued timestamps & telemetry labels
      inverse: '#FDFDFC',
    },

    accent: {
      flame: '#FF5A1F',       // Editorial Flame Orange
      flameHover: '#E64A12',
      flameTint: 'rgba(255, 90, 31, 0.07)',
      flameBorder: 'rgba(255, 90, 31, 0.22)',
      cyan: '#0284C7',
      emerald: '#059669',
      emeraldTint: 'rgba(5, 150, 105, 0.08)',
      amber: '#D97706',
      amberTint: 'rgba(217, 119, 6, 0.08)',
      crimson: '#DC2626',
      rose: '#E11D48',
    },

    obsidian: {
      950: '#0B0D12',
      900: '#121620',
      850: '#181C26',
      800: '#1F2432',
      700: '#333B4E',
    },
  },

  // Typography System
  typography: {
    fonts: {
      editorial: `'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif`,
      serif: `'Newsreader', Georgia, serif`,
      sans: `'Inter', system-ui, -apple-system, sans-serif`,
      mono: `'JetBrains Mono', 'IBM Plex Mono', monospace`,
      display: `'Space Grotesk', 'Inter', sans-serif`,
    },
    scale: {
      heroDisplay: 'clamp(2.5rem, 4.2vw, 4rem)',
      metricDominant: 'clamp(3.5rem, 5vw, 4.75rem)',
      sectionTitle: 'clamp(1.5rem, 2.2vw, 2rem)',
      cardTitle: '1.25rem',
      lead: '1.0625rem',
      body: '0.9375rem',
      caption: '0.75rem',
      micro: '0.6875rem',
    },
  },

  // Border Radius
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    '2xl': '24px',
    full: '9999px',
  },

  // Premium Multi-Layer Soft Shadows (subtle & calm, no harsh dark borders)
  shadows: {
    subtle: '0 1px 3px rgba(20, 23, 26, 0.03), 0 4px 12px rgba(20, 23, 26, 0.02)',
    card: '0 1px 4px rgba(20, 23, 26, 0.04), 0 8px 24px -4px rgba(20, 23, 26, 0.04)',
    elevated: '0 4px 20px -2px rgba(20, 23, 26, 0.06), 0 1px 3px rgba(20, 23, 26, 0.02)',
    hover: '0 12px 36px -6px rgba(20, 23, 26, 0.08), 0 4px 12px -2px rgba(20, 23, 26, 0.03)',
  },

  motion: {
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    duration: {
      fast: '140ms',
      base: '260ms',
      slow: '450ms',
    },
  },
};
