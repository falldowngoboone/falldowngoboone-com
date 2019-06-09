import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

export default function Bio() {
  const { site } = useStaticQuery(bioQuery);
  const { author, social } = site.siteMetadata;

  return (
    <div>
      <p>
        <strong>{author}</strong> lives in Fort Worth, TX, and works as a
        developer at The Container Store.
        {` `}
        <a href={`https://twitter.com/${social.twitter}`}>
          You should follow him on Twitter
        </a>
      </p>
    </div>
  );
}

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`;
