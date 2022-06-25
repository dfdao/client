import { PlanetTypeNames } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { LobbyPlanet } from '../Panes/Lobbies/LobbiesUtils';
import { LobbyAction, LobbyConfigState } from '../Panes/Lobbies/Reducer';
import { Checkbox } from './Input';

export interface LobbyPlanetInspectorProps {
  selectedPlanet: LobbyPlanet;
  selectedIndex: number;
  config: LobbyConfigState;
  updateConfig: React.Dispatch<LobbyAction>;
  onDelete: (deletedIndex: number) => void;
  onClose: () => void;
  root: string;
}

// This is the component that lets you edit staged planet params when editing a custom lobby map.

const PLANET_DESCRIPTION = [
  'Planets are the most basic type of celestial body. They can be found in all space types.',
  'Asteroid fields have half the defense of a same-level planet, making them cheap to take over while still maintaining the same energy growth and general functionality with silver production added on. This makes asteroid fields ideal for early expansion.',
  'Foundries contain artifacts that can be discovered by players.',
  'Spacetime rips are used to withdraw and deposit artifacts into and from the universe.',
  'Quasars can act as a resource battery in well-established player-owned regions of the universe.',
];

export const LobbyCreationPlanetInspector: React.FC<LobbyPlanetInspectorProps> = ({
  selectedPlanet,
  selectedIndex,
  updateConfig,
  config,
  onDelete,
  onClose,
  root,
}) => {
  const [mutablePlanet, setMutablePlanet] = useState<LobbyPlanet>(selectedPlanet);
  const history = useHistory();
  return (
    <Inspector>
      <InspectorInner>
        <InspectorTitle>{PlanetTypeNames[selectedPlanet.planetType]}</InspectorTitle>
        <span style={{ maxWidth: '320px' }}>{PLANET_DESCRIPTION[selectedPlanet.planetType]}</span>
        <InspectorTitle>Position</InspectorTitle>
        <LabeledInput>
          <span style={{ marginRight: '4px' }}>X</span>
          <InspectorInput
            value={mutablePlanet.x}
            onChange={(e) => {
              const newXValue = parseInt(e.target.value);
              if (Number.isNaN(newXValue)) return;
              setMutablePlanet({
                ...mutablePlanet,
                x: newXValue,
              });
            }}
          />
        </LabeledInput>
        <LabeledInput>
          <span style={{ marginRight: '4px' }}>Y</span>
          <InspectorInput
            value={mutablePlanet.y}
            onChange={(e) => {
              const newYValue = parseInt(e.target.value);
              if (Number.isNaN(newYValue)) return;
              setMutablePlanet({
                ...mutablePlanet,
                y: newYValue,
              });
            }}
          />
        </LabeledInput>
        <InspectorTitle>Level</InspectorTitle>
        <LabeledInput>
          <span>Level</span>
          <InspectorInput
            value={mutablePlanet.level}
            onChange={(e) => {
              const newLevelValue = parseInt(e.target.value);
              if (Number.isNaN(newLevelValue)) return;
              setMutablePlanet({
                ...mutablePlanet,
                level: newLevelValue,
              });
            }}
          />
        </LabeledInput>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
          <InspectorTitle>Special</InspectorTitle>
          {config.TARGET_PLANETS.displayValue ? (
            <Checkbox
              label='Target Planet'
              checked={mutablePlanet.isTargetPlanet}
              onChange={() => {
                setMutablePlanet({
                  ...mutablePlanet,
                  isTargetPlanet: !mutablePlanet.isTargetPlanet,
                });
              }}
            />
          ) : (
            <span onClick={() => history.push(`${root}/settings/arena`)}>
              Enable Target Planets
            </span>
          )}
          {config.MANUAL_SPAWN.displayValue ? (
            <Checkbox
              label='Spawn Planet'
              checked={mutablePlanet.isSpawnPlanet}
              onChange={() => {
                setMutablePlanet({ ...mutablePlanet, isSpawnPlanet: !mutablePlanet.isSpawnPlanet });
              }}
            />
          ) : (
            <span onClick={() => history.push(`${root}/settings/spawn`)}>Enable Spawn Planets</span>
          )}
        </div>
        {mutablePlanet !== selectedPlanet && (
          <Button
            primary
            onClick={() => {
              updateConfig({
                type: 'ADMIN_PLANETS',
                value: mutablePlanet,
                index: selectedIndex,
              });
            }}
          >
            Save changes
          </Button>
        )}
        <Button
          onClick={() => {
            if (!selectedPlanet) return;
            updateConfig({
              type: 'ADMIN_PLANETS',
              value: selectedPlanet,
              index: selectedIndex,
            });
            onDelete(selectedIndex);
          }}
        >
          Delete planet
        </Button>
      </InspectorInner>
    </Inspector>
  );
};

const Inspector = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 64px;
  min-width: 320px;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.05);
`;

const InspectorInner = styled.div`
  height: calc(100% - 68px);
  overflow-y: auto;
  padding: 12px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LabeledInput = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const InspectorInput = styled.input`
  border-radius: 2px;
  cursor: default;
  box-sizing: border-box;
  background-clip: padding-box;
  background-color: transparent;
  width: 100%;
  padding: 0 0 0 7px;
  height: 28px;
  border: 1px solid transparent;
  transition: 0.2s ease-in-out;
  min-width: 0;
  &:hover {
    border-color: gray;
  }
`;

const InspectorTitle = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #fff;
`;

const Button = styled.button<{ primary?: boolean }>`
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: ${({ primary }) => (primary ? '2px solid #2EE7BA' : '1px solid #5F5F5F')};
  color: ${({ primary }) => (primary ? '#2EE7BA' : '#fff')};
  background: ${({ primary }) => (primary ? '#09352B' : '#252525')};
  padding: 16px;
  border-radius: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 80ms ease 0s, border-color;
  &:hover {
    background: ${({ primary }) => (primary ? '#0E5141' : '#3D3D3D')};
    border-color: ${({ primary }) => (primary ? '#30FFCD' : '#797979')};
  }
`;
