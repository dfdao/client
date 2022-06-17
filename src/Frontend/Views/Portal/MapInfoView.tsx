import { getConfigName } from '@darkforest_eth/procedural';
import { EthAddress, TooltipName } from '@darkforest_eth/types';
import React from 'react';
import styled from 'styled-components';
import { Btn } from '../../Components/Btn';
import { AccountLabel } from '../../Components/Labels/Labels';
import { Minimap } from '../../Components/Minimap';
import { Gold } from '../../Components/Text';
import { TextPreview } from '../../Components/TextPreview';
import { generateMinimapConfig } from '../../Panes/Lobbies/MinimapUtils';
import { LobbyInitializers } from '../../Panes/Lobbies/Reducer';
import { TooltipTrigger } from '../../Panes/Tooltip';
import dfstyles from '../../Styles/dfstyles';
import { useGameover, useUIManager } from '../../Utils/AppHooks';
import { competitiveConfig } from '../../Utils/constants';
import { ArenaLeaderboardDisplay } from '../ArenaLeaderboard';

export function MapInfoView({ configHash, config }: { configHash: string, config: LobbyInitializers | undefined  }) {

  const mapName = getConfigName(configHash);

  
  return (
    <MapInfoContainer>
      <OverviewContainer>
        <OverviewContainer style = {{textAlign: 'center'}}>
          {' '}
          <Title>{mapName}</Title>
          <TextPreview text={configHash} focusedWidth={'200px'} unFocusedWidth={'200px'} />
        </OverviewContainer>
        {!!config && <Minimap minimapConfig={generateMinimapConfig(config, 4)}/>}
        <Btn variant='portal' size = 'large'>
          <a target='blank' href='https://arena.dfdao.xyz/play'>
            Play Grand Prix
          </a>
        </Btn>
      </OverviewContainer>
      <ArenaLeaderboardDisplay config = {configHash}/>
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
`;

const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  // justify-content: flex-star;
  align-items: center;
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
