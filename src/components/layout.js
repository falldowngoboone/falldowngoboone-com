import React from 'react';
import { createPortal } from 'react-dom';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

import { fluidSizeBetween } from '../utils';
import { useTheme } from '../context/theme';

import '../../static/fonts.css';

export default function Layout({ location, title, children }) {
  const isHomePage = location.pathname === `${__PATH_PREFIX__}/`;
  const homeLink = <Link to={`/`}>{title}</Link>;
  const { color } = useTheme();

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
            background-color: ${color.TEAL};
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Helvetica, Arial, sans-serif, 'Apple Color Emoji',
              'Segoe UI Emoji', 'Segoe UI Symbol';
            font-size: 100%;
            text-size-adjust: 100%;
          }

          body {
            background: inherit;
            color: ${color.BLACK};
          }

          a {
            color: ${color.FUSCIA};
            text-decoration: none;
            text-decoration: none;
            background-image: linear-gradient(${color.YELLOW}, ${color.YELLOW});
            background-position: 0% 100%;
            background-repeat: no-repeat;
            background-size: 0% 50%;
            transition: background-size 0.3s;

            &:hover,
            &:focus {
              background-size: 100% 50%;
            }

            &:focus {
              outline: none;
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

          & > * + * {
            margin-top: 1.5em;
          }
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
  padding: ${fluidSizeBetween(8, 40, 320, 1440)}
    ${fluidSizeBetween(8, 24, 320, 1440)};
  position: relative;
  z-index: 1; /* layout should be on top of background animation */

  & > * + * {
    margin-top: ${fluidSizeBetween(24, 64, 320, 1440)};
  }

  @media screen and (max-width: 320px) {
    padding: 0.5rem;

    & > * + * {
      margin-top: 1.5rem;
    }
  }

  @media screen and (min-width: 1440px) {
    padding: 2.5rem 1.5rem;

    & > * + * {
      margin-top: 4rem;
    }
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
  background: linear-gradient(
      130deg,
      ${({ theme }) => theme.color.BLACK} 50%,
      ${({ theme }) => theme.color.transparentize(theme.color.BLACK, 0)} 50%
    )
    no-repeat;
  background-position: 300% 100%;
  color: inherit;
  display: inline-block;
  font-weight: 700;
  padding: 1rem 0.75rem;
  text-transform: lowercase;
  transition: background 0.4s, color 0.2s;

  &,
  &:hover,
  &:focus {
    text-decoration: none;
    background-size: 300% 100%;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.color.TEAL};
    background-position: 0 100%;
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
