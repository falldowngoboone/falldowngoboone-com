import React from 'react';
import styled from '@emotion/styled';

const HomePageBio = styled.p`
  text-align: center;
  font-size: 44px;
  font-family: 'BwDarius-Bold', Helvetica;
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
  return 'Hi. My name is Ryan. I’m a front-end developer and designer based in Fort Worth, TX. I currently help make the space that comes from The Container Store.';
}
