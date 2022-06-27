import { getConfigName } from '@darkforest_eth/procedural';
import { address } from '@darkforest_eth/serde';
import { EthAddress, Leaderboard, LiveMatch } from '@darkforest_eth/types';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { loadArenaLeaderboard } from '../../../Backend/Network/ArenaLeaderboardApi';
import { loadConfigFromHash } from '../../../Backend/Network/ConfigApi';
import { Btn } from '../../Components/Btn';
import { Spacer } from '../../Components/CoreUI';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Minimap } from '../../Components/Minimap';
import { generateMinimapConfig, MinimapConfig } from '../../Panes/Lobbies/MinimapUtils';
import { LobbyInitializers } from '../../Panes/Lobbies/Reducer';
import { competitiveConfig } from '../../Utils/constants';
import { ArenaLeaderboardDisplay } from '../ArenaLeaderboard';

export const MapDetails: React.FC<{ configHash: string }> = ({ configHash }) => {
  const [config, setConfig] = useState<LobbyInitializers | undefined>();
  const [lobbyAddress, setLobbyAddress] = useState<EthAddress | undefined>();
  const [error, setError] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [minimapConfig, setMinimapConfig] = useState<MinimapConfig | undefined>();

  const onMapChange = useMemo(() => {
    return debounce((config: MinimapConfig) => configHash && setMinimapConfig(config), 500);
  }, [setMinimapConfig]);

  useEffect(() => {
    if (config) {
      onMapChange(generateMinimapConfig(config, 5));
    } else {
      setMinimapConfig(undefined);
    }
  }, [config, onMapChange]);

  const history = useHistory();

  useEffect(() => {
    loadConfigFromHash(configHash)
      .then((c) => {
        if (!c) {
          setConfig(undefined);
          return;
        }
        setConfig(c.config);
        setLobbyAddress(address(c.address));
      })
      .catch((e) => {
        setError(true);
        console.log(e);
      });
  }, [configHash]);

  return (
    <DetailContainer onClick={() => history.push(`/portal/map/${configHash}`)}>
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
        <Minimap
          style={{ width: '100px', height: '100px' }}
          minimapConfig={minimapConfig}
          setRefreshing={setRefreshing}
        />
      )}
      <span>{getConfigName(configHash)}</span>
      {lobbyAddress && (
        <>
          <span>{lobbyAddress}</span>
          <Link
            style={{ minWidth: '250px' }}
            target='blank'
            to={`/play/${lobbyAddress}?create=true`}
          ></Link>
        </>
      )}
    </DetailContainer>
  );
};

const OfficialGameBanner: React.FC<{}> = ({}) => {
  const [config, setConfig] = useState<LobbyInitializers | undefined>();
  const [lobbyAddress, setLobbyAddress] = useState<EthAddress | undefined>();
  const [error, setError] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | undefined>();
  const [leaderboardError, setLeaderboardError] = useState<Error | undefined>();

  useEffect(() => {
    setLeaderboard(undefined);
    loadArenaLeaderboard(competitiveConfig, false)
      .then((board) => {
        setLeaderboardError(undefined);
        setLeaderboard(board);
      })
      .catch((e) => setLeaderboardError(e));
  }, [competitiveConfig]);

  useEffect(() => {
    loadConfigFromHash(competitiveConfig)
      .then((c) => {
        if (!c) {
          setConfig(undefined);
          return;
        }
        setConfig(c.config);
        setLobbyAddress(address(c.address));
      })
      .catch((e) => {
        setError(true);
        console.log(e);
      });
  }, [competitiveConfig]);

  return (
    <Banner>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BannerTitle>{getConfigName(competitiveConfig)}</BannerTitle>
        <span>{lobbyAddress}</span>
        <span style={{}}>Official DFDAO Map</span>
        {lobbyAddress && (
          <Link
            style={{ minWidth: '250px' }}
            target='blank'
            to={`/play/${lobbyAddress}?create=true`}
          >
            <ArenaPortalButton>Play</ArenaPortalButton>
          </Link>
        )}
      </div>
      <div style={{ maxHeight: '25vh', overflowY: 'auto' }}>
        <ArenaLeaderboardDisplay leaderboard={leaderboard} error={leaderboardError} />
      </div>
    </Banner>
  );
};

export const PortalHomeView: React.FC<{}> = () => {
  const placeholderHash = [competitiveConfig, competitiveConfig, competitiveConfig];
  const placeholderHashes = [...placeholderHash]
    .concat(placeholderHash)
    .concat(placeholderHash)
    .concat(placeholderHash);

  return (
    <Container>
      <OfficialGameBanner />
      <Spacer height={24} />
      <MoreMapsContainer>
        <span>More Maps</span>
        <MoreGrid>
          {placeholderHashes.map((c, i) => (
            <MapDetails configHash={c} key={i} />
          ))}
        </MoreGrid>
      </MoreMapsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  overflow-y: auto;
  height: 100%;
  overflow: hidden;
`;

const Banner = styled.div`
  width: 100%:
  height: 100%;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 6px;
  min-height: 270px;
  max-height: 25vh;
`;

const BannerTitle = styled.span`
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

// TODO: Replace this with LobbyButton when #68 is merged
export const ArenaPortalButton = styled.button<{ secondary?: boolean }>`
  padding: 8px 16px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: ${({ secondary }) => (!secondary ? '2px solid #2EE7BA' : '1px solid #5F5F5F')};
  color: ${({ secondary }) => (!secondary ? '#2EE7BA' : '#fff')};
  background: ${({ secondary }) => (!secondary ? '#09352B' : '#252525')};
  padding: 16px;
  border-radius: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 80ms ease 0s, border-color;
  &:hover {
    background: ${({ secondary }) => (!secondary ? '#0E5141' : '#3D3D3D')};
    border-color: ${({ secondary }) => (!secondary ? '#30FFCD' : '#797979')};
  }
`;

const MoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px;
`;

const DetailContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  text-overflow: ellipses;
  border-radius: 3px;
  background: #161616;
  border: 1px solid #5f5f5f;
  color: #fff;
  padding: 8px;
  cursor: pointer;
`;

const MoreMapsContainer = styled.div`
  overflow-y: auto;
`;
