import { getConfigName } from '@darkforest_eth/procedural';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { loadSeasonLeaderboard } from '../../../Backend/Network/GraphApi/SeasonLeaderboardApi';
import dfstyles from '../../Styles/dfstyles';
import { MinimalButton } from '../Portal/PortalMainView';

export interface SeasonGame {
  configHash: string;
  score: number;
}

export interface SeasonLeaderboardEntry {
  address: string;
  games: SeasonGame[];
  score: number;
}

export interface LeaderboardProps {
  seasonId: number;
  entries: SeasonLeaderboardEntry[];
}

const Entry: React.FC<{ entry: SeasonLeaderboardEntry; index: number }> = ({ entry, index }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Row key={index} onClick={() => setExpanded(!expanded)} expanded={expanded}>
        <Group>
          <span
            style={{
              color: index % 2 === 0 ? dfstyles.colors.text : dfstyles.colors.textLight,
            }}
          >
            {index + 1}
          </span>
          <span>{entry.address}</span>
        </Group>
        <span>{entry.score}</span>
      </Row>
      {expanded && (
        <ExpandedGames style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {entry.games.map((game, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{getConfigName(game.configHash)}</span>
                <span>{game.score}</span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '8px',
                padding: '8px',
                borderTop: `1px solid ${dfstyles.colors.borderDarker}`,
              }}
            >
              <span>5 badges this season</span>
              <button>View player</button>
            </div>
          </div>
        </ExpandedGames>
      )}
    </div>
  );
};

const Leaderboard: React.FC<LeaderboardProps> = ({ seasonId, entries }) => {
  return (
    <Container>
      <Title>Season {seasonId} Leaderboard</Title>
      <Table>
        <Header>
          <tr>
            <HeaderColumn>Rank</HeaderColumn>
            <HeaderColumn>Address</HeaderColumn>
          </tr>
          <HeaderColumn>Score</HeaderColumn>
        </Header>
        <Body>
          {entries
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => (
              <Entry key={index} entry={entry} index={index} />
            ))}
        </Body>
      </Table>
    </Container>
  );
};

let N_MOCK_ENTRIES = 30;

let DUMMY = [] as SeasonLeaderboardEntry[];
for (let i = 0; i < N_MOCK_ENTRIES; i++) {
  DUMMY.push({
    address: '0x' + Math.floor(Math.random() * 10000000000000000).toString(16),
    games: [
      {
        configHash: '0x' + Math.floor(Math.random() * 10000000000000000).toString(16),
        score: Math.floor(i * Math.random() * 1000),
      },
      {
        configHash: '0x' + Math.floor(Math.random() * 10000000000000000).toString(16),
        score: Math.floor(i * Math.random() * 1000),
      },
      {
        configHash: '0x' + Math.floor(Math.random() * 10000000000000000).toString(16),
        score: Math.floor(i * Math.random() * 1000),
      },
    ],
    score: Math.floor(i * Math.random() * 1000),
  });
}

export const SeasonLeaderboard: React.FC = () => {
  const history = useHistory();
  // useEffect(() => {
  //   async function load() {
  //     const x = await loadSeasonLeaderboard();
  //     return x;
  //   }
  //   const y = load();
  //   console.log(y);
  // }, []);
  return (
    <div>
      <Topbar>
        <p
          style={{ fontWeight: 'bold', fontSize: '1.5em', cursor: 'pointer' }}
          onClick={() => history.push('/portal/home')}
        >
          Home
        </p>
        {/* <Account /> */}
      </Topbar>
      <Leaderboard seasonId={2} entries={DUMMY} />;
    </div>
  );
};

const Topbar = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
`;

const Container = styled.div`
  width: 66%;
  max-width: 640px;
  margin: 0 auto;
  padding: 3rem;
  text-align: center;
`;

const Title = styled.span`
  font-size: 1.5rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const Header = styled.thead`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
`;

const HeaderColumn = styled.th`
  vertical-align: bottom;
  line-height: 1rem;
  text-transform: uppercase;
`;

const Group = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const Body = styled.tbody`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
`;

const Row = styled.tr<{ expanded?: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  background: ${(props) => (props.expanded ? dfstyles.colors.backgroundlighter : 'transparent')};
  &:hover {
    background: ${dfstyles.colors.backgroundlighter};
  }
`;

const ExpandedGames = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  background: #000;
`;
