import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { fluidSizeBetween } from '../utils';

const HomePageBio = styled.p`
  min-height: 0vw;
  text-align: center;
  font-size: ${fluidSizeBetween(16, 32, 320, 1440)};
  max-width: 45ch;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  font-family: 'BwDarius-Bold', Constantia, 'Lucida Bright', Lucidabright,
    'Lucida Serif', Lucida, 'DejaVu Serif', 'Bitstream Vera Serif',
    'Liberation Serif', Georgia, serif;

  @media screen and (max-width: 320px) {
    font-size: 1rem;
  }

  @media screen and (min-width: 1440px) {
    font-size: 2rem;
  }
`;

export default function Bio({ isHomePage }) {
  return isHomePage ? (
    <HomePageBio>
      <BioInner />
    </HomePageBio>
  ) : (
    <p>
      <BioInner />
    </p>
  );
}

function BioInner() {
  return (
    <>
      Hi. My name is Ryan. I’m a front-end developer and designer based in Fort
      Worth, TX. I currently help make the space that comes from{' '}
      <a href="https://www.containerstore.com/welcome.htm" target="_blank">
        The{' '}
        <span
          css={css`
            white-space: nowrap;
          `}
        >
          Container Store
        </span>
      </a>
      .
    </>
  );
}
