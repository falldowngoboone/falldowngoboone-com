import React from 'react';
import { createPortal } from 'react-dom';
import SiteNav from './site-nav';
import { Global, css } from '@emotion/core';
import { Link } from 'gatsby';

import '../../static/fonts.css';

export default function Layout({ location, title, children }) {
  const isHomePage = location.pathname === `${__PATH_PREFIX__}/`;
  const homeLink = <Link to={`/`}>{title}</Link>;

  return (
    <div
      css={css`
        position: relative;
        z-index: 1; /* layout should be on top of background animation */
      `}
    >
      <Global
        styles={css`
          *,
          *::before,
          *::after {
            box-sizing: inherit;
            margin: 0;
          }

          html,
          body {
            height: 100%;
          }

          html {
            background-color: #d2fff7;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Helvetica, Arial, sans-serif, 'Apple Color Emoji',
              'Segoe UI Emoji', 'Segoe UI Symbol';
            font-size: 100%;
            text-size-adjust: 100%;
          }

          body {
            background-color: inherit;
            color: #494949;
          }
        `}
      />
      <BackgroundAnimation />
      <header
        css={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        `}
      >
        {isHomePage ? <h1>{homeLink}</h1> : homeLink}
        <SiteNav />
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

// base-level support is mix-blend-mode: screen;
function BackgroundAnimation() {
  const canvasRef = React.useRef(null);

  if (canvasRef.current) {
    console.log(canvasRef.current);
  }

  return typeof document !== 'undefined'
    ? createPortal(
        <canvas
          ref={el => (canvasRef.current = el)}
          css={css`
            background: black;
            mix-blend-mode: screen;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          `}
        ></canvas>,
        document.body
      )
    : null;
}
