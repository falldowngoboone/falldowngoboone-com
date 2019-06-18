import React from 'react';
import { Link } from 'gatsby';

export default function SiteNav({ title, location }) {
  const rootPath = `${__PATH_PREFIX__}/`;
  let homeLink;

  if (location.pathname === rootPath) {
    homeLink = (
      <h1>
        <Link to={`/`}>{title}</Link>
      </h1>
    );
  } else {
    homeLink = <Link to={`/`}>{title}</Link>;
  }

  return (
    <nav>
      <ul>
        <li>{homeLink}</li>
        <li>
          <Link to="about">About</Link>
        </li>
        <li>
          <Link to="contact">Contact</Link>
        </li>
        <li>
          <a
            href="https://twitter.com/therealboone"
            target="__blank"
            rel="nofollow noopener"
          >
            Twitter
          </a>
        </li>
        <li>
          <a
            href="https://github.com/falldowngoboone"
            target="__blank"
            rel="nofollow noopener"
          >
            Github
          </a>
        </li>
      </ul>
    </nav>
  );
}
