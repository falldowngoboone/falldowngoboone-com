import React from 'react';

import { ThemeProvider } from './src/context/theme';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);
