import { getConfigName } from '@darkforest_eth/procedural';
import { EthAddress, Leaderboard } from '@darkforest_eth/types';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { loadArenaLeaderboard } from '../../../../Backend/Network/ArenaLeaderboardApi';
import { loadConfigFromHash } from '../../../../Backend/Network/ConfigApi';
import { loadRecentMaps } from '../../../../Backend/Network/MapsApi';
import { Sub } from '../../../Components/Text';
import { ArenaLeaderboardDisplay } from '../../ArenaLeaderboard';
import { ArenaPortalButton } from '../PortalHomeView';

export const OfficialGameBanner: React.FC<{
  configHash: string;
}> = ({ configHash }) => {
  const [leaderboardError, setLeaderboardError] = useState<Error | undefined>();
  const [leaderboard, setLeaderboard] = useState<Leaderboard | undefined>();
  const [lobbyAddress, setLobbyAddress] = useState<EthAddress | undefined>();

  const history = useHistory();

  useEffect(() => {
    setLeaderboard(undefined);
    loadArenaLeaderboard(configHash, false)
      .then((board) => {
        setLeaderboardError(undefined);
        setLeaderboard(board);
      })
      .catch((e) => setLeaderboardError(e));
    loadRecentMaps(1, configHash).then((maps) => {
      setLobbyAddress(maps && maps.length > 0 ? maps[0].lobbyAddress : undefined);
    });
  }, [configHash]);

  return (
    <>
      {lobbyAddress && (
        <Banner>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Sub>Play the Grand Prix</Sub>
              <BannerTitle>{getConfigName(configHash)}</BannerTitle>
            </div>
            <span>{lobbyAddress}</span>
            {/* <span style={{}}>Official DFDAO Map</span> */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                style={{ minWidth: '250px' }}
                target='blank'
                to={`/play/${lobbyAddress}?create=true`}
              >
                <ArenaPortalButton>Play</ArenaPortalButton>
              </Link>
              <Link to={`/portal/map/${configHash}`}>
                <ArenaPortalButton secondary>View Map</ArenaPortalButton>
              </Link>
            </div>
          </div>
          {leaderboard && (
            <div style={{ maxHeight: '25vh', overflowY: 'auto', marginBottom: '3rem' }}>
              <ArenaLeaderboardDisplay leaderboard={leaderboard} error={leaderboardError} />
            </div>
          )}
        </Banner>
      )}
    </>
  );
};

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
  overflow: hidden;
`;

const BannerTitle = styled.span`
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
