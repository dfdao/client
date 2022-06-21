import { getConfigName } from '@darkforest_eth/procedural';
import { Leaderboard, LiveMatch } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { loadArenaLeaderboard } from '../../../Backend/Network/ArenaLeaderboardApi';
import { loadLiveMatches } from '../../../Backend/Network/SpyApi';
import { Link } from '../../Components/CoreUI';
import { Subber } from '../../Components/Text';
import { LobbyInitializers } from '../../Panes/Lobbies/Reducer';
import { useArenaLeaderboard, useLiveMatches } from '../../Utils/AppHooks';
import { ArenaLeaderboardDisplay } from '../ArenaLeaderboard';
import { LiveMatches } from '../LiveMatches';
import { TabbedView } from '../TabbedView';
import { ConfigDetails } from './ConfigDetails';

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
    if(configHash) {
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

  return (
    <TabbedView
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: '1 1 50%',
        width: '50%',
        maxWidth: '50%',
      }}
      tabTitles={['Leaderboard', 'Current Games', 'Config Details']}
      tabContents={(i) => {
        if (i === 0) {
          return <ArenaLeaderboardDisplay leaderboard={leaderboard} error={leaderboardError} />;
        }
        if (i === 1) {
          return (
            <>
              <LiveMatches game={liveMatches} error={liveMatchError} />{' '}
              <Subber style={{ textAlign: 'end' }}>
                by <a href={'https://twitter.com/bulmenisaurus'}>Bulmenisaurus</a>
              </Subber>
            </>
          );
        }
        return <ConfigDetails config={config} />;
      }}
    />
  );
}
