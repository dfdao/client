import { EthAddress } from '@darkforest_eth/types';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { getAllTwitters } from '../../Backend/Network/UtilityServerAPI';
import { LobbyAdminTools } from '../../Backend/Utils/LobbyAdminTools';
import { CopyableInput } from '../Components/CopyableInput';
import { Link, Spacer } from '../Components/CoreUI';
import { MythicLabelText } from '../Components/Labels/MythicLabel';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { Row } from '../Components/Row';
import { Sidebar } from '../Components/Sidebar';
import { MinimapPane } from '../Panes/Lobbies/MinimapPane';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import { PlanetListPane } from '../Panes/Lobbies/PlanetListPane';
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
  onError,
  created,
  creating,
  playerTwitter,
  validateAndCreateLobby,
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
  onError: (msg: string) => void;
  created: false | EthAddress | undefined;
  creating: boolean;
  playerTwitter: string | undefined;
  validateAndCreateLobby: () => void;
}) {
  const blockscoutURL = `https://blockscout.com/poa/xdai/optimism/tx/${lobbyTx}`;
  const url = `${window.location.origin}/play/${lobbyAdminTools?.address}`;

  const handleEnterUniverse = () => {
    if (config.ADMIN_PLANETS.displayValue && config.ADMIN_PLANETS.displayValue.length > 0) {
      const confirmed = confirm(
        'Warning: Some planets are still staged for creation.\nDo you want to continue?'
      );
      if (!confirmed) return;
    }
    if (config.WHITELIST.displayValue && config.WHITELIST.displayValue.length > 0) {
      const confirmed = confirm(
        'Warning: Some addresses are still staged for allowlist\nDo you want to continue?'
      );
      if (!confirmed) return;
    }
    if (
      config.MANUAL_SPAWN.displayValue &&
      !lobbyAdminTools?.planets.find((p) => p.isSpawnPlanet)
    ) {
      const confirmed = confirm(
        'Warning: Manual spawn is active but no spawn planets have been created. Nobody will be able to spawn into the game!\nDo you want to continue?'
      );
      if (!confirmed) return;
    }
    if (
      config.TARGET_PLANETS.displayValue &&
      !lobbyAdminTools?.planets.find((p) => p.isTargetPlanet)
    ) {
      const confirmed = confirm(
        'Warning: Target planets are active but no target planets have been created.\nDo you want to continue?'
      );
      if (!confirmed) return;
    }
    window.open(url);
  };

  const history = useHistory();
  return (
    <Container>
      <Sidebar previousPath={root} title={'← Choose Map'}>
        <span>Confirm your map configuration before creating your DF Arena Universe.</span>
        <Spacer height={24} />
        <PlanetListPane
          config={config}
          onUpdate={onUpdate}
          onPlanetHover={(planet) => {}}
          onPlanetSelect={(planet) => {}}
          root={root}
          onError={onError}
          lobbyAdminTools={lobbyAdminTools}
        />
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
        <span style={{ fontSize: '16px' }}>
          You're about to create a map for{' '}
          <span style={{ color: '#5CCDF0' }}>
            {config.ADMIN_PLANETS.displayValue?.filter((p) => p?.isSpawnPlanet).length || 0}{' '}
            players.{' '}
          </span>
          There are{' '}
          <span style={{ color: '#FF44B7' }}>
            {config.ADMIN_PLANETS.displayValue?.filter((p) => p?.isTargetPlanet).length || 0} target
            planets
          </span>{' '}
          and{' '}
          <span style={{ color: '#E8E228' }}>
            {config.ADMIN_PLANETS.displayValue?.filter((p) => p?.isSpawnPlanet).length || 0} spawn
            planets.
          </span>
          <br />
          <br />
          Once your world is created, your custom planets will automatically be created on-chain and
          you can enter the universe!
        </span>
        <Spacer height={24} />
        {!created ? (
          <Button primary onClick={validateAndCreateLobby}>
            {creating ? <LoadingSpinner initialText={'Creating...'} /> : 'Create World'}
          </Button>
        ) : (
          <>
            <Row>
              <Button primary onClick={handleEnterUniverse}>
                Enter Universe
              </Button>
            </Row>
            <Row>
              <div>
                <Link to={blockscoutURL} style={{ textDecoration: 'none' }}>
                  <MythicLabelText text='Your universe has been created!'></MythicLabelText>
                </Link>
              </div>
            </Row>
            <Row>
              <CopyableInput
                label='Share with your friends'
                displayValue={url}
                copyText={`👋 ${
                  playerTwitter || ownerAddress?.slice(0, 6)
                } has challenged you to a Dark Forest Arena battle! ☄️😤\n\nClick the link to play:\n⚔️ ${url} ⚔️`}
                onCopyError={onError}
              />
            </Row>
          </>
        )}
        <Spacer height={16} />
        {!createDisabled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button onClick={() => history.push(`${root}/edit-map`)}>Edit map</Button>
            <Button onClick={() => history.push(`${root}/settings/game`)}>Game Settings</Button>
          </div>
        )}
      </MapContainer>
    </Container>
  );
}

const Button = styled.button<{ primary?: boolean }>`
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: ${({ primary }) => (primary ? '2px solid #2EE7BA' : '1px solid #5F5F5F')};
  color: ${({ primary }) => (primary ? '#2EE7BA' : '#fff')};
  background: ${({ primary }) => (primary ? '#09352B' : '#252525')};
  padding: 16px;
  border-radius: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 80ms ease 0s, border-color;
  &:hover {
    background: ${({ primary }) => (primary ? '#0E5141' : '#3D3D3D')};
    border-color: ${({ primary }) => (primary ? '#30FFCD' : '#797979')};
  }
`;

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
  width: 100%;
  max-width: 640px;
  padding: 0 24px;
  margin: 0 auto;
`;

const MapContainer = styled.div`
  display: flex;
  margin: 0 32px;
  flex-direction: column;
  padding-top: 64px;
`;
