import { getConfigName } from '@darkforest_eth/procedural';
import { BadgeType } from '@darkforest_eth/ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import { fetcher } from '../../../Backend/Network/UtilityServerAPI';
import { Badge } from '../../Components/Badges';
import { Link } from '../../Components/CoreUI';
import { MythicLabelText } from '../../Components/Labels/MythicLabel';
import dfstyles from '../../Styles/dfstyles';
import { useTwitters } from '../../Utils/AppHooks';
import { formatStartTime } from '../../Utils/TimeUtils';
import { TiledTable } from '../TiledTable';

export interface TimelineProps {
  configHashes: string[];
}

interface SeasonHistoryItem {
  id: number;
  grandPrixHistoryItems: GrandPrixHistoryItem[];
  rank: number;
  players: number;
}

interface GrandPrixHistoryItem {
  configHash: string;
  startTime: string;
  endTime: string;
  players: number;
  rank: number;
  score: number;
  badges: BadgeType[];
}

const seasons: SeasonHistoryItem[] = [
  {
    id: 1,
    rank: 5,
    players: 1000,
    grandPrixHistoryItems: [
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
    ],
  },
  {
    id: 1,
    rank: 5,
    players: 1000,
    grandPrixHistoryItems: [
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: '2022-07-13T00:00:00.000Z',
        endTime: '2022-07-13T00:00:00.000Z',
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Dfdao, BadgeType.Dfdao],
      },
    ],
  },
];

export const PortalHistoryView: React.FC<{}> = ({}) => {
  const [current, setCurrent] = useState<number>(0);

  const rounds = useMemo(() => seasons[current].grandPrixHistoryItems, [current]);
  const totalScore = useMemo(() => rounds.reduce((prev, curr) => curr.score + prev, 0), [rounds]);

  const history = useHistory();
  const error = false;
  return (
    <Container>
      <HeaderContainer>
        <span style={{ fontSize: '2em' }}>Season {current + 1}</span>
        <div>
          <div>
            Rank: {seasons[current].rank}
            Score: {totalScore}
          </div>
        </div>
      </HeaderContainer>
      <BodyContainer>
        <TiledTable
          title={<span style={{ fontSize: '2em' }}>Season 2 History</span>}
          items={rounds.map((round) => (
            <div style={{ width: '200px', height: '200px', background: 'indigo' }}>
              {round.rank} / {round.players}
            </div>
          ))}
        />
      </BodyContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 16px 48px;
`;

const HeaderContainer = styled.div`
  background: rgb(42, 42, 42);
  background: linear-gradient(0deg, rgba(42, 42, 42, 1) 05%, rgba(20, 20, 20, 1) 100%);
  width: 100%;
  min-height: 200px;
  border-radius: 48px 48px 0px 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const BodyContainer = styled.div`
  margin-top: 3rem;
  width: 80%;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  // justify-content: space-around;
  align-items: center;
`;

const TimelineRow = styled.tr`
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #252525;
  }
`;

const TimelineHeader = styled.th`
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${dfstyles.colors.subtext};
`;

const TimelineItem = styled.td`
  padding: 8px 16px;
`;

const HoverIcon = () => {
  return (
    <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z'
        fill='currentColor'
        fill-rule='evenodd'
        clip-rule='evenodd'
      ></path>
    </svg>
  );
};
