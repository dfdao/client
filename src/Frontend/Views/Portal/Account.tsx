import { BadgeType } from '@darkforest_eth/ui';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { logOut } from '../../../Backend/Network/AccountManager';
import { Badge, BadgeDetails, SpacedBadges } from '../../Components/Badges';
import { Btn } from '../../Components/Btn';
import { Gnosis, Icon, IconType, Twitter } from '../../Components/Icons';
import { WithdrawSilverButton } from '../../Panes/Game/TooltipPanes';

import dfstyles from '../../Styles/dfstyles';
import { useEthConnection, useTwitters } from '../../Utils/AppHooks';
import { TiledTable } from '../TiledTable';
import { truncateAddress } from './PortalUtils';

const mockBadges: BadgeType[] = [
  BadgeType.Dfdao,
  BadgeType.Dfdao,
  BadgeType.Dfdao,
  BadgeType.Dfdao,
  BadgeType.Dfdao,
  BadgeType.Dfdao,
  BadgeType.Dfdao,
  BadgeType.Dfdao,
  BadgeType.Dfdao,
];

function AccountModal({ setOpen }: { setOpen: (open: boolean) => void }) {
  const connection = useEthConnection();
  const address = connection.getAddress();
  const twitters = useTwitters();
  if (!address) return <></>;
  const twitter = twitters[address];
  const truncatedAddress = truncateAddress(address);

  const badgeElements = useMemo(
    () => mockBadges.map((badge, idx) => <BadgeDetails type={badge} key={`badge-${idx}`} />),
    [mockBadges]
  );
  return (
    <ModalContainer>
      <AccountDetails>
        <AccountContent>
          <button
            style={{ position: 'absolute', top: '12px', right: '12px' }}
            onClick={() => setOpen(false)}
          >
            <Icon type={IconType.X} />
          </button>
          <div style={{ fontSize: '2em' }}>{twitter || truncatedAddress}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Btn
              onClick={() => {
                window.open(`https://blockscout.com/xdai/optimism/address/${address}`, '_blank');
              }}
            >
              <Gnosis width='24px' height='24px' />
              Account Details
            </Btn>
            {twitter && (
              <Btn
                onClick={() => {
                  window.open(`https://twitter.com/${twitter}`, '_blank');
                }}
              >
                <Twitter width='24px' height='24px' />
                {twitter ? 'Twitter' : 'Connect'}
              </Btn>
            )}
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <TiledTable items={badgeElements} paginated={true} title='Your Badges' />
          </div>
        </AccountContent>
        <Footer>
          <Btn onClick={logOut}>Logout</Btn>
        </Footer>
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
      <PaneContainer onClick={() => setOpen(true)}>{twitter || truncatedAddress}</PaneContainer>
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

const AccountContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const AccountDetails = styled.div`
  min-width: clamp(40%, 50%, 60%);
  height: 60%;
  background: #38383b;
  border: 1px solid #676767;
  color: #dddde9;
  display: flex;
  flex-direction: column;
  padding: 12px;
  justify-content: space-between;
  border-radius: 5px;
  position: relative;
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

const Footer = styled.div`
  width: 100%;
  border-top: solid 1px #676767;
  display: flex;
  padding-top: 12px;
`;
