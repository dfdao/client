import { getConfigName } from '@darkforest_eth/procedural';
import { address } from '@darkforest_eth/serde';
import { BadgeType, EthAddress, GrandPrixHistory, SeasonScore } from '@darkforest_eth/types';
import { IconType } from '@darkforest_eth/ui';
import { isAddress } from 'ethers/lib/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { loadPlayerSeasonHistoryView } from '../../../Backend/Network/GraphApi/SeasonLeaderboardApi';
import { BadgeDetailsRow } from '../../Components/Badges';
import { Icon } from '../../Components/Icons';
import { Sub } from '../../Components/Text';
import { useAccount, useEthConnection, useSeasonData } from '../../Utils/AppHooks';
import { GrandPrixMetadata, SEASON_GRAND_PRIXS } from '../../Utils/constants';
import { TiledTable } from '../TiledTable';
import { PortalHistoryRoundCard } from './Components/PortalHistoryRoundCard';
import { Label } from './PortalHomeView';
import { DummySeasons, mockBadges } from './PortalUtils';
import { theme } from './styleUtils';

export interface TimelineProps {
  configHashes: string[];
}

export interface SeasonHistoryItem {
  seasonId: number;
  grandPrixHistoryItems: GrandPrixHistoryItem[];
  rank: number;
  players: number;
}

export interface GrandPrixHistoryItem {
  configHash: string;
  startTime: number;
  endTime: number;
  players: number;
  rank: number;
  score: number;
  badges: BadgeType[];
}

export function PortalHistoryView({ match }: RouteComponentProps<{ account: string }>) {
  const [current, setCurrent] = useState<number>(0);
  const account = match.params.account as EthAddress;
  const ethConnection = useEthConnection();
  const currentPlayerAddress = ethConnection.getAddress();
  if (!account) return <div>Loading...</div>;

  const configPlayers = useSeasonData();

  const seasonHistories = loadPlayerSeasonHistoryView(account, configPlayers);
  console.log(`season Histories`, seasonHistories);
  if (seasonHistories.length == 0) return <Container>Player not found...</Container>;

  // const rounds = seasonHistories[current].grandPrixs;
  const rounds = DummySeasons[0].grandPrixHistoryItems;
  const totalScore = useMemo(() => rounds.reduce((prev, curr) => curr.score + prev, 0), [rounds]);
  const mapComponents = useMemo(
    () =>
      rounds.map((round: GrandPrixHistoryItem, idx: number) => (
        <PortalHistoryRoundCard round={round} index={idx} key={idx} />
      )),
    [rounds]
  );
  const grandPrixBadges = mockBadges;

  const badgeElements = useMemo(() => {
    if (!grandPrixBadges) return;

    const countedBadges: { count: number; badge: BadgeType }[] = [];
    grandPrixBadges.forEach((badge) => {
      const found = countedBadges.find((b) => b.badge == badge);
      if (!found) return countedBadges.push({ count: 1, badge: badge });
      return found.count++;
    });
    return countedBadges.map((badge) => <BadgeDetailsRow type={badge.badge} count={badge.count} />);
  }, [grandPrixBadges]);

  const leftDisplay = current == 0 ? 'none' : 'flex';
  const rightDisplay = current == seasonHistories.length - 1 ? 'none' : 'flex';
  return (
    <Container>
      <HeaderContainer>
        <div className='col'>
          <Title>Season {current + 1}</Title>
          <Subtitle>{rounds.length} rounds in this season so far</Subtitle>
        </div>
      </HeaderContainer>
      <PlayerInfoContainer>
        <span>
          Player {account} {account === currentPlayerAddress && '(you)'}
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xl,
          }}
        >
          <div className='col'>
            <Subtitle style={{ textTransform: 'uppercase' }}>Season Rank</Subtitle>
            <Title>
              {seasonHistories[current].rank} of {seasonHistories[current].players}
            </Title>
          </div>
          <div className='col'>
            <Subtitle style={{ textTransform: 'uppercase' }}>Season Score</Subtitle>
            <Title>{totalScore}</Title>
          </div>
        </div>
      </PlayerInfoContainer>

      <Label>Season badges</Label>
      <BodyContainer>{badgeElements}</BodyContainer>

      <Label>Season rounds</Label>
      <BodyContainer>{mapComponents}</BodyContainer>
    </Container>
  );
}

const Title = styled.span`
  font-family: ${theme.fonts.mono};
  color: ${theme.colors.fgPrimary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 1.8em;
`;

const Subtitle = styled.span`
  color: ${theme.colors.fgMuted2};
  opacity: 0.8;
  font-family: ${theme.fonts.mono};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  // align-items: center;
  // justify-content: space-between;
  // height: 100%;
  // width: 100%;
  margin: 0 3rem;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const BodyContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  align-items: center;
  gap: ${theme.spacing.xl};
`;

const PlayerInfoContainer = styled.div`
  border-radius: ${theme.borderRadius};
  background: ${theme.colors.bg1};
  font-family: ${theme.fonts.mono};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.xl};
`;
