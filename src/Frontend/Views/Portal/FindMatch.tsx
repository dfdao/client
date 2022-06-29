import { EthAddress, LiveMatch } from '@darkforest_eth/types';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dfstyles from '../../Styles/dfstyles';
import { GenericErrorBoundary } from '../GenericErrorBoundary';
import { MinimalButton } from './PortalMainView';

export interface FindMatchProps {
  game: LiveMatch | undefined;
  error: Error | undefined;
  nPlayers: number;
}

export interface MatchDetails {
  creator: EthAddress;
  matchType: 'Solo' | '1v1';
  totalSpots: number;
  spotsTaken: number;
  matchId: string;
}

export const MatchComponent: React.FC<MatchDetails> = ({
  creator,
  matchType,
  totalSpots,
  spotsTaken,
  matchId,
}) => {
  return (
    <MatchContainer>
      <span>By {creator}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>{matchType}</span>
        <span style={{ color: dfstyles.colors.dfgreen }}>
          {spotsTaken} / {totalSpots} spots available
        </span>
      </div>
      <Link to={`https://arena.dfdao.xyz/play/${matchId}`}>
        <MatchButton>Join</MatchButton>
      </Link>
    </MatchContainer>
  );
};

export const FindMatch: React.FC<FindMatchProps> = ({ game, error, nPlayers }) => {
  return (
    <GenericErrorBoundary errorMessage={"Couldn't load matches"}>
      <Container>
        {game &&
          game.entries.map((entry) => (
            <MatchComponent
              creator={entry.firstMover.address as EthAddress}
              matchType='Solo'
              totalSpots={nPlayers}
              spotsTaken={1}
              matchId={entry.id}
            />
          ))}
      </Container>
    </GenericErrorBoundary>
  );
};

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${dfstyles.colors.borderDark};
  background: ${dfstyles.colors.backgrounddark};
  padding: 16px;
  border-radius: 6px;
  gap: 4px;
`;

const MatchButton = styled.button`
  border-radius: 3px;
  padding: 8px 16px;
  background: ${dfstyles.colors.backgroundlighter};
  border: 1px solid ${dfstyles.colors.border};
  color: #fff;
  text-transform: uppercase;
  transition: all 0.2s ease;
  &:hover {
    background: ${dfstyles.colors.border};
    text: ${dfstyles.colors.background};
  }
`;
