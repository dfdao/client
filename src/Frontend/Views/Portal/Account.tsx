import { EthAddress } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { logOut } from '../../../Backend/Network/AccountManager';
import { getAllTwitters } from '../../../Backend/Network/UtilityServerAPI';
import { Btn } from '../../Components/Btn';
import { TwitterLink } from '../../Components/Labels/Labels';
import { TextPreview } from '../../Components/TextPreview';

import dfstyles from '../../Styles/dfstyles';
import { useTwitters } from '../../Utils/AppHooks';
import { MinimalButton } from './PortalMainView';

function AccountDetails({ address }: { address: EthAddress }) {
  const twitters = useTwitters();
  return (
    <NamesContainer>
      <Large>
        {twitters[address] ? (
          <>
            <TwitterLink twitter={twitters[address]} />
            <TextPreview text={address} focusedWidth={'200px'} unFocusedWidth={'120px'} />
          </>
        ) : (
          <TextPreview text={address} focusedWidth={'200px'} unFocusedWidth={'150px'} />
        )}
      </Large>
    </NamesContainer>
  );
}

export function Account({ address }: { address: EthAddress }) {
  return (
    <PaneContainer>
      <AccountDetails address={address} />
      <ButtonContainer>
        <MinimalButton onClick={logOut}>Log out</MinimalButton>
      </ButtonContainer>
    </PaneContainer>
  );
}

const PaneContainer = styled.div`
  padding: 1em;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${dfstyles.colors.border};
  width: 100%;
  border-radius: 6px;
  gap: 8px;
`;

const NamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Large = styled.div`
  font-size: 1.25em;
`;

const ButtonContainer = styled.div`
  position: absolute;
  right: 8px;
  height: calc(49px - 16px);
`;
