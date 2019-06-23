import React from 'react';

const theme = {
  colors: {
    green: 'green',
  },
};

const ThemeContext = React.createContext();

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      '`useTheme` can only be used in a child of <ThemeProvider>'
    );
  }

  return context;
}

export function ThemeProvider(props) {
  return <ThemeContext.Provider value={theme} {...props} />;
}
