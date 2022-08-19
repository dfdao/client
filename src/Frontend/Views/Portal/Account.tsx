import React, { useState } from 'react';
import styled from 'styled-components';
import { logOut } from '../../../Backend/Network/AccountManager';
import { Gnosis, Icon, IconType, Twitter } from '../../Components/Icons';
import { WithdrawSilverButton } from '../../Panes/Game/TooltipPanes';

import dfstyles from '../../Styles/dfstyles';
import { useEthConnection, useTwitters } from '../../Utils/AppHooks';
import { truncateAddress } from './PortalUtils';

function AccountModal({}: {}) {
  return (
    <ModalContainer>
      <AccountDetails>
        <span>hello mama</span>
      </AccountDetails>
    </ModalContainer>
  );
}
export function Account() {
  const [open, setOpen] = useState<boolean>(true);
  const connection = useEthConnection();
  const address = connection.getAddress();
  const twitters = useTwitters();
  if (!address) return <></>;
  const twitter = twitters[address];
  const truncatedAddress = truncateAddress(address);

  return (
    <>
      {open && <AccountModal />}
      <PaneContainer>
        <NamesContainer onClick={() => setOpen(true)}>{twitter || truncatedAddress}</NamesContainer>
      </PaneContainer>
    </>
  );
}

const ModalContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccountDetails = styled.div`
  min-width: 50%;
  background: #38383b;
  border: 1px solid #676767;
  color: #dddde9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px;
  border-radius: 5px;
`;

const PaneContainer = styled.div`
  padding: 8px;
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 3px;
  gap: 8px;
  justify-self: flex-end;
`;

const IconContainer = styled.div`
  padding: 2px;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 2px;
`;

const NamesContainer = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const GnoButton = styled.button`
  // background-color: ${dfstyles.colors.text};
  border-radius: 30%;
  border-color: ${dfstyles.colors.border};
`;
