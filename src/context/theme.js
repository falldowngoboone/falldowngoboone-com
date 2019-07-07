import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';

const theme = {
  color: {
    YELLOW: '#fdff65',
    BLACK: '#494949',
    FUSCIA: '#af15b2',
    TEAL: '#d2fff7',
    transparentize(color, amt = 0) {
      // amt should be between 0 and 1
      const level = parseInt(Math.max(0, Math.min(amt * 100, 100)), 16);
      let hex;

      if (level < 256) {
        hex = Math.abs(level).toString(16);
      } else {
        hex = 0;
      }

      return `${color}${hex.padStart(2, '0')}`;
    },
  },
};

export function useTheme() {
  return theme;
}

export function ThemeProvider(props) {
  console.log(theme);
  return <EmotionThemeProvider theme={theme} {...props} />;
}
