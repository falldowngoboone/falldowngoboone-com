import React from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

export default function SiteNav() {
  return (
    <nav>
      <ul
        css={css`
          list-style-type: none;
          display: flex;
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
  text-decoration: none;
  text-transform: lowercase;
  transition: background 0.4s, color 0.2s;

  &:hover {
    color: #d2fff7;
    background-position: 0 100%;
  }
`;

function NavLink({ children, to, activeClassName, partiallyActive, ...other }) {
  // Tailor the following test to your environment.
  // This example assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const internal = /^\/(?!\/)/.test(to);

  // Use Gatsby Link for internal links, and <a> for others
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
