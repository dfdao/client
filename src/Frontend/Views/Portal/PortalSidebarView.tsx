import { EthAddress, ModalName } from '@darkforest_eth/types';
import React from 'react';
import styled from 'styled-components';
import dfstyles from '../../Styles/dfstyles';
import { Text } from '../../Components/Text';
import { Account } from './Account';
import { Link } from 'react-router-dom';
import { ArenaPortalButton } from './PortalHomeView';

export function PortalSidebarView({ playerAddress }: { playerAddress: EthAddress }) {
  return (
    <SidebarContainer>
      <Text style={{ fontSize: '1.5em', textTransform: 'uppercase' }}>Dark Forest Arena</Text>
      <Account address={playerAddress} />
      <Link style={{ width: '100%' }} to={`/arena/`} target='blank'>
        <ArenaPortalButton secondary>New Arena</ArenaPortalButton>
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
