import { EthAddress } from '@darkforest_eth/types';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { getAllTwitters } from '../../Backend/Network/UtilityServerAPI';
import { LobbyAdminTools } from '../../Backend/Utils/LobbyAdminTools';
import { Link, Spacer } from '../Components/CoreUI';
import { Sidebar } from '../Components/Sidebar';
import { MinimapPane } from '../Panes/Lobbies/MinimapPane';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import {
  LobbyAction,
  LobbyConfigAction,
  LobbyConfigState,
  LobbyInitializers,
} from '../Panes/Lobbies/Reducer';

export function LobbyConfirmPage({
  updateConfig,
  lobbyAdminTools,
  minimapConfig,
  config,
  onUpdate,
  createDisabled,
  root,
  createLobby,
  ownerAddress,
  lobbyTx,
}: {
  updateConfig: React.Dispatch<LobbyAction>;
  config: LobbyConfigState;
  lobbyAdminTools: LobbyAdminTools | undefined;
  createDisabled: boolean;
  root: string;
  minimapConfig: MinimapConfig | undefined;
  onUpdate: (action: LobbyConfigAction) => void;
  createLobby: (config: LobbyInitializers) => void;
  ownerAddress: EthAddress;
  lobbyTx: string | undefined;
}) {
  return (
    <Container>
      <Sidebar previousPath={root} title={'← Choose Map'}>
        <span>Confirm your map configuration before creating your DF Arena Universe.</span>
        <Spacer height={24} />
        <h1>List of staged planets goes here</h1>
      </Sidebar>
      <MainContent>
        <MainContentInner>
          <Spacer height={64} />
          <MinimapPane
            minimapConfig={minimapConfig}
            onUpdate={onUpdate}
            created={!!lobbyAdminTools}
            displayConfig={{
              size: {
                width: '600px',
                height: '600px',
              },
              keys: true,
            }}
          />
        </MainContentInner>
      </MainContent>
      <MapContainer>
        <Title>Confirm Map</Title>
        <Spacer height={32} />
        <span>
          Creating a map for{' '}
          {config.ADMIN_PLANETS.displayValue?.filter((p) => p?.isSpawnPlanet).length || 0} players.
          There are{' '}
          {config.ADMIN_PLANETS.displayValue?.filter((p) => p?.isTargetPlanet).length || 0} target
          planets.
          <br />
          Once your world is created, your custom planets will automatically be created on-chain and
          you can enter the universe!
        </span>
        <Spacer height={24} />
        <h1>Lobby buttons go here</h1>
      </MapContainer>
    </Container>
  );
}

const Title = styled.h1`
  font-size: 24px;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: left;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  align-items: stretch;
`;

const MainContent = styled.div`
  position: relative;
  overflow: auto;
  place-items: stretch;
  display: flex;
  flex-shrink: initial;
  flex-basis: initial;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`;

const MainContentInner = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
  width: 100%;
  max-width: 640px;
  // margin: 0 24px;
  margin: 0 auto;
`;

const MapContainer = styled.div`
  display: flex;
  margin: 0 32px;
  flex-direction: column;
  padding-top: 64px;
`;
