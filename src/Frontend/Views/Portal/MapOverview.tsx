import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { formatDuration } from '../../Utils/TimeUtils';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Minimap } from '../../Components/Minimap';
import { generateMinimapConfig, MinimapConfig } from '../../Panes/Lobby/MinimapUtils';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import { LobbyInitializers } from '../../Panes/Lobby/Reducer';
import { EthAddress } from '@darkforest_eth/types';
import { RoundResponse } from './PortalHomeView';
import { getConfigName } from '@darkforest_eth/procedural';

type RoundStatus = 'not started' | 'started' | 'ended';

export const MapOverview: React.FC<{
  round: RoundResponse;
  config: LobbyInitializers;
  lobbyAddress?: EthAddress;
}> = ({ round, lobbyAddress, config }) => {
  const endTime = new Date(round.endTime.toNumber()).getTime();
  const startTime = new Date(round.startTime.toNumber()).getTime();

  const [status, setStatus] = useState<RoundStatus>('not started');
  const [countdown, setCountdown] = useState<number>();
  const [minimapConfig, setMinimapConfig] = useState<MinimapConfig | undefined>();
  const [mapName, setMapName] = useState<string>(
    round.configHash ? getConfigName(round.configHash) : 'No map found'
  );

  const onMapChange = useMemo(() => {
    return debounce((config: MinimapConfig) => round.configHash && setMinimapConfig(config), 500);
  }, [setMinimapConfig, round.configHash]);

  useEffect(() => {
    if (config) {
      const name = round.configHash ? getConfigName(round.configHash) : 'No map found';
      setMapName(name);
      onMapChange(generateMinimapConfig(config, 4));
    } else {
      setMinimapConfig(undefined);
      setMapName('No map found');
    }
  }, [config, onMapChange, setMapName, round.configHash]);

  useEffect(() => {
    const update = () => {
      const now = Date.now();

      if (now > endTime) {
        setStatus('ended');
        setCountdown(1);
        return;
      }
      if (now < startTime) {
        setStatus('not started');
        const msWait = startTime - now;
        setCountdown(msWait);
        return;
      }

      const msWait = endTime - now;

      setStatus('started');
      setCountdown(msWait);
    };

    const interval = setInterval(() => {
      update();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, countdown, endTime, startTime]);

  const { innerHeight } = window;
  let mapSize = '300px';
  if (innerHeight < 700) {
    mapSize = '300px';
  }

  return (
    <Container>
      <Content>
        <TextContent>
          <RoundName>{`Season ${round.seasonId.toNumber()}`}</RoundName>
          <Title>{mapName ?? 'Grand Prix Round'}</Title>
          <MapActions>
            <Link target='blank' to={`/play/${lobbyAddress}?create=true`}>
              <PlayButton disabled={status !== 'started'}>Play Round</PlayButton>
            </Link>
            {countdown && (
              <RoundCountdown>
                {status == 'ended'
                  ? 'Round over!'
                  : status == 'not started'
                  ? `Round starts in ${formatDuration(countdown)} `
                  : `Round ends in ${formatDuration(countdown)} `}
              </RoundCountdown>
            )}
          </MapActions>
        </TextContent>

        {!minimapConfig ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '300px',
              height: '300px',
            }}
          >
            <LoadingSpinner initialText='Loading...' />
          </div>
        ) : (
          <MinimapContainer>
            <Minimap
              style={{ width: mapSize, height: mapSize }}
              minimapConfig={minimapConfig}
              setRefreshing={() => {
                // do nothing
              }}
            />
          </MinimapContainer>
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid hsla(0, 0%, 33%, 1);
  background: linear-gradient(90deg, hsla(240, 7%, 42%, 0.2) 0%, #111 100%);
  padding: 24px;
  border-radius: 4px;
`;
const Content = styled.div`
  max-width: 66%;
  margin: 0 auto;
  justify-content: space-between;
  display: flex;
  align-items: center;
`;
const TextContent = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
`;
const RoundName = styled.span`
  font-weight: 500;
  color: hsla(218, 100%, 74%, 1);
`;
const Title = styled.span`
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;
const MapActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1 1 auto;
  margin-top: 2rem;
`;
const PlayButton = styled.button`
  display: flex;
  box-shadow: 0px 8px 48px 0px hsla(0, 0%, 34%, 0.08);
  box-shadow: 0px 4px 8px 0px hsla(210, 7%, 28%, 0.06);
  box-shadow: 0px 0px 1px 0px hsla(210, 7%, 28%, 0.32);
  color: #fff;
  background: hsla(218, 100%, 74%, 1);
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;
  animation: pulse 2s infinite ease-in-out;
  &:active:not([disabled]) {
    transform: scale(0.95);
    outline: none;
  }
  &:hover:not([disabled]) {
    background: var(--primary-hover);
    transform: scale(1.05);
    animation: none;
    -webkit-animation: none;
  }
  &:disabled {
    cursor: not-allowed;
    border: none;
    animation: none;
    -webkit-animation: none;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0px 0px hsla(218, 100%, 84%, 0.5);
    }
    70% {
      box-shadow: 0 0 0px 6px hsla(0, 0%, 0%, 0);
    }
  }
`;
const RoundCountdown = styled.span`
  justify-self: flex-start;
`;
const MinimapContainer = styled.div`
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
