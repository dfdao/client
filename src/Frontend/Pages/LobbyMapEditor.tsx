import { EthAddress, WorldCoords } from '@darkforest_eth/types';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { LobbyAdminTools } from '../../Backend/Utils/LobbyAdminTools';
import Button from '../Components/Button';
import { SelectFrom, Spacer } from '../Components/CoreUI';
import {
  Checkbox,
  DarkForestCheckbox,
  DarkForestNumberInput,
  NumberInput,
} from '../Components/Input';
import { LoadingSpinner } from '../Components/LoadingSpinner';
import { LobbyCreationPlanetInspector } from '../Components/LobbyCreationPlanetInspector';
import { Minimap } from '../Components/Minimap';
import { MinimapEditor } from '../Components/MinimapEditor';
import { Sidebar } from '../Components/Sidebar';
import {
  AsteroidIcon,
  ConfigDownload,
  FoundryIcon,
  LobbyPlanet,
  PlanetIcon,
  QuasarIcon,
  SpacetimeIcon,
} from '../Panes/Lobbies/LobbiesUtils';
import { KEY_ITEMS } from '../Panes/Lobbies/MinimapPane';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import { PlanetListPane } from '../Panes/Lobbies/PlanetListPane';
import {
  LobbyAction,
  lobbyConfigInit,
  LobbyConfigState,
  LobbyInitializers,
} from '../Panes/Lobbies/Reducer';

type PlanetTypes = 'Planet' | 'Asteroid Field' | 'Foundry' | 'Spacetime Rip' | 'Quasar';

const defaultPlanet: LobbyPlanet = {
  x: 0,
  y: 0,
  level: 0,
  planetType: 0,
  isTargetPlanet: false,
  isSpawnPlanet: false,
};

