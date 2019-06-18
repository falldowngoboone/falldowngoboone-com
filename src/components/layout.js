import React from 'react';
import SiteNav from './site-nav';

import './layout.css';

export default function Layout({ location, title, children }) {
  return (
    <div>
      <header>
        <SiteNav title={title} location={location} />
      </header>
      <main>{children}</main>
      <footer>©{new Date().getFullYear()} Ryan Boone</footer>
    </div>
  );
}
