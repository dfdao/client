import { BadgeType } from '@darkforest_eth/ui';
import React, { useState } from 'react';
import styled from 'styled-components';
import { logOut } from '../../../Backend/Network/AccountManager';
import { Badge, BadgeDetails, SpacedBadges } from '../../Components/Badges';
import { Gnosis, Icon, IconType, Twitter } from '../../Components/Icons';
import { WithdrawSilverButton } from '../../Panes/Game/TooltipPanes';

import dfstyles from '../../Styles/dfstyles';
import { useEthConnection, useTwitters } from '../../Utils/AppHooks';
import { truncateAddress } from './PortalUtils';

const mockBadges: BadgeType[] = [BadgeType.Dfdao, BadgeType.Dfdao];

function AccountModal({ setOpen }: { setOpen: (open: boolean) => void }) {
  const connection = useEthConnection();
  const address = connection.getAddress();
  const twitters = useTwitters();
  if (!address) return <></>;
  const twitter = twitters[address];
  const truncatedAddress = truncateAddress(address);
  return (
    <ModalContainer>
      <AccountDetails>
        <button
          style={{ position: 'absolute', top: '12px', right: '12px' }}
          onClick={() => setOpen(false)}
        >
          <Icon type={IconType.X} />
        </button>
        <div style={{ fontSize: '2em' }}>{twitter || truncatedAddress}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconContainer
            onClick={() => {
              window.open(`https://blockscout.com/xdai/optimism/address/${address}`, '_blank');
            }}
          >
            <GnoButton>
              <Gnosis width='24px' height='24px' />
            </GnoButton>
            Account Details
          </IconContainer>
          {twitter && (
            <IconContainer
              onClick={() => {
                window.open(`https://twitter.com/${twitter}`, '_blank');
              }}
            >
              <Twitter width='24px' height='24px' />
              {twitter ? 'Twitter' : 'Connect'}
            </IconContainer>
          )}
        </div>
        <div>
          Badges
          <SpacedBadges badges={mockBadges} />
          {mockBadges.map((badge, idx) => (
            <BadgeDetails type={badge} />
          ))}
        </div>
        <IconContainer onClick={logOut}>Logout</IconContainer>
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
      {open && <AccountModal setOpen={setOpen} />}
      <PaneContainer onClick={() => setOpen(true)}>
        <NamesContainer>{twitter || truncatedAddress}</NamesContainer>
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
  text-align: center;
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
  align-items: center;
  padding: 12px;
  border-radius: 5px;
  position: relative;
  gap: 8px;
`;

const PaneContainer = styled.button`
  padding: 8px;
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 3px;
  gap: 8px;
  justify-self: flex-end;
`;

const IconContainer = styled.button`
  padding: 2px;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 5px;
  padding: 4px;
`;

const NamesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const GnoButton = styled.button`
  // background-color: ${dfstyles.colors.text};
  border-radius: 30%;
  border-color: ${dfstyles.colors.border};
`;
