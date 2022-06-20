import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { chunk } from 'lodash';
import { MinimapColors } from '../Panes/Lobbies/MinimapUtils';
import { getAllTwitters } from '../../Backend/Network/UtilityServerAPI';
import { LobbyAdminTools } from '../../Backend/Utils/LobbyAdminTools';
import { LobbyPlanet } from '../Panes/Lobbies/LobbiesUtils';
import {
  InvalidConfigError,
  LobbyAction,
  LobbyConfigState,
  LobbyInitializers,
  toInitializers,
} from '../Panes/Lobbies/Reducer';
import { EthAddress } from '@darkforest_eth/types';
import { useHistory } from 'react-router-dom';
import { CopyableInput } from './CopyableInput';
import { Row } from './Row';
import { Link } from './CoreUI';
import { MythicLabelText } from './Labels/MythicLabel';
import { LoadingSpinner } from './LoadingSpinner';

type Status = 'waitingForCreate' | 'creating' | 'created' | 'errored' | undefined;

export interface LobbyCreationStatusProps {
  lobbyAdminTools: LobbyAdminTools | undefined;
  config: LobbyConfigState;
  ownerAddress: EthAddress;
  updateConfig: React.Dispatch<LobbyAction>;
  lobbyTx: string | undefined;
  root: string;
  createLobby: (config: LobbyInitializers) => void;
  setError: (msg: string) => void;
}

const DEFAULT_PLANET: LobbyPlanet = {
  x: 0,
  y: 0,
  level: 0,
  planetType: 0,
  isTargetPlanet: false,
  isSpawnPlanet: false,
};

const BULK_CREATE_CHUNK_SIZE = 5;

export const LobbyCreationStatus: React.FC<LobbyCreationStatusProps> = ({
  root,
  lobbyAdminTools,
  config,
  ownerAddress,
  updateConfig,
  lobbyTx,
  createLobby,
  setError,
}) => {
  const [status, setStatus] = useState<Status>(undefined);
  const [playerTwitter, setPlayerTwitter] = useState<string | undefined>();

  const history = useHistory();

  const createDisabled = status === 'created' || status === 'creating';
  const creating = status === 'creating' || (status === 'created' && !lobbyAdminTools?.address);
  const created = status === 'created' && lobbyAdminTools?.address;

  const blockscoutURL = `https://blockscout.com/poa/xdai/optimism/tx/${lobbyTx}`;
  const url = `${window.location.origin}/play/${lobbyAdminTools?.address}`;

  useEffect(() => {
    async function doCreateReveal() {
      await bulkCreateAndRevealPlanets();
    }
    if (lobbyAdminTools && !created) {
      doCreateReveal();
      setStatus('created');
    }
  }, [lobbyAdminTools]);

  useEffect(() => {
    async function fetchTwitters() {
      const allTwitters = await getAllTwitters();
      setPlayerTwitter(allTwitters[ownerAddress]);
    }
    fetchTwitters();
  }, []);

  async function bulkCreateAndRevealPlanets() {
    console.log('The bulk creatooooor');
    if (!lobbyAdminTools) {
      // setError("You haven't created a lobby.");
      throw new Error('No lobby');
    }
    if (!config.ADMIN_PLANETS.currentValue) {
      // setError('no planets staged');
      throw new Error('No planets staged');
    }
    let planets = config.ADMIN_PLANETS.currentValue;

    let i = 0;
    while (i < planets.length) {
      try {
        const chunk = planets.slice(i, i + BULK_CREATE_CHUNK_SIZE);
        await lobbyAdminTools.bulkCreateAndReveal(chunk, toInitializers(config));
        updateConfig({
          type: 'ADMIN_PLANETS',
          value: DEFAULT_PLANET,
          index: i,
          number: BULK_CREATE_CHUNK_SIZE,
        });
        planets.splice(i, BULK_CREATE_CHUNK_SIZE);
      } catch (err) {
        i += BULK_CREATE_CHUNK_SIZE;
        console.log('ERROR', err);
        if (err instanceof InvalidConfigError) {
          setError(`Invalid ${err.key} value ${err.value ?? ''} - ${err.message}`);
        } else {
          setError(err?.message || 'Something went wrong. Check your dev console.');
        }
      }
    }
    setStatus('created');
  }

  async function validateAndCreateLobby() {
    try {
      setStatus('creating');
      const initializers = toInitializers(config);
      await createLobby(initializers);
    } catch (err) {
      setStatus('errored');
      console.error(err);
      if (err instanceof InvalidConfigError) {
        setError(`Invalid ${err.key} value ${err.value ?? ''} - ${err.message}`);
      } else {
        setError(err?.message || 'Something went wrong. Check your dev console.');
      }
    }
  }

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

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {!created ? (
          <LobbyButton primary disabled={createDisabled} onClick={validateAndCreateLobby}>
            {creating ? <LoadingSpinner initialText={'Creating...'} /> : 'Create World'}
          </LobbyButton>
        ) : (
          <>
            <Row>
              <LobbyButton primary onClick={handleEnterUniverse}>
                Enter Universe
              </LobbyButton>
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
                onCopyError={setError}
              />
            </Row>
          </>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin: 0 32px;
  flex-direction: column;
  padding-top: 64px;
`;

const LobbyButton = styled.button<{ primary?: boolean }>`
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
