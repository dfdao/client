import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LobbyPlanet, PLANET_TYPE_NAMES, SelectMultipleFrom } from '../Panes/Lobbies/LobbiesUtils';
import { SelectFrom } from './CoreUI';
import Select from 'react-select';
import { Checkbox, NumberInput, DarkForestCheckbox, DarkForestNumberInput } from './Input';
import styled from 'styled-components';
import { WorldCoords } from '@darkforest_eth/types';
import stringify from 'json-stable-stringify';
import dfstyles from '../Styles/dfstyles';

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
  const history = useHistory();

  function planetInput(value: planetInputType, index: number) {
    let content = null;
    if (value == 'x' || value == 'y') {
      content = (
        <NumberInput
          format='integer'
          value={selectedPlanet[value]}
          onChange={(e: Event & React.ChangeEvent<DarkForestNumberInput>) => {
            onChange({ ...selectedPlanet, [value]: e.target.value });
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
          value={selectedPlanet.level.toString()}
          setValue={(value) => onChange({ ...selectedPlanet, level: parseInt(value) })}
        />
      );
    } else if (value == 'planetType') {
      content = (
        <SelectFrom
          wide={false}
          style={{ padding: '5px' }}
          values={PLANET_TYPE_NAMES}
          labels={PLANET_TYPE_NAMES}
          value={PLANET_TYPE_NAMES[selectedPlanet.planetType]}
          setValue={(value) =>
            onChange({ ...selectedPlanet, planetType: PLANET_TYPE_NAMES.indexOf(value) })
          }
        />
      );
    } else if (value == 'isTargetPlanet') {
      {
        targetPlanetsEnabled
          ? (content = (
              <Checkbox
                checked={selectedPlanet.isTargetPlanet}
                onChange={() => {
                  onChange({
                    ...selectedPlanet,
                    isTargetPlanet: !selectedPlanet.isTargetPlanet,
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
                checked={selectedPlanet.isSpawnPlanet}
                onChange={() => {
                  onChange({
                    ...selectedPlanet,
                    isSpawnPlanet: !selectedPlanet.isSpawnPlanet,
                  });
                }}
              />
            ))
          : (content = (
              <Hoverable onClick={() => history.push(`${root}/settings/spawn`)}>Enable</Hoverable>
            ));
      }
    } else if (value == 'blockedPlanetLocs') {
      const options = stagedPlanets.reduce(
        (total, curr) =>
          curr.isSpawnPlanet ? [...total, { label: `(${curr.x},${curr.y})`, value: curr }] : total,
        []
      );
      const value = selectedPlanet.blockedPlanetLocs.map((loc) => ({
        label: `(${loc.x},${loc.y})`,
        value: loc,
      }));

      {
        blockEnabled
          ? (content = (
              <Select
                styles={{
                  container: (provided, state) => ({ ...provided, width: '100%' }),
                  control: (provided, state) => ({
                    ...provided,
                    background: `${dfstyles.colors.background}`,
                    color: `${dfstyles.colors.subtext}`,
                    borderRadius: '4px',
                    border: `1px solid ${dfstyles.colors.border}`,
                    padding: '2px 6px',
                    cursor: 'pointer',
                  }),
                  input: (provided, state) => ({
                    ...provided,
                    color: `${dfstyles.colors.subtext}`,
                  }),
                  valueContainer: (provided, state) => ({ ...provided, padding: '0px ' }),
                  indicatorSeparator: (provided, state) => ({ ...provided, display: 'none' }),
                  indicatorsContainer: (provided, state) => ({ padding: 'none' }),
                  menu: (provided, state) => ({
                    ...provided,
                    color: `${dfstyles.colors.subtext}`,
                  }),
                  menuList: (provided, state) => ({
                    ...provided,
                    color: `${dfstyles.colors.text}`,
                    background:
                      options.length > 0 ? `${dfstyles.colors.backgroundlight}` : `#5B1522`,
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    background: !state.isFocused
                      ? `${dfstyles.colors.backgroundlight}`
                      : `${dfstyles.colors.backgroundlighter}`,
                  }),
                  multiValue: (provided, state) => ({
                    ...provided,
                    color: `${dfstyles.colors.text}`,
                    background: `${dfstyles.colors.backgroundlighter}`,
                  }),
                  multiValueLabel: (provided, state) => ({
                    ...provided,
                    background: `${dfstyles.colors.backgroundlight}`,
                    color: `${dfstyles.colors.text}`,
                  }),
                }}
                name='Blocked Spawns'
                options={options}
                isMulti
                value={value}
                onChange={(selected: any) =>
                  onChange({
                    ...selectedPlanet,
                    blockedPlanetLocs: selected.map(
                      (block: { label: string; value: LobbyPlanet }) => block.value
                    ),
                  })
                }
              />
            ))
          : (content = (
              <Hoverable onClick={() => history.push(`${root}/settings/admin`)}>Enable</Hoverable>
            ));
      }
    } else {
      content = (
        <Checkbox
          checked={(selectedPlanet as any)[value]}
          onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) => {
            onChange({ ...selectedPlanet, [value]: e.target.checked });
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
