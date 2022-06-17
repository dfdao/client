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
  const [config, setConfig] = useState<LobbyInitializers | undefined>();

  useEffect(() => {
    loadConfig().then((c) => setConfig(c));
  }, []);

  return (
    <MainContainer>
      <TopBar>
        <TitleContainer>
          <Title>Grand Prix </Title>
          <p>Race the clock to get the fastest time!</p>
        </TitleContainer>
      </TopBar>
      <MapInfoView configHash={competitiveConfig} config={config} />
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex: 1 1;
  flex-direction: column;
  border-left: 1px solid ${dfstyles.colors.border};
  height: 100vh;
  overflow: hidden;
  padding-bottom: 3em;
  background: rgba(255, 255, 255, 0.04);

`;

const TopBar = styled.div`
  border-bottom: 1px solid ${dfstyles.colors.border};

  height: 56px;
  max-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding-inline: 16px;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 1.5em;
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  display: grid;
  width: 100%;
  grid-template-columns: minmax(100px, min-content) minmax(100px, min-content);
  white-space: nowrap;
  justify-content: space-between;
`;
const TimeContainer = styled.div`
  font-size: 1em;
  text-align: center;
`;
