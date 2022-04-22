import { AdminPlanet } from '@darkforest_eth/types';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LobbyAdminTools } from '../../../Backend/Utils/LobbyAdminTools';
import { Btn } from '../../Components/Btn';
import {
  Checkbox,
  DarkForestCheckbox,
  DarkForestNumberInput,
  NumberInput
} from '../../Components/Input';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Row } from '../../Components/Row';
import { Green, Red, Sub } from '../../Components/Text';
import { Table } from '../../Views/Table';
import { LobbiesPaneProps, Warning } from './LobbiesUtils';
import { InvalidConfigError, toInitializers } from './Reducer';

const jcFlexEnd = { display: 'flex', justifyContent: 'flex-end' } as CSSStyleDeclaration &
  React.CSSProperties;
const jcSpaceEvenly = { display: 'flex', justifyContent: 'space-evenly' } as CSSStyleDeclaration &
  React.CSSProperties;
const rowChunkSize = 4;
const rowStyle = { gap: '8px' } as CSSStyleDeclaration & React.CSSProperties;
// Handling the non-input lvl 0 by calculating the items in the row
const itemStyle = { flex: `1 1 ${Math.floor(100 / rowChunkSize)}%` };

const TableContainer = styled.div`
  overflow-y: scroll;
  width: 100%;
`;

type Status = 'creating' | 'created' | 'errored' | undefined;

function formatBool(bool: boolean) {
  return bool ? <Green>Y</Green> : <Red>N</Red>;
}

const defaultPlanet: AdminPlanet = {
  x: 0,
  y: 0,
  level: 0,
  planetType: 0,
  requireValidLocationId: false,
  revealLocation: true,
  isTargetPlanet: false,
  isSpawnPlanet: false,
};

