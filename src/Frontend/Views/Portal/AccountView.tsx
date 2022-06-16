import { EthAddress, ModalName, Planet, PlanetType, TooltipName } from '@darkforest_eth/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { logOut } from '../../../Backend/Network/AccountManager';
import { getAllTwitters } from '../../../Backend/Network/UtilityServerAPI';
import { Btn } from '../../Components/Btn';
import { TwitterLink } from '../../Components/Labels/Labels';
import { TextPreview } from '../../Components/TextPreview';

import dfstyles, { PortalButton } from '../../Styles/dfstyles';

function Account({ address }: { address: EthAddress }) {
  const [twitter, setTwitter] = useState<string | undefined>();

  useEffect(() => {
    getAllTwitters().then((t) => {
      console.log(t);
      console.log(`twitter: for ${address}`, t[address])
      setTwitter(t[address]);
    });
  }, []);

  useEffect(() => {
    console.log(`twitter: ${twitter}`);
  }, [twitter]);
  return (
    <NamesContainer>
      <Large>
        {twitter ? (
          <TwitterLink twitter={twitter} />
        ) : (
          <TextPreview text={address} focusedWidth={'200px'} unFocusedWidth={'150px'} />
        )}
      </Large>
      <TextPreview text={address} focusedWidth={'200px'} unFocusedWidth={'120px'} />
    </NamesContainer>
  );
}


export function AccountView({ address }: { address: EthAddress }) {
  return (
    <PaneContainer>
      <Account address={address} />
      <Btn variant = {'portal'} onClick={logOut}>Log out</Btn>

    </PaneContainer>
  );
}

const PaneContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: left;
  border: 1px solid ${dfstyles.colors.border};
  background: rgba(255, 255, 255, 0.04);
  width: 100%;
  padding: 1em;
  border-radius: 10px;
`;

const NamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Large = styled.div`
  font-size: 1.25em;
`;
