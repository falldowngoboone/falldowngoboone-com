import React from 'react';
import { Link } from 'gatsby';

export default function SiteNav({ title, isHomePage }) {
  const homeLink = <Link to={`/`}>{title}</Link>;

  return (
    <nav>
      <ul>
        <li>{isHomePage ? <h1>{homeLink}</h1> : homeLink}</li>
        <li>
          <Link to="/about/">About</Link>
        </li>
        <li>
          <Link to="/contact/">Contact</Link>
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
