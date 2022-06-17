import { getConfigName } from '@darkforest_eth/procedural';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../../Components/Btn';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Minimap } from '../../Components/Minimap';
import { TextPreview } from '../../Components/TextPreview';
import { generateMinimapConfig } from '../../Panes/Lobbies/MinimapUtils';
import { LobbyInitializers } from '../../Panes/Lobbies/Reducer';

import { MapDetails } from './MapDetails';

function MapOverview({
  configHash,
  config,
}: {
  configHash: string;
  config: LobbyInitializers | undefined;
}) {
  const [refreshing, setRefreshing] = useState(false);

  const mapName = getConfigName(configHash);

  return (
    <OverviewContainer>
      <div>
        <Title>{mapName}</Title>
        <TextPreview text={configHash} focusedWidth={'200px'} unFocusedWidth={'200px'} />
      </div>

      {!config ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '300px',
            height: '300px',
          }}
        >
          <LoadingSpinner initialText='Loading...' />
        </div>
      ) : (
        <Minimap
          style={{ width: '300px', height: '300px' }}
          minimapConfig={generateMinimapConfig(config, 5)}
          setRefreshing={setRefreshing}
        />
      )}
      <Btn variant='portal' size='large'>
        <a target='blank' href='https://arena.dfdao.xyz/play'>
          Play Grand Prix
        </a>
      </Btn>
    </OverviewContainer>
  );
}

export function MapInfoView({
  configHash,
  config,
}: {
  configHash: string;
  config: LobbyInitializers | undefined;
}) {
  return (
    <MapInfoContainer>
      <MapOverview configHash={configHash} config={config} />
      <MapDetails configHash={configHash} config={config} />
    </MapInfoContainer>
  );
}

const MapInfoContainer = styled.div`
  display: flex;
  flex: 1 1;
  flex-direction: row;
  height: 100%;
  width: 100%;
  justify-content: space-evenly;
  padding-top: 20px;
`;

const OverviewContainer = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.div`
  display: flex;
  text-align: center;
  font-size: 3em;
  white-space: nowrap;
`;
const TimeContainer = styled.div`
  font-size: 1em;
  text-align: center;
`;
