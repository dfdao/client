import { EthAddress, ModalName } from '@darkforest_eth/types';
import React from 'react';
import styled from 'styled-components';
import dfstyles, { PortalButton } from '../../Styles/dfstyles';
import { Text } from '../../Components/Text';
import { AccountView } from './AccountView';
import { Btn } from '../../Components/Btn';
import { Link } from 'react-router-dom';

export function PortalSidebarView({ playerAddress }: { playerAddress: EthAddress }) {
  return (
    <SidebarContainer>
      <Text style={{ fontSize: '1.5em' }}>Dark Forest Arena</Text>
      <AccountView address={playerAddress} />
      <Link style={{ width: '100%' }} to={`/arena/`} target='blank'>
        <Btn variant='portal' size='stretch'>
          Design an Arena
        </Btn>
      </Link>
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 16px 12px;
  box-sizing: border-box;
  z-index: 10;
  overflow-y: auto;
  width: 246px;
  gap: 15px;
`;
