import { getConfigName } from '@darkforest_eth/procedural';
import { Leaderboard, LiveMatch } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import { loadArenaLeaderboard } from '../../../Backend/Network/ArenaLeaderboardApi';
import { loadLiveMatches } from '../../../Backend/Network/SpyApi';
import { Subber } from '../../Components/Text';
import { LobbyInitializers } from '../../Panes/Lobbies/Reducer';
import { ArenaLeaderboardDisplay } from '../ArenaLeaderboard';
import { LiveMatches } from '../LiveMatches';
import { TabbedView } from '../TabbedView';
import { ConfigDetails } from './ConfigDetails';
import { FindMatch } from './FindMatch';

export function MapDetails({
  configHash,
  config,
}: {
  configHash: string | undefined;
  config: LobbyInitializers | undefined;
}) {
  const [leaderboard, setLeaderboard] = useState<Leaderboard | undefined>();
  const [leaderboardError, setLeaderboardError] = useState<Error | undefined>();
  const [liveMatches, setLiveMatches] = useState<LiveMatch | undefined>();
  const [liveMatchError, setLiveMatchError] = useState<Error | undefined>();

  useEffect(() => {
    setLeaderboard(undefined);
    setLiveMatches(undefined);
    if (configHash) {
      loadArenaLeaderboard(configHash, false)
        .then((board) => {
          setLeaderboardError(undefined);
          setLeaderboard(board);
        })
        .catch((e) => setLeaderboardError(e));
      loadLiveMatches(configHash)
        .then((matches) => {
          setLiveMatchError(undefined);
          setLiveMatches(matches);
        })
        .catch((e) => setLiveMatchError(e));
    }
  }, [configHash]);

  const numSpawnPlanets = config?.ADMIN_PLANETS.filter((p) => p.isSpawnPlanet).length ?? 0;

  return (
    <TabbedView
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: '1 1 50%',
        width: '50%',
        maxWidth: '50%',
        maxHeight: '100vh',
        overflowY: 'auto',
      }}
      tabTitles={['Leaderboard', 'Current Games', 'Config Details']}
      tabContents={(i) => {
        if (i === 0) {
          if (numSpawnPlanets > 1) {
            return <ArenaLeaderboardDisplay leaderboard={leaderboard} error={leaderboardError} />;
          } else {
            return <ArenaLeaderboardDisplay leaderboard={leaderboard} error={leaderboardError} />;
          }
        }
        if (i === 1) {
          if (numSpawnPlanets > 1) {
            return (
              <FindMatch game={liveMatches} error={liveMatchError} nPlayers={numSpawnPlanets} />
            );
          } else {
            return (
              <>
                <LiveMatches game={liveMatches} error={liveMatchError} />{' '}
                <Subber style={{ textAlign: 'end' }}>
                  by <a href={'https://twitter.com/bulmenisaurus'}>Bulmenisaurus</a>
                </Subber>
              </>
            );
          }
        }
        return <ConfigDetails config={config} />;
      }}
    />
  );
}
