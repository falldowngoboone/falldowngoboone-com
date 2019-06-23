import React from 'react';
import SiteNav from './site-nav';
import { Global, css } from '@emotion/core';

import '../../static/fonts.css';

export default function Layout({ location, title, children }) {
  return (
    <div>
      <Global
        styles={css`
          html {
            text-size-adjust: 100%;
            font-size: 100%;
          }

          body {
            margin: 0;
            background-color: rgb(179, 255, 242);
            color: #494949;
            font-family: Helvetica, Arial, sans-serif;
          }
        `}
      />
      <header>
        <SiteNav
          title={title}
          isHomePage={location.pathname === `${__PATH_PREFIX__}/`}
        />
      </header>
      <main
        css={css`
          max-width: 1200px;
          padding-left: 24px;
          padding-right: 24px;
          margin-left: auto;
          margin-right: auto;
        `}
      >
        {children}
      </main>
      <footer>©{new Date().getFullYear()} Ryan Boone</footer>
    </div>
  );
}
