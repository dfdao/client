import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { LobbyAdminTools } from '../../Backend/Utils/LobbyAdminTools';
import { Spacer } from '../Components/CoreUI';
import { Minimap } from '../Components/Minimap';
import { ConfigUpload } from '../Panes/Lobbies/LobbiesUtils';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import { LobbyAction, lobbyConfigInit, LobbyInitializers } from '../Panes/Lobbies/Reducer';
import { stockConfig } from '../Utils/StockConfigs';

export const LobbyMapSelectPage: React.FC<{
  startingConfig: LobbyInitializers;
  updateConfig: React.Dispatch<LobbyAction>;
  lobbyAdminTools: LobbyAdminTools | undefined;
  createDisabled: boolean;
  root: string;
  setError: (error: string) => void;
}> = ({ startingConfig, updateConfig, lobbyAdminTools, createDisabled, root, setError }) => {
  const mapSize = '250px';
  const history = useHistory();

  function pickMap(initializers: LobbyInitializers, active?: number) {
    updateConfig({ type: 'RESET', value: lobbyConfigInit(initializers) });
    history.push(`${root}/confirm`);
  }

  function generateMinimapConfig(config: LobbyInitializers): MinimapConfig {
    return {
      worldRadius: config.WORLD_RADIUS_MIN,
      key: config.SPACETYPE_KEY,
      scale: config.PERLIN_LENGTH_SCALE,
      mirrorX: config.PERLIN_MIRROR_X,
      mirrorY: config.PERLIN_MIRROR_Y,
      perlinThreshold1: config.PERLIN_THRESHOLD_1,
      perlinThreshold2: config.PERLIN_THRESHOLD_2,
      perlinThreshold3: config.PERLIN_THRESHOLD_3,
      stagedPlanets: config.ADMIN_PLANETS || [],
      createdPlanets: lobbyAdminTools?.planets || [],
      dot: 10,
    } as MinimapConfig;
  }

  interface map {
    title: string;
    initializers: LobbyInitializers;
    description: string;
  }

  const stockMaps: map[] = [
    {
      title: '(1P) Grand Prix',
      initializers: stockConfig.onePlayerRace,
      description: "Try this week's competitive event!",
    },
    {
      title: '(4P) Battle for the Center',
      initializers: stockConfig.fourPlayerBattle,
      description: 'Win the planet in the center!',
    },
    {
      title: '(2P) Race',
      initializers: stockConfig.sprint,
      description: 'Sprint for the target!',
    },
    {
      title: 'Custom',
      initializers: startingConfig,
      description: 'Design your own game',
    },
  ];

  return (
    <Container>
      <GradientBg>
        <Title>Create a new Arena Match</Title>
      </GradientBg>
      <MapsContainer>
        {stockMaps.map((mapContent, idx) => (
          <MapItem key={`map-item-${idx}`} onClick={() => pickMap(mapContent.initializers, idx)}>
            <Minimap
              style={{ height: mapSize, width: mapSize }}
              minimapConfig={generateMinimapConfig(mapContent.initializers)}
            />
            <Spacer height={32} />
            <MapItemText>
              <MapTitle>{mapContent.title}</MapTitle>
              <span>{mapContent.description}</span>
              <span>Radius: {mapContent.initializers.WORLD_RADIUS_MIN}</span>
            </MapItemText>
          </MapItem>
        ))}
      </MapsContainer>
      <ConfigUpload
        renderer={() => (
          <UploadCustomMapContainer disabled={createDisabled}>
            <span>Upload custom map (JSON)</span>
          </UploadCustomMapContainer>
        )}
        disabled={createDisabled}
        onError={setError}
        onUpload={pickMap}
      />
    </Container>
  );
};

const Title = styled.span`
  font-size: 32px;
  letter-spacing: 0.06em;
  color: #fff;
  text-transform: uppercase;
`;

const Container = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const GradientBg = styled.div`
  position: relative;
  aspect-ratio: 1600/200;
  width: 100%;
  background: linear-gradient(270deg, #7243a5 0%, #d3969d 100%);
  display: flex;
  align-items: center;
  padding: 24px;
  margin-bottom: 24px;
`;

const UploadCustomMapContainer = styled.div<{ disabled: boolean }>`
  color: #fff;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-top: 24px;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border-radius: 3px;
  width: 100%;
  transition: 0.2s all ease-in-out;
  &:hover {
    background: #252525;
  }
`;

const MapItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #252525;
  border: 1px solid #fff;
  cursor: pointer;
  color: #fff;
  padding: 16px;
  border-radius: 4px;
  aspect-ratio: 3/4;
  transition: 0.2s ease-in-out;
  &:hover {
    background: #00212c;
    color: #8ae4ff;
    border-color: #8ae4ff;
  }
`;

const MapItemText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const MapsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 32px;
`;

const MapTitle = styled.span`
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
`;
