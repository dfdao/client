import { getConfigName } from '@darkforest_eth/procedural';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { loadConfigFromHash } from '../../../Backend/Network/ConfigApi';
import { loadRecentMaps } from '../../../Backend/Network/MapsApi';
import dfstyles from '../../Styles/dfstyles';
import { formatStartTime } from '../../Utils/TimeUtils';

export interface TimelineProps {
  configHashes: string[];
}

export interface RoundHistoryItem {
  configHash: string;
  name: string;
  startTime: number;
}

const MOCK_CONFIG_HASHES: string[] = [
  '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
  '0x12c40c98747fc86ccdccc3a716ffa089497d7de3bb5a967ed8b36a1d521c54bc',
  '0x8123f44f417f2064b9f01c864b52fd71bd676031c8db5ccb033d1e97cdb9c2b2',
  '0xb0a84c922647980d3ad4661a4f9bded19c8d24a9c993be48a3ba3745f9cb30ad',
  '0xc5f9565c1e6f0373d19429b21ccbe22e0a846064b0943a2bc4bba8f633b41eb8',
  '0x47f985b6b03252584163bcce2f8c459d053fabfa3e191ede4d104ba023ac5836',
  '0x2d042b4eba16c40ab0aba07432db21490f4058fd1739e96ad6a4b7b8b469acc9',
  '0x53e199c93ef7c310f9e49f4cb43bdce9a041dcaac0961ed0f7cb9a52b3097b94',
];

export const PortalHistoryView: React.FC<{}> = ({}) => {
  const [rounds, setRounds] = useState<RoundHistoryItem[]>([]);
  const history = useHistory();

  useEffect(() => {
    MOCK_CONFIG_HASHES.forEach(async (configHash) => {
      loadRecentMaps(1, configHash).then((res) => {
        if (!res) return;
        if (res.length === 0) return;
        const map = res[0];
        setRounds((prevRounds) =>
          [
            ...prevRounds,
            {
              configHash,
              name: getConfigName(configHash),
              startTime: map.startTime ?? 0,
            },
          ].sort((a, b) => b.startTime - a.startTime)
        );
      });
    });
  }, []);

  return (
    <Container>
      <Header>Previous Grand Prix Rounds</Header>
      <TimelineContainer>
        <thead>
          <tr>
            <TimelineHeader>Started</TimelineHeader>
            <TimelineHeader>Name</TimelineHeader>
          </tr>
        </thead>
        <tbody>
          {rounds.map((historyItem: RoundHistoryItem) => (
            <TimelineRow
              onClick={() => {
                history.push(`/portal/map/${historyItem.configHash}`);
              }}
            >
              <TimelineItem>{formatStartTime(historyItem.startTime)}</TimelineItem>
              <TimelineItem>{historyItem.name}</TimelineItem>
            </TimelineRow>
          ))}
        </tbody>
      </TimelineContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Header = styled.h1`
  font-size: 1.5rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const TimelineContainer = styled.table`
  margin-top: 3rem;
  border-collapse: collapse;
  display: block;
  border-spacing: 0;
  font-size: 1rem;
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
