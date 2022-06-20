import { getConfigName } from '@darkforest_eth/procedural';
import { Leaderboard } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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
  configHash: string;
  config: LobbyInitializers | undefined;
}) {
  const { arenaLeaderboard, arenaError } = useArenaLeaderboard(false, configHash);
  const { liveMatches, spyError } = useLiveMatches(configHash);

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
          return <ArenaLeaderboardDisplay leaderboard={arenaLeaderboard} error={arenaError} />;
        }
        if (i === 1) {
          return (
            <>
              <LiveMatches game={liveMatches} error={spyError} />{' '}
              <Subber style= {{textAlign: 'end'}}>
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
