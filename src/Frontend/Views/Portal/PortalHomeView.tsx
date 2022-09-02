import { Leaderboard, RegistryResponse } from '@darkforest_eth/types';
import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { loadArenaLeaderboard } from '../../../Backend/Network/GraphApi/GrandPrixApi';
import { loadGrandPrixLeaderboard, loadSeasonLeaderboard } from '../../../Backend/Network/GraphApi/SeasonLeaderboardApi';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { useConfigFromHash, useEthConnection, useSeasonData, useTwitters } from '../../Utils/AppHooks';
import { SEASON_GRAND_PRIXS } from '../../Utils/constants';
import { ArenaLeaderboardDisplay } from '../Leaderboards/ArenaLeaderboard';
import { LabeledPanel } from './Components/LabeledPanel';
import { PaddedRow } from './Components/PaddedRow';
import { SeasonLeaderboardEntryComponent } from './Components/SeasonLeaderboardEntryComponent';
import { GPFeed } from './GPFeed';
import { MapOverview } from './MapOverview';
import { createDummySeasonLeaderboardData, getCurrentGrandPrix } from './PortalUtils';
import { theme } from './styleUtils';

export const PortalHomeView: React.FC<{}> = () => {
  const [leaderboard, setLeaderboard] = useState<Leaderboard | undefined>();
  const grandPrix = getCurrentGrandPrix(SEASON_GRAND_PRIXS)
  const twitters = useTwitters();
  const allPlayers = useSeasonData();
  const leaders = loadGrandPrixLeaderboard(allPlayers,grandPrix.configHash, twitters);
  const { config, lobbyAddress, error } = useConfigFromHash(grandPrix.configHash);

  useEffect(() => {
    setLeaderboard(leaders)
  }, [])
  
  if (error) {
    return (
      <Container>
        <Content>Couldn't load map.</Content>
        <span>{error}</span>
      </Container>
    );
  }

  if (!config) {
    return (
      <Container>
        <Content>
          <LoadingSpinner />
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <div className='row w-100' style={{ gap: theme.spacing.xl }}>
        <div className='col w-100'>
          <MapOverview round={grandPrix} config={config} lobbyAddress={lobbyAddress} />
        </div>
        <div className='col w-100'>
          <Label>Live Feed</Label>
          <GPFeed leaderboard={leaderboard} />
        </div>
      </div>
      <div className='row w-100' style={{ gap: theme.spacing.xl }}>
        <div className='col w-100'>
          <LabeledPanel label='Active Grand Prix'>
            <ArenaLeaderboardDisplay leaderboard={leaderboard} error={undefined} />
          </LabeledPanel>
        </div>
        <div className='col w-100'>
          <LabeledPanel label='Season leaderboard'>
            <div className='col' style={{ gap: theme.spacing.md }}>
              {loadSeasonLeaderboard(allPlayers, grandPrix.seasonId).entries
                .sort((a, b) => b.score - a.score)
                .map((entry, index) => (
                  <SeasonLeaderboardEntryComponent key={index} entry={entry} index={index} />
                ))}
            </div>
          </LabeledPanel>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 0 3rem;
  padding-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
  gap: 24px;
  margin-bottom: 24px;
`;

export const Label = styled.span`
  font-size: 1rem;
  color: ${theme.colors.fgPrimary};
  font-family: ${theme.fonts.mono};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding-bottom: 1rem;
`;