export const LobbyMapEditor: React.FC<{
  updateConfig: React.Dispatch<LobbyAction>;
  config: LobbyConfigState;
  lobbyAdminTools: LobbyAdminTools | undefined;
  createDisabled: boolean;
  root: string;
  minimapConfig: MinimapConfig | undefined;
  ownerAddress: EthAddress;
  onError: (msg: string) => void;
}> = ({
  updateConfig,
  config,
  lobbyAdminTools,
  createDisabled,
  root,
  minimapConfig,
  onError,
  ownerAddress,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState<number | undefined>();
  const [selectedPlanet, setSelectedPlanet] = useState<LobbyPlanet | undefined>();
  const [selectedPlanetTool, setSelectedPlanetTool] = useState<PlanetTypes>('Planet');
  const [mutablePlanet, setMutablePlanet] = useState<LobbyPlanet>(defaultPlanet);
  const [placementMode, setPlacementMode] = useState<boolean>(false);
  const history = useHistory();

  const planetTypeNames = ['Planet', 'Asteroid Field', 'Foundry', 'Spacetime Rip', 'Quasar'];

  const randomizeMap = () => {
    console.log('randomizing!!!');
    const seed = Math.floor(Math.random() * 10000);
    updateConfig({ type: 'PLANETHASH_KEY', value: seed });
    updateConfig({ type: 'SPACETYPE_KEY', value: seed + 1 });
    updateConfig({ type: 'BIOMEBASE_KEY', value: seed + 2 });
  };

  const stagePlanet = (planetCoord: WorldCoords) => {
    const newPlanetToStage: LobbyPlanet = {
      x: planetCoord.x,
      y: planetCoord.y,
      level: mutablePlanet.level,
      planetType: mutablePlanet.planetType,
      isTargetPlanet: mutablePlanet.isTargetPlanet,
      isSpawnPlanet: mutablePlanet.isSpawnPlanet,
    };

    updateConfig({
      type: 'ADMIN_PLANETS',
      value: newPlanetToStage,
      index: config.ADMIN_PLANETS.displayValue?.length || 0,
    });
  };

  return (
    <Container>
      <Sidebar previousPath={`${root}/confirm`} title={'← Confirm map'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span>Add a planet</span>
          <SelectFrom
            wide={false}
            style={{ padding: '5px' }}
            values={planetTypeNames}
            labels={planetTypeNames}
            value={planetTypeNames[mutablePlanet.planetType]}
            setValue={(value) =>
              setMutablePlanet({ ...mutablePlanet, planetType: planetTypeNames.indexOf(value) })
            }
          />
          <NumberInput
            format='integer'
            placeholder='Level'
            value={mutablePlanet.level}
            onChange={(e: Event & React.ChangeEvent<DarkForestNumberInput>) => {
              setMutablePlanet({ ...mutablePlanet, level: e.target.value as number });
            }}
          />
          <span>Target?</span>
          <Checkbox
            checked={mutablePlanet.isTargetPlanet}
            onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) => {
              setMutablePlanet({ ...mutablePlanet, isTargetPlanet: e.target.checked });
            }}
          />
          <span>Spawn?</span>
          <Checkbox
            checked={mutablePlanet.isSpawnPlanet}
            onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) => {
              setMutablePlanet({ ...mutablePlanet, isSpawnPlanet: e.target.checked });
            }}
          />
          <EditorButton cancel={placementMode} onClick={() => setPlacementMode(!placementMode)}>
            {placementMode ? 'Cancel (ESC)' : 'Set coordinates on map (S)'}
          </EditorButton>
        </div>
        <Spacer height={32} />
        <PlanetListPane
          config={config}
          onUpdate={updateConfig}
          lobbyAdminTools={lobbyAdminTools}
          onPlanetHover={(planet) => {}}
          onError={onError}
          onPlanetSelect={(planet: LobbyPlanet, index: number) => {
            setSelectedPlanet(planet);
            setSelectedPlanetIndex(index);
          }}
          root={root}
        />
      </Sidebar>
      <MainContent>
        <MainContentInner>
          <Spacer height={64} />
          <MinimapEditorWrapper>
            <MinimapEditor
              style={{ width: '400px', height: '400px' }}
              onError={onError}
              onClick={(coords: WorldCoords) => {
                stagePlanet(coords);
                setPlacementMode(false);
              }}
              minimapConfig={minimapConfig}
              disabled={!placementMode}
            />
            <Minimap
              style={{ width: '400px', height: '400px' }}
              minimapConfig={minimapConfig}
              setRefreshing={setRefreshing}
            />
          </MinimapEditorWrapper>
          <div style={{ textAlign: 'center', height: '24px' }}>
            {refreshing ? <LoadingSpinner initialText='Refreshing...' /> : null}
          </div>
          <LobbyButton
            onClick={() => {
              randomizeMap();
            }}
          >
            Randomize Map
          </LobbyButton>
          <LobbyButton primary onClick={() => history.push(`${root}/confirm`)}>
            Save Changes
          </LobbyButton>
          <ConfigDownload
            renderer={() => (!createDisabled ? <span>Save custom map (JSON)</span> : <></>)}
            disabled={createDisabled}
            address={ownerAddress}
            onError={onError}
            config={config}
          />
        </MainContentInner>
      </MainContent>
      {selectedPlanet && selectedPlanetIndex !== undefined && (
        <LobbyCreationPlanetInspector
          selectedPlanet={selectedPlanet}
          selectedIndex={selectedPlanetIndex}
          config={config}
          updateConfig={updateConfig}
          onDelete={() => setSelectedPlanetIndex(undefined)}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  align-items: stretch;
`;

const MainContent = styled.div`
  position: relative;
  overflow: auto;
  place-items: stretch;
  display: flex;
  flex-shrink: initial;
  flex-basis: initial;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`;

const MainContentInner = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
  width: 100%;
  max-width: 640px;
  // margin: 0 24px;
  margin: 0 auto;
`;

const SidebarButton = styled.div<{ active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 3px;
  color: #fff;
  background: ${(props) => (props.active ? '#252525' : 'transparent')};
  &:hover {
    background: #252525;
  }
`;

const LobbyButton = styled.button<{ primary?: boolean }>`
  background: #000;
  color: ${({ primary }) => (primary ? '#2ee7ba' : '#fff')};
  border: ${({ primary }) => (primary ? '2px solid #2ee7ba' : '2px solid #fff')};
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MinimapEditorWrapper = styled.div`
  display: grid;
  grid-template: 1fr / 1fr;
  place-items: center;
  margin: 0 auto;
  border: 3px solid blue;
`;

const EditorButton = styled.button<{ cancel: boolean }>`
  background: ${({ cancel }) => (cancel ? '#5B1522' : '#525252')};
  border: ${({ cancel }) => (cancel ? '1px solid #FF4163' : '1px solid #7a7d88')};
  color: ${({ cancel }) => (cancel ? '#FF4163' : '#fff')};
  padding: 8px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
