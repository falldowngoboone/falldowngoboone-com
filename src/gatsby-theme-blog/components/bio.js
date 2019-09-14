/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import { Styled, css, Flex } from 'theme-ui';
import BioContent from './bio-content.js';

const Bio = () => {
  const data = useStaticQuery(bioQuery);
  const {
    site: {
      siteMetadata: { author },
    },
    avatar,
  } = data;

  return (
    <Flex css={css({ mb: 4, flexWrap: 'wrap' })}>
      {avatar ? (
        <Image
          fixed={avatar.childImageSharp.fixed}
          alt={author}
          css={css({
            mr: 2,
            mb: 2,
            width: 48,
            borderRadius: 99999,
            flexShrink: 0,
          })}
        />
      ) : (
        <div
          css={css({
            mr: 2,
            mb: 0,
            width: 48,
            borderRadius: 99999,
          })}
          role="presentation"
        />
      )}
      <Styled.div
        css={css({
          maxWidth: '45ch',
        })}
      >
        <BioContent />
      </Styled.div>
    </Flex>
  );
};

const bioQuery = graphql`
  query {
    site {
      siteMetadata {
        author
      }
    }
    avatar: file(absolutePath: { regex: "/avatar.(jpeg|jpg|gif|png)/" }) {
      childImageSharp {
        fixed(width: 48, height: 48) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

export default Bio;
