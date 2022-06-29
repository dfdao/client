import { EthAddress } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { logOut } from '../../../Backend/Network/AccountManager';
import { getAllTwitters } from '../../../Backend/Network/UtilityServerAPI';
import { Btn } from '../../Components/Btn';
import { Dropdown } from '../../Components/Dropdown';
import { TwitterLink } from '../../Components/Labels/Labels';
import { TextPreview } from '../../Components/TextPreview';

import dfstyles from '../../Styles/dfstyles';
import { useTwitters } from '../../Utils/AppHooks';
import { truncateAddress } from './PortalUtils';
// import { MinimalButton } from './PortalMainView';

function AccountDetails({ address }: { address: EthAddress }) {
  const twitters = useTwitters();
  const truncatedAddress = truncateAddress(address);
  return (
    <NamesContainer>
      <Large>
        {twitters[address] ? (
          <>
            <TwitterLink twitter={twitters[address]} />
            <TextPreview text={address} focusedWidth={'200px'} unFocusedWidth={'120px'} />
          </>
        ) : (
          // <TextPreview text={truncatedAddress} focusedWidth={'200px'} unFocusedWidth={'150px'} />
          <span>{truncatedAddress}</span>
        )}
      </Large>
    </NamesContainer>
  );
}

export function Account({ address }: { address: EthAddress }) {
  const [dropdownActive, setDropdownActive] = useState<boolean>(false);
  return (
    <div style={{ position: 'relative' }}>
      <PaneContainer onClick={() => setDropdownActive(!dropdownActive)}>
        <AccountDetails address={address} />
      </PaneContainer>
      <Dropdown open={dropdownActive} items={[{ label: 'Log out', action: logOut }]}></Dropdown>
    </div>
  );
}

// const Button = styled(MinimalButton)`
//   background: ${dfstyles.colors.backgroundlighter};
//   border: 1px solid ${dfstyles.colors.borderDarker};
// `;

const PaneContainer = styled.div`
  padding: 8px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  // border: 1px solid ${dfstyles.colors.borderDarker};
  width: 100%;
  border-radius: 3px;
  gap: 8px;
  cursor: pointer;
`;

const NamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Large = styled.div`
  // font-size: 1.25em;
`;

const ButtonContainer = styled.div`
  position: absolute;
  right: 8px;
  height: calc(49px - 16px);
`;
