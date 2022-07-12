import { getConfigName } from '@darkforest_eth/procedural';
import { EthAddress, Leaderboard } from '@darkforest_eth/types';
import dfstyles from '@darkforest_eth/ui/dist/styles';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { loadArenaLeaderboard } from '../../../../Backend/Network/ArenaLeaderboardApi';
import { loadConfigFromHash } from '../../../../Backend/Network/ConfigApi';
import { GraphConfigPlayer, loadEloLeaderboard } from '../../../../Backend/Network/EloLeaderboardApi';
import { loadRecentMaps } from '../../../../Backend/Network/MapsApi';
import { Sub } from '../../../Components/Text';
import { ArenaLeaderboardDisplay, EloLeaderboardDisplay } from '../../ArenaLeaderboard';
import { ArenaPortalButton } from '../PortalHomeView';

export const OfficialGameBanner: React.FC<{
  configHash: string;
}> = ({ configHash }) => {
  const [leaderboardError, setLeaderboardError] = useState<Error | undefined>();
  const [eloLeaderboard, setEloLeaderboard] = useState<GraphConfigPlayer[] | undefined>();
  const [lobbyAddress, setLobbyAddress] = useState<EthAddress | undefined>();

  const history = useHistory();

  useEffect(() => {
    setEloLeaderboard(undefined);
    loadEloLeaderboard(configHash)
    .then((board) => {
      console.log("BOARD", board);
      setLeaderboardError(undefined);
      setEloLeaderboard(board);
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
              <Sub>Play the Galactic League</Sub>
              <BannerTitle>{getConfigName(configHash)}</BannerTitle>
            </div>
            <span>{configHash}</span>
            {/* <span style={{}}>Official DFDAO Map</span> */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                style={{ minWidth: '250px' }}
                target='blank'
                to={`/play/${lobbyAddress}?create=true`}
              >
                <ArenaPortalButton>New Game</ArenaPortalButton>
              </Link>
              <Link to={`/portal/map/${configHash}`}>
                <ArenaPortalButton secondary>Join a Game</ArenaPortalButton>
              </Link>
            </div>
          </div>
          {eloLeaderboard && (
            <div style = {{textAlign: 'center', borderLeft: `solid 1px ${dfstyles.colors.subbertext}`}}>
              Top Players
              <EloLeaderboardDisplay leaderboard={eloLeaderboard} error={leaderboardError} totalPlayers = {false}/>
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
  max-width: 1000px;
  margin: 10px;
  align-self: center;
  gap: 10px;
`;

const BannerTitle = styled.span`
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
