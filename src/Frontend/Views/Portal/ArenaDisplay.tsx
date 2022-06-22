import { getConfigName } from '@darkforest_eth/procedural';
import { GraphArena } from '@darkforest_eth/types';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { convertGraphConfig } from '../../../Backend/Network/ConfigApi';
import { Minimap } from '../../Components/Minimap';
import { TextPreview } from '../../Components/TextPreview';
import { generateMinimapConfig } from '../../Panes/Lobbies/MinimapUtils';
import { LobbyInitializers } from '../../Panes/Lobbies/Reducer';

export interface ArenaData {
  configHash: string;
  startTime: number;
  config: LobbyInitializers;
  count: number;
}

function convertGraphArena(arena: GraphArena): ArenaData {
  return {
    configHash: arena.configHash,
    startTime: arena.startTime,
    count: 1,
    config: convertGraphConfig(arena).config,
  };
}

const mapSize = '125px';

function ArenaCard({ arena }: { arena: ArenaData }) {
  return (
    <Link
      to={`/portal/map/${arena.configHash}`}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '50%',
        background: 'rgba(255, 255, 255, 0.04)',
        padding: '5px',
        gap: '5px'
      }}
    >
      <Minimap
        style={{ height: mapSize, width: mapSize }}
        minimapConfig={generateMinimapConfig(arena.config, 10)}
      />
      <DetailsContainer>
        <div style={{ fontSize: '1.5em' }}>{getConfigName(arena.configHash)}</div>
        <TextPreview text={arena.configHash} />
        <span>Games Played: {arena.count}</span>
      </DetailsContainer>
    </Link>
  );
}

export function ArenaDisplay({ arenas }: { arenas: { arena: GraphArena }[] | undefined }) {
  if (!arenas) return <></>;
  const uniqueArenas: ArenaData[] = [];
  for (const arena of arenas) {
    const found = uniqueArenas.find((a) => a.configHash == arena.arena.configHash);
    if (found) found.count++;
    else if (!!arena.arena.config) uniqueArenas.push(convertGraphArena(arena.arena));
  }

  return (
    <MapInfoContainer>
      {uniqueArenas.map((arena) => (
        <ArenaCard arena={arena} />
      ))}
    </MapInfoContainer>
  );
}

const MapInfoContainer = styled.div`
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
`;

const ArenaCardContainer = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  background: 'rgba(255, 255, 255, 0.04)',
};

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;
`;
