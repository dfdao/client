import { GraphConfigPlayer, Leaderboard, LiveMatch } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import { loadArenaLeaderboard } from '../../../Backend/Network/GraphApi/GrandPrixApi';
import {
  loadEloLeaderboard,
} from '../../../Backend/Network/GraphApi/EloLeaderboardApi';
import { loadLiveMatches } from '../../../Backend/Network/GraphApi/SpyApi';
import { Subber } from '../../Components/Text';
import { LobbyInitializers } from '../../Panes/Lobby/Reducer';
import { ArenaLeaderboardDisplay, EloLeaderboardDisplay } from '../Leaderboards/ArenaLeaderboard';
import { LiveMatches } from '../Leaderboards/LiveMatches';
import { TabbedView } from '../TabbedView';
import { ConfigDetails } from './ConfigDetails';
import { FindMatch } from './FindMatch';
import useSWR from 'swr';
import { fetcher } from '../../../Backend/Network/UtilityServerAPI';
import { useSeasonData, useTwitters } from '../../Utils/AppHooks';
import { loadGrandPrixLeaderboard } from '../../../Backend/Network/GraphApi/SeasonLeaderboardApi';

export function MapDetails({
  configHash,
  config,
}: {
  configHash: string;
  config: LobbyInitializers;
}) {
  const [leaderboard, setLeaderboard] = useState<Leaderboard | undefined>();
  const [eloLeaderboard, setEloLeaderboard] = useState<GraphConfigPlayer[] | undefined>();
  const [leaderboardError, setLeaderboardError] = useState<Error | undefined>();
  const [liveMatches, setLiveMatches] = useState<LiveMatch | undefined>();
  const [liveMatchError, setLiveMatchError] = useState<Error | undefined>();

  const numSpawnPlanets = config?.ADMIN_PLANETS.filter((p) => p.isSpawnPlanet).length ?? 0;
  const hasWhitelist = config?.WHITELIST_ENABLED ?? true;
  const twitters = useTwitters();
  const allPlayers = useSeasonData();
  const leaders = loadGrandPrixLeaderboard(allPlayers, configHash, twitters);

  useEffect(() => {
    setLeaderboard(undefined);
    setLiveMatches(undefined);
    if (configHash) {
      if (numSpawnPlanets > 1) {
        loadEloLeaderboard(configHash, numSpawnPlanets > 1)
          .then((board) => {
            setLeaderboardError(undefined);
            setEloLeaderboard(board);
          })
          .catch((e) => setLeaderboardError(e));
      } else {
        setLeaderboard(leaders);
      }
      loadLiveMatches(configHash)
        .then((matches) => {
          setLiveMatchError(undefined);
          setLiveMatches(matches);
        })
        .catch((e) => {
          console.log(e);
          setLiveMatchError(e);
        });
    }
  }, [configHash]);

  return (
    <div
      style={{
        display: 'flex',
        flexShrink: 1,
        flexDirection: 'column',
        height: '100%',
        flex: '1 1 50%',
        width: '50%',
        maxWidth: '50%',
        maxHeight: '100vh',
        overflowY: 'auto',
      }}
    >
      <TabbedView
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          // flex: '1 1 50%',
          width: '100%',
          maxHeight: '100vh',
          overflowY: 'auto',
        }}
        startSelected={numSpawnPlanets >= 2 ? 1 : 0}
        tabTitles={[
          'Leaderboard',
          numSpawnPlanets > 1 ? 'Join a Match' : 'Live Games',
          'Config Details',
        ]}
        tabContents={(i) => {
          if (i === 0) {
            return numSpawnPlanets > 1 ? (
              <EloLeaderboardDisplay leaderboard={eloLeaderboard} error={leaderboardError} />
            ) : (
              <ArenaLeaderboardDisplay leaderboard={leaderboard} error={leaderboardError} />
            );
          }
          if (i === 1) {
            if (numSpawnPlanets > 1 && !hasWhitelist) {
              return <FindMatch game={liveMatches} />;
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
    </div>
  );
}
