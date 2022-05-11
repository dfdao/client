import { ArenaLeaderboard, ArtifactRarity } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Spacer } from '../Components/CoreUI';
import { TwitterLink } from '../Components/Labels/Labels';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { Red } from '../Components/Text';
import { TextPreview } from '../Components/TextPreview';
import { RarityColors } from '../Styles/Colors';
import dfstyles from '../Styles/dfstyles';
import { useArenaLeaderboard } from '../Utils/AppHooks';
import { formatDuration } from '../Utils/TimeUtils';
import { GenericErrorBoundary } from './GenericErrorBoundary';
import { Table } from './Table';

export function ArenaLeaderboard() {
  const { leaderboard, error } = useArenaLeaderboard();

  const errorMessage = 'Error Loading Leaderboard';

  return (
    <GenericErrorBoundary errorMessage={errorMessage}>
      {!leaderboard && !error && <LoadingSpinner initialText={'Loading Leaderboard...'} />}
      {leaderboard && <ArenaLeaderboardBody leaderboard={leaderboard} />}
      {error && <Red>{errorMessage}</Red>}
    </GenericErrorBoundary>
  );
}

function scoreToString(score?: number | null) {
  if (score === null || score === undefined) {
    return 'n/a';
  }
  score = Math.floor(score);
  if (score < 10000) {
    return score + '';
  }

  return score.toLocaleString();
}

// pass in either an address, or a twitter handle. this function will render the appropriate
// component
function playerToEntry(playerStr: string, color: string) {
  // if this is an address
  if (playerStr.startsWith('0x') && playerStr.length === 42) {
    return <TextPreview text={playerStr} focusedWidth={'150px'} unFocusedWidth={'150px'} />;
  }

  return <TwitterLink twitter={playerStr} color={color} />;
}

function getRankColor([rank, score]: [number, number | undefined]) {
  if (score === undefined || score === null) {
    return dfstyles.colors.subtext;
  }

  if (score === 0) {
    return RarityColors[ArtifactRarity.Legendary];

  }

  return dfstyles.colors.dfgreen;
}

function ArenaLeaderboardTable({ rows }: { rows: Array<[string, number | undefined, number | undefined]> }) {
  return (
    <TableContainer>
      <Table
        alignments={['r', 'l', 'r']}
        headers={[
          <Cell key='player'>player</Cell>,
          <Cell key='score'>games</Cell>,
          <Cell key='place'>wins</Cell>,
        ]}
        rows={rows}
        columns={[
          (row: [string, number | undefined, number | undefined], i) => {
            const color = getRankColor([i, row[2]]);
            return <Cell style={{ color }}>{playerToEntry(row[0], color)}</Cell>;
          },
          (row: [string, number | undefined, number | undefined], i) => (
            <Cell style={{ color: getRankColor([i, row[2]]) }}>
              {row[1] === undefined || row[1] === null ? '0' : scoreToString(row[1])}
            </Cell>
          ),
        
          (row: [string, number | undefined, number | undefined], i) => {
            return (
              <Cell style={{ color: getRankColor([i, row[2]]) }}>{scoreToString(row[2])}</Cell>
            );
          },
        ]}
      />
    </TableContainer>
  );
}

// TODO: update this each round, or pull from contract constants
const roundEndTimestamp = '2022-03-01T05:00:00.000Z';
const roundEndTime = new Date(roundEndTimestamp).getTime();

function CountDown() {
  const [str, setStr] = useState('');

  const update = () => {
    const timeUntilEndms = roundEndTime - new Date().getTime();
    if (timeUntilEndms <= 0) {
      setStr('yes');
    } else {
      setStr(formatDuration(timeUntilEndms));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      update();
    }, 499);

    update();

    return () => clearInterval(interval);
  }, []);

  return <>{str}</>;
}

function ArenaLeaderboardBody({ leaderboard }: { leaderboard: ArenaLeaderboard }) {

  leaderboard.entries.sort((a, b) => {
    if (typeof a.wins !== 'number' && typeof b.wins !== 'number') {
      return 0;
    } else if (typeof a.wins !== 'number') {
      return 1;
    } else if (typeof b.wins !== 'number') {
      return -1;
    }

    return b.wins - a.wins;
  });

  const rows: [string, number | undefined, number | undefined][] = leaderboard.entries.map((entry) => {
    if (typeof entry.twitter === 'string') {
      return [entry.twitter, entry.games, entry.wins];
    }

    return [entry.address, entry.games, entry.wins];
  });

  return (
    <div>
      <StatsTableContainer>
        <StatsTable>
          <tbody>
          
            <tr>
              <td>players</td>
              <td>{leaderboard.entries.length}</td>
            </tr>
            <tr>
              <td>lobbies created</td>
              <td>{leaderboard.entries.reduce((partialSum, a) => partialSum + a.games, 0)}</td>
            </tr>
          </tbody>
        </StatsTable>
      </StatsTableContainer>
      <Spacer height={8} />
      <ArenaLeaderboardTable rows={rows} />
    </div>
  );
}

const Cell = styled.div`
  padding: 4px 8px;
  color: ${dfstyles.colors.text};
`;

const TableContainer = styled.div`
  display: inline-block;
  border-radius: 2px 2px 0 0px;
  border-bottom: none;
  padding: 16px;
`;

const StatsTableContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${dfstyles.colors.text};
`;

const StatsTable = styled.table`
  td {
    padding: 4px 8px;

    &:first-child {
      text-align: right;
      color: ${dfstyles.colors.subtext};
    }

    &:last-child {
      text-align: left;
    }
  }
`;
