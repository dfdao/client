import { BLOCK_EXPLORER_URL } from '@darkforest_eth/constants';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CreatedPlanet, LobbyAdminTools } from '../../../Backend/Utils/LobbyAdminTools';
import { Btn } from '../../Components/Btn';
import { Link } from '../../Components/CoreUI';
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
import { LobbiesPaneProps, LobbyPlanet, Warning } from './LobbiesUtils';
import { InvalidConfigError, toInitializers } from './Reducer';

const jcFlexEnd = { display: 'flex', justifyContent: 'flex-end' } as CSSStyleDeclaration &
  React.CSSProperties;
const jcSpaceEvenly = { display: 'flex', justifyContent: 'space-evenly' } as CSSStyleDeclaration &
  React.CSSProperties;
const rowChunkSize = 6;
const rowStyle = { gap: '8px' } as CSSStyleDeclaration & React.CSSProperties;
// Handling the non-input lvl 0 by calculating the items in the row
const itemStyle = { flex: `1 1 ${Math.floor(100 / rowChunkSize)}%` };

const TableContainer = styled.div`
  overflow-y: scroll;
  width: 100%;
`;

const displayProperties = [
  'x',
  'y',
  'Level',
  'Type',
  'Target?',
  'Spawn?',
];
type Status = 'creating' | 'created' | 'errored' | undefined;

function formatBool(bool: boolean) {
  return bool ? <Green>Y</Green> : <Red>N</Red>;
}

const defaultPlanet: LobbyPlanet = {
  x: 0,
  y: 0,
  level: 0,
  planetType: 0,
  isTargetPlanet: false,
  isSpawnPlanet: false,
};

export function CreatePlanetPane({
  config: config,
  onUpdate: onUpdate,
  lobbyAdminTools,
}: LobbiesPaneProps & { lobbyAdminTools: LobbyAdminTools | undefined }) {
  const [planet, setPlanet] = useState<LobbyPlanet>(defaultPlanet);
  const [createdPlanets, setCreatedPlanets] = useState<CreatedPlanet[] | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>();

  useEffect(() => {
    setCreatedPlanets(lobbyAdminTools?.planets);
  }, [lobbyAdminTools]);

  const headers = ['Coords', 'Level', 'Type', 'Target', 'Spawn', ''];
  const alignments: Array<'r' | 'c' | 'l'> = ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'c'];
  const columns = [
    (planet: LobbyPlanet) => (
      <Sub>
        ({planet.x}, {planet.y})
      </Sub>
    ),
    (planet: LobbyPlanet) => <Sub>{planet.level}</Sub>,
    (planet: LobbyPlanet) => <Sub>{planet.planetType}</Sub>,
    (planet: LobbyPlanet) => formatBool(planet.isTargetPlanet),
    (planet: LobbyPlanet) => formatBool(planet.isSpawnPlanet),
    (planet: LobbyPlanet, i: number) => (
      <div style={jcSpaceEvenly}>
        <Btn disabled={!lobbyAdminTools} onClick={async () => await createAndRevealPlanet(i)}>
          ✓
        </Btn>
        <Btn onClick={() => onUpdate({ type: 'ADMIN_PLANETS', value: planet, index: i })}>X</Btn>
      </div>
    ),
  ];

  function StagedPlanets({ config }: LobbiesPaneProps) {
    const LobbyPlanets = config.ADMIN_PLANETS.currentValue;
    return LobbyPlanets && LobbyPlanets.length > 0 ? (
      <TableContainer>
        <Table
          paginated={true}
          rows={LobbyPlanets || []}
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
    'Target',
    'Spawn',
    'Create Tx',
    'Reveal Tx',
  ];

  const createdPlanetColumns = [
    (planet: CreatedPlanet) => (
      <Sub>
        ({planet.x}, {planet.y})
      </Sub>
    ),
    (planet: CreatedPlanet) => <Sub>{planet.level}</Sub>,
    (planet: CreatedPlanet) => <Sub>{planet.planetType}</Sub>,
    (planet: CreatedPlanet) => formatBool(planet.isTargetPlanet),
    (planet: CreatedPlanet) => formatBool(planet.isSpawnPlanet),
    (planet: CreatedPlanet) =>
      planet.createTx && (
        <Link to={`${BLOCK_EXPLORER_URL}/${planet.createTx}`} style={{ margin: 'auto' }}>
          <u>({planet.createTx.slice(2, 6)})</u>
        </Link>
      ),
    (planet: CreatedPlanet) =>
      planet.revealTx ? (
        <Link to={`${BLOCK_EXPLORER_URL}/${planet.revealTx}`} style={{ margin: 'auto' }}>
          <u>({planet.revealTx.slice(2, 6)})</u>
        </Link>
      ) : (
        <span>N/A</span>
      ),
  ];

  function CreatedPlanets({ planets }: { planets: CreatedPlanet[] | undefined }) {
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
    // console.log(JSON.stringify(planet));
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
  }

  function planetInput(value: string, index: number) {
    return (
      <div style={itemStyle} key={index}>
        <span>{displayProperties[index]}</span>
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

    const testBulk = true;
    if(testBulk) {
      await bulkCreateAndRevealPlanets();
    }
    else {
      for (let i = config.ADMIN_PLANETS.displayValue.length - 1; i >= 0; i--) {
        await createAndRevealPlanet(i);
      }
    }
  }

  async function bulkCreateAndRevealPlanets() {
    try {
      if (!config.ADMIN_PLANETS.displayValue) return;

      var adminPlanets: AdminPlanet[] = [];
  
      config.ADMIN_PLANETS.displayValue.map(p => {
        if(p) adminPlanets.push(p);
      })
  
      await lobbyAdminTools?.bulkCreateAndReveal(adminPlanets, toInitializers(config));
    } catch (error) {
      console.log('bulk create and reveal errored', error);
      
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
      await lobbyAdminTools.revealPlanet(elem, initializers);

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

  let lobbyPlanetElems;
  if (config.ADMIN_CAN_ADD_PLANETS.displayValue) {
    lobbyPlanetElems = _.chunk(Object.keys(planet), rowChunkSize).map((items, rowIdx) => {
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
          {lobbyPlanetElems}
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
