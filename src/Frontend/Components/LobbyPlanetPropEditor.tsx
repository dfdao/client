import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LobbyPlanet, PLANET_TYPE_NAMES, SelectMultipleFrom } from '../Panes/Lobbies/LobbiesUtils';
import { SelectFrom } from './CoreUI';
import Select from 'react-select';
import { Checkbox, NumberInput, DarkForestCheckbox, DarkForestNumberInput } from './Input';
import styled from 'styled-components';
import { WorldCoords } from '@darkforest_eth/types';
import stringify from 'json-stable-stringify';

export interface PlanetPropEditorProps {
  selectedPlanet: LobbyPlanet;
  canAddPlanets: boolean;
  targetPlanetsEnabled: boolean;
  spawnPlanetsEnabled: boolean;
  blockEnabled: boolean;
  stagedPlanets: LobbyPlanet[];
  root: string;
  excludePlanetTypes?: planetInputType[];
  onChange: (planet: LobbyPlanet) => void;
}

export type planetInputType =
  | 'x'
  | 'y'
  | 'level'
  | 'planetType'
  | 'isSpawnPlanet'
  | 'isTargetPlanet'
  | 'blockedPlanetLocs';
const displayProperties = ['x', 'y', 'Level', 'Type', 'Target?', 'Spawn?', 'Blocked Planets'];

export const PlanetPropEditor: React.FC<PlanetPropEditorProps> = ({
  selectedPlanet,
  canAddPlanets,
  targetPlanetsEnabled,
  spawnPlanetsEnabled,
  blockEnabled,
  stagedPlanets,
  excludePlanetTypes,
  root,
  onChange,
}) => {
  const [mutablePlanet, setMutablePlanet] = useState<LobbyPlanet>(selectedPlanet);
  const [selectedBlocks, setSelectedBlocks] = useState<{label: string, value: WorldCoords}[]>([])
  const history = useHistory();

  useEffect(() => {
    setMutablePlanet(selectedPlanet);
  }, [selectedPlanet]);

  useEffect(() => {
    onChange({...mutablePlanet, blockedPlanetLocs : selectedBlocks.map(block => block.value)});
  }, [mutablePlanet, selectedBlocks]);

  function planetInput(value: planetInputType, index: number) {
    let content = null;
    if (value == 'x' || value == 'y') {
      content = (
        <NumberInput
          format='integer'
          value={mutablePlanet[value]}
          onChange={(e: Event & React.ChangeEvent<DarkForestNumberInput>) => {
            setMutablePlanet({ ...mutablePlanet, [value]: e.target.value });
          }}
        />
      );
    } else if (value == 'level') {
      content = (
        // if we use a Select instead of an Input, we can enforce a max + min level value client-side
        <SelectFrom
          wide={false}
          style={{ padding: '5px' }}
          values={[...Array(10).keys()].map((i) => i.toString())}
          labels={[...Array(10).keys()].map((i) => i.toString())}
          value={mutablePlanet.level.toString()}
          setValue={(value) => setMutablePlanet({ ...mutablePlanet, level: parseInt(value) })}
        />
      );
    } else if (value == 'planetType') {
      content = (
        <SelectFrom
          wide={false}
          style={{ padding: '5px' }}
          values={PLANET_TYPE_NAMES}
          labels={PLANET_TYPE_NAMES}
          value={PLANET_TYPE_NAMES[mutablePlanet.planetType]}
          setValue={(value) =>
            setMutablePlanet({ ...mutablePlanet, planetType: PLANET_TYPE_NAMES.indexOf(value) })
          }
        />
      );
    } else if (value == 'isTargetPlanet') {
      {
        targetPlanetsEnabled
          ? (content = (
              <Checkbox
                checked={mutablePlanet.isTargetPlanet}
                onChange={() => {
                  setMutablePlanet({
                    ...mutablePlanet,
                    isTargetPlanet: !mutablePlanet.isTargetPlanet,
                  });
                }}
              />
            ))
          : (content = (
              <Hoverable onClick={() => history.push(`${root}/settings/arena`)}>Enable</Hoverable>
            ));
      }
    } else if (value == 'isSpawnPlanet') {
      {
        spawnPlanetsEnabled
          ? (content = (
              <Checkbox
                checked={mutablePlanet.isSpawnPlanet}
                onChange={() => {
                  setMutablePlanet({
                    ...mutablePlanet,
                    isSpawnPlanet: !mutablePlanet.isSpawnPlanet,
                  });
                }}
              />
            ))
          : (content = (
              <Hoverable onClick={() => history.push(`${root}/settings/spawn`)}>Enable</Hoverable>
            ));
      }
    } else if (value == 'blockedPlanetLocs') {
      const options = stagedPlanets.map((planet) => {return { label: `(x:${planet.x},y: ${planet.y})`, value: planet }});
      const handleChange = (selected: any) => {
        setSelectedBlocks(selected);
      };
      {
        blockEnabled
          ? (content = (
              <Select
                name='Blocked Planets'
                options={options}
                isMulti
                value={selectedBlocks}
                onChange={handleChange}
              />
            ))
          : (content = (
              <Hoverable onClick={() => history.push(`${root}/settings/admin`)}>Enable</Hoverable>
            ));
      }
    } else {
      content = (
        <Checkbox
          checked={(mutablePlanet as any)[value]}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) => {
            setMutablePlanet({ ...mutablePlanet, [value]: e.target.checked });
          }}
        />
      );
    }

    return (
      <InputRow key={`input-row-${index}`}>
        <LabeledInput>
          {displayProperties[index]}{' '}
        </LabeledInput>
        {content}
      </InputRow>
    );
  }

  if (!canAddPlanets) return <></>;

  return (
    <>
      {Object.keys(selectedPlanet).map(
        (value: planetInputType, index: number) =>
          !(excludePlanetTypes && excludePlanetTypes.includes(value)) && planetInput(value, index)
      )}
    </>
  );
};

export const InputRow = styled.div`
  display: flex;
  align-items: center;
`;

export const LabeledInput = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Hoverable = styled.div`
  cursor: pointer;
  background: transparent;
  padding: 4px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }
`;