export function CreatePlanetPane({
  config: config,
  onUpdate: onUpdate,
  lobbyAdminTools,
}: LobbiesPaneProps & { lobbyAdminTools: LobbyAdminTools | undefined }) {
  const [planet, setPlanet] = useState<AdminPlanet>(defaultPlanet);
  const [createdPlanets, setCreatedPlanets] = useState<AdminPlanet[] | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>();

  useEffect(() => {
    setCreatedPlanets(lobbyAdminTools?.planets);
  }, [lobbyAdminTools]);

  const headers = ['Coords', 'Level', 'Type', 'Valid Loc', 'Reveal', 'Target', 'Spawn', ''];
  const alignments: Array<'r' | 'c' | 'l'> = ['c', 'c', 'c', 'l', 'l', 'l', 'l', 'l'];
  const columns = [
    (planet: AdminPlanet) => (
      <Sub>
        ({planet.x}, {planet.y})
      </Sub>
    ),
    (planet: AdminPlanet) => <Sub>{planet.level}</Sub>,
    (planet: AdminPlanet) => <Sub>{planet.planetType}</Sub>,
    (planet: AdminPlanet) => formatBool(planet.requireValidLocationId),
    (planet: AdminPlanet) => formatBool(planet.revealLocation),
    (planet: AdminPlanet) => formatBool(planet.isTargetPlanet),
    (planet: AdminPlanet) => formatBool(planet.isSpawnPlanet),
    (planet: AdminPlanet, i: number) => (
      <div style={jcSpaceEvenly}>
        <Btn disabled={!lobbyAdminTools} onClick={async () => await createAndRevealPlanet(i)}>
          ✓
        </Btn>
        <Btn onClick={() => onUpdate({ type: 'ADMIN_PLANETS', value: planet, index: i })}>X</Btn>
      </div>
    ),
  ];

  function StagedPlanets({ config }: LobbiesPaneProps) {
    const adminPlanets = config.ADMIN_PLANETS.currentValue;
    return adminPlanets && adminPlanets.length > 0 ? (
      <TableContainer>
        <Table
          paginated={true}
          rows={adminPlanets || []}
          headers={headers}
          columns={columns}
          alignments={alignments}
        />
      </TableContainer>
    ) : (
      <Sub>No planets staged</Sub>
    );
  }

  const createdPlanetHeaders = [
    'Coords',
    'Level',
    'Type',
    'Valid Loc',
    'Reveal',
    'Target',
    'Spawn',
  ];
  const createdPlanetColumns = [
    (planet: AdminPlanet) => (
      <Sub>
        ({planet.x}, {planet.y})
      </Sub>
    ),
    (planet: AdminPlanet) => <Sub>{planet.level}</Sub>,
    (planet: AdminPlanet) => <Sub>{planet.planetType}</Sub>,
    (planet: AdminPlanet) => formatBool(planet.requireValidLocationId),
    (planet: AdminPlanet) => formatBool(planet.revealLocation),
    (planet: AdminPlanet) => formatBool(planet.isTargetPlanet),
    (planet: AdminPlanet) => formatBool(planet.isSpawnPlanet),
  ];

  function CreatedPlanets({ planets }: { planets: AdminPlanet[] | undefined }) {
    return planets?.length ? (
      <TableContainer>
        <Table
          paginated={true}
          rows={planets || []}
          headers={createdPlanetHeaders}
          columns={createdPlanetColumns}
          alignments={alignments}
        />
      </TableContainer>
    ) : (
      <Sub>No planets created</Sub>
    );
  }

  function stagePlanet() {
    setError(undefined);
    if (createdPlanets?.find((p) => planet.x == p.x && planet.y == p.y)) {
      setError('planet with identical coords created');
      return;
    }
    if (config.ADMIN_PLANETS.displayValue?.find((p) => planet.x == p?.x && planet.y == p?.y)) {
      setError('planet with identical coords staged');
      return;
    }

    onUpdate({
      type: 'ADMIN_PLANETS',
      value: planet,
      index: config.ADMIN_PLANETS.displayValue?.length || 0,
    });

    setPlanet(defaultPlanet);
  }

  function planetInput(value: string, index: number) {
    // The level 0 value can never change
    return (
      <div style={itemStyle} key={index}>
        <span>{value}</span>
        {value == 'x' || value == 'y' || value == 'level' || value == 'planetType' ? (
          <NumberInput
            format='integer'
            value={planet[value]}
            onChange={(e: Event & React.ChangeEvent<DarkForestNumberInput>) => {
              setPlanet({ ...planet, [value]: e.target.value });
            }}
          />
        ) : (
          <Checkbox
            checked={(planet as any)[value]}
            onChange={(e: Event & React.ChangeEvent<DarkForestCheckbox>) => {
              setPlanet({ ...planet, [value]: e.target.checked });
            }}
          />
        )}
      </div>
    );
  }

  async function createAll() {
    setError(undefined);
    if (!config.ADMIN_PLANETS.displayValue) return;

    for (let i = config.ADMIN_PLANETS.displayValue.length - 1; i >= 0; i--) {
      await createAndRevealPlanet(i);
    }
  }

  async function createAndRevealPlanet(index: number) {
    try {
      setStatus('creating');
      const initializers = toInitializers(config);
      if (!lobbyAdminTools) {
        setError("You haven't created a lobby.");
        return;
      }
      if (!config.ADMIN_PLANETS.displayValue) {
        setError('no planets staged');
        return;
      }
      const elem = config.ADMIN_PLANETS.displayValue[index];
      if (!elem) {
        setError('Address not found.');
        return;
      }
      await lobbyAdminTools.createPlanet(elem, initializers);
      if (planet.revealLocation) {
        await lobbyAdminTools.revealPlanet(elem, initializers);
      }

      onUpdate({ type: 'ADMIN_PLANETS', value: planet, index: index });
      setStatus('created');
    } catch (err) {
      setStatus('errored');
      console.error(err);
      if (err instanceof InvalidConfigError) {
        setError(`Invalid ${err.key} value ${err.value ?? ''} - ${err.message}`);
      } else {
        setError(err?.message || 'Something went wrong. Check your dev console.');
      }
    }
  }

  let adminPlanetElems;
  if (config.ADMIN_CAN_ADD_PLANETS.displayValue) {
    adminPlanetElems = _.chunk(Object.keys(planet), rowChunkSize).map((items, rowIdx) => {
      return (
        <Row key={`admin-planet-elem-${rowIdx}`} style={rowStyle}>
          {items.map((value, idx) => planetInput(value, rowIdx * rowChunkSize + idx))}
        </Row>
      );
    });
  }
  return (
    <>
      {config.ADMIN_CAN_ADD_PLANETS.displayValue ? (
        <>
          {!lobbyAdminTools && (
            <Row>
              <Sub>
                <Red>Warning:</Red> Cannot create planets until lobby is created
              </Sub>
            </Row>
          )}
          <Row>
            <span>Stage Custom Planets</span>
            <Btn style={jcFlexEnd} onClick={stagePlanet}>
              Stage Planet
            </Btn>
          </Row>
          {adminPlanetElems}
          <Row>
            <Warning>{config.ADMIN_PLANETS.warning}</Warning>
          </Row>
          <Row>
            <Warning>{error}</Warning>
          </Row>
          <br />
          <Row>
            <span>Staged Planets</span>
          </Row>
          <Row>
            <StagedPlanets config={config} onUpdate={onUpdate} />
          </Row>
          {config.ADMIN_PLANETS.displayValue && config.ADMIN_PLANETS.displayValue.length > 0 && (
            <Btn
              style={jcFlexEnd}
              disabled={status == 'creating' || !lobbyAdminTools}
              onClick={createAll}
            >
              {' '}
              {status == 'creating' ? <LoadingSpinner initialText='Adding...' /> : ` Add all `}
            </Btn>
          )}
          <Row>
            <span>Created Planets</span>
          </Row>
          <Row>
            <CreatedPlanets planets={createdPlanets} />
          </Row>
        </>
      ) : (
        <Sub>Enable admin planets (in admin permissions) to continue</Sub>
      )}
    </>
  );
}
