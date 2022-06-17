import { EthAddress, TooltipName } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { loadConfig } from '../../../Backend/Network/ConfigApi';
import { AccountLabel } from '../../Components/Labels/Labels';
import { Gold } from '../../Components/Text';
import { LobbyInitializers } from '../../Panes/Lobbies/Reducer';
import { TooltipTrigger } from '../../Panes/Tooltip';
import dfstyles from '../../Styles/dfstyles';
import { useGameover, useUIManager } from '../../Utils/AppHooks';
import { competitiveConfig } from '../../Utils/constants';
import { MapInfoView } from './MapInfoView';

export function PortalMainView({ address }: { address: EthAddress }) {

  const [config, setConfig] = useState<LobbyInitializers | undefined>()

  useEffect(() => {
    loadConfig().then((c) => setConfig(c));
  }, [])

  return (
    <MainContainer>
        <TopBar>
          <Title>Grand Prix</Title>
          <p style = {{fontSize: '1.5em'}}>Race the clock to get the fastest time!</p>
        </TopBar>
        <MapInfoView configHash = {competitiveConfig} config = {config}/>


    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex: 1 1;
  flex-direction: column;
  border-right: 1px solid ${dfstyles.colors.border};
  border-left: 1px solid ${dfstyles.colors.border};
  height: 100vh;
  overflow: hidden;
  padding-bottom: 3em;
`;

const TopBar = styled.div`
border-bottom: 1px solid ${dfstyles.colors.border};
// margin: auto;
height: 10em;
display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
width: 100%;
padding: 20px;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  display: grid;
  width: 100%;
  grid-template-columns: minmax(100px, min-content) minmax(100px, min-content);
  font-size: 3em;
  font-weight: 500;
  white-space: nowrap;
`
const TimeContainer = styled.div`
  font-size: 1em;
  text-align: center;
`;
