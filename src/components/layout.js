import React from 'react';
import { createPortal } from 'react-dom';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

import { fluidSizeBetween } from '../utils';

import '../../static/fonts.css';

export default function Layout({ location, title, children }) {
  const isHomePage = location.pathname === `${__PATH_PREFIX__}/`;
  const homeLink = <Link to={`/`}>{title}</Link>;

  return (
    <Page>
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
            background: inherit;
            color: #494949;
          }

          a {
            color: #af15b2;
            text-decoration: none;
            position: relative;

            &::after {
              content: '';
              display: block;
              position: absolute;
              width: 100%;
              height: 50%;
              left: 0;
              bottom: 0;
              background-color: #fdff65;
              mix-blend-mode: multiply;
              transform: scaleX(0);
              transform-origin: bottom left;
              transition: transform 0.3s;
            }

            &:hover::after {
              transform: scaleX(1);
            }
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
          max-width: 1024px;
          margin-left: auto;
          margin-right: auto;
        `}
      >
        {children}
      </main>
      <footer>©{new Date().getFullYear()} Ryan Boone</footer>
    </Page>
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

const Page = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1448px;
  padding-left: ${fluidSizeBetween(8, 24, 320, 800)};
  padding-right: ${fluidSizeBetween(8, 24, 320, 800)};
  position: relative;
  z-index: 1; /* layout should be on top of background animation */

  @media screen and (max-width: 320) {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  @media screen and (min-width: 800) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

function SiteNav() {
  return (
    <nav>
      <ul
        css={css`
          display: flex;
          list-style-type: none;
          padding: 0;
        `}
      >
        <li>
          <NavLink to="/about/">About</NavLink>
        </li>
        <li>
          <NavLink to="/contact/">Contact</NavLink>
        </li>
        <li>
          <NavLink
            to="https://twitter.com/therealboone"
            target="__blank"
            rel="nofollow noopener"
          >
            Twitter
          </NavLink>
        </li>
        <li>
          <NavLink
            to="https://github.com/falldowngoboone"
            target="__blank"
            rel="nofollow noopener"
          >
            Github
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

const StyledLink = styled.a`
  background: linear-gradient(130deg, #494949 50%, #49494900 50%) no-repeat;
  background-position: 300% 100%;
  background-size: 300% 100%;
  color: inherit;
  display: inline-block;
  font-weight: 700;
  padding: 1rem 0.75rem;
  text-transform: lowercase;
  transition: background 0.4s, color 0.2s;

  &,
  &:hover {
    text-decoration: none;
  }

  &:hover {
    color: #d2fff7;
    background-position: 0 100%;
  }

  &::after {
    content: none;
  }
`;

function NavLink({ children, to, activeClassName, partiallyActive, ...other }) {
  const internal = /^\/(?!\/)/.test(to);

  if (internal) {
    return (
      <StyledLink
        as={Link}
        to={to}
        activeClassName={activeClassName}
        partiallyActive={partiallyActive}
        {...other}
      >
        {children}
      </StyledLink>
    );
  }
  return (
    <StyledLink href={to} {...other}>
      {children}
    </StyledLink>
  );
}
