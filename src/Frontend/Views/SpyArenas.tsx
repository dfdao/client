import { SpyArena } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { Link } from '../Components/CoreUI';
import { Gnosis } from '../Components/Icons';
import { TwitterLink } from '../Components/Labels/Labels';
import { Red, Subber } from '../Components/Text';
import { TextPreview } from '../Components/TextPreview';
import dfstyles from '../Styles/dfstyles';
import { useSpyArenas } from '../Utils/AppHooks';
import { formatDuration } from '../Utils/TimeUtils';
import { GenericErrorBoundary } from './GenericErrorBoundary';
import { Table } from './Table';

const errorMessage = 'Error Loading Leaderboard';

export function SpyArenaDisplay() {
  const { spyArenas, spyError } = useSpyArenas();

  return (
    <GenericErrorBoundary errorMessage={errorMessage}>
      <LeaderboardContainer>
        <LeaderboardBody leaderboard={spyArenas} error={spyError}/>
      </LeaderboardContainer>
    </GenericErrorBoundary>
  );
}

// pass in either an address, or a twitter handle. this function will render the appropriate
// component
function playerToEntry(playerAddress: string, playerTwitter: string | undefined) {
  return (
    <span
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '5px' }}
    >
      {playerTwitter ? (
        <TwitterLink twitter={playerTwitter} />
      ) : (
        <TextPreview text={playerAddress} focusedWidth={'150px'} unFocusedWidth={'150px'} />
      )}

      <a
        style={{ display: 'flex', alignItems: 'center' }}
        target='_blank'
        href={`https://blockscout.com/xdai/optimism/address/${playerAddress}`}
      >
        <GnoButton>
          <Gnosis height='25px' width='25Fpx' />
        </GnoButton>
      </a>
    </span>
  );
}

type Row = {
  address: string;
  twitter?: string;
  startTime: number;
  id: string;
};

function LeaderboardTable({ rows }: { rows: Row[] }) {
  if (rows.length == 0) return <Subber>No players finished</Subber>;

  const [durations, setDurations] = useState<number[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const times: number[] = [];
      rows.forEach((r) => times.push(Date.now() - r.startTime * 1000));
      setDurations(times);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TableContainer>
      <Table
        alignments={['c', 'c', 'c', 'c']}
        headers={[
          <Cell key='player'>Player</Cell>,
          <Cell key='lobby'>Arena ID</Cell>,
          <Cell key='duration'>Duration</Cell>,
          <Cell key='go'></Cell>,
        ]}
        rows={rows}
        columns={[
          (row: Row, i) => {
            return <Cell>{playerToEntry(row.address, row.twitter)}</Cell>;
          },
          (row: Row, i) => {
            return (
              <Cell>
                <TextPreview text={row.id} focusedWidth={'150px'} unFocusedWidth={'150px'} />
              </Cell>
            );
          },
          (row: Row, i) => {
            return <Cell>{durations[i] ? formatDuration(durations[i]) : 'loading...'}</Cell>;
          },
          (row: Row, i) => {
            return (
              <Cell>
                <Link to={`https://arena.dfdao.xyz/play/${row.id}`}>
                  <Btn>View</Btn>
                </Link>
              </Cell>
            );
          },
        ]}
      />
    </TableContainer>
  );
}

function LeaderboardBody({
  leaderboard,
  error,
}: {
  leaderboard: SpyArena | undefined;
  error: Error | undefined;
}) {
  if (error) {
    return (
      <LeaderboardContainer>
        <Red>{errorMessage}</Red>
      </LeaderboardContainer>
    );
  }

  if (leaderboard == undefined) {
    return <Subber>Leaderboard loading...</Subber>;
  }

  console.log('entries', leaderboard.entries);
  leaderboard.entries.sort((a, b) => {
    if (typeof a.startTime !== 'number' && typeof b.startTime !== 'number') {
      return 0;
    } else if (typeof a.startTime !== 'number') {
      return 1;
    } else if (typeof b.startTime !== 'number') {
      return -1;
    }

    return b.startTime - a.startTime;
  });

  const competitiveRows: Row[] = leaderboard.entries.map((entry) => {
    return {
      id: entry.id,
      address: entry.firstMover.address,
      twitter: entry.twitter,
      startTime: entry.startTime,
    };
  });

  return <LeaderboardTable rows={competitiveRows} />;
}

const Cell = styled.div`
  padding: 4px 8px;
  color: ${dfstyles.colors.text};
  background: transparent;
`;

const TableContainer = styled.div`
  display: inline-block;
  border-radius: 2px 2px 0 0px;
  border-bottom: none;
  padding: 16px;
`;

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const GnoButton = styled.button`
  // background-color: ${dfstyles.colors.text};
  border-radius: 30%;
  border-color: ${dfstyles.colors.border};
`;
