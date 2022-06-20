import _, { chunk } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { CreatedPlanet, LobbyAdminTools } from '../../../Backend/Utils/LobbyAdminTools';
import { Spacer } from '../../Components/CoreUI';
import { Row } from '../../Components/Row';
import { Green, Red, Sub } from '../../Components/Text';
import { LobbiesPaneProps, LobbyPlanet, mirrorX, mirrorY, Warning } from './LobbiesUtils';
import { InvalidConfigError, LobbyConfigAction, LobbyConfigState, toInitializers } from './Reducer';

const defaultPlanet: LobbyPlanet = {
  x: 0,
  y: 0,
  level: 0,
  planetType: 0,
  isTargetPlanet: false,
  isSpawnPlanet: false,
};

const PLANET_TYPE_NAMES = ['Planet', 'Asteroid Field', 'Foundry', 'Spacetime Rip', 'Quasar'];
export function PlanetListPane({
  config: config,
  onUpdate: onUpdate,
  onPlanetHover: onPlanetHover,
  onPlanetSelect: onPlanetSelect,
  root: root,
  lobbyAdminTools,
  onError,
  maxPlanetsPerPage = 5,
}: {
  config: LobbyConfigState;
  onUpdate: (change: LobbyConfigAction) => void;
  onPlanetHover: (planet: LobbyPlanet) => void;
  onPlanetSelect: (planet: LobbyPlanet, index: number) => void;
  root: string;
  lobbyAdminTools: LobbyAdminTools | undefined;
  onError: (msg: string) => void;
  maxPlanetsPerPage?: number;
}) {
  const [createdPlanets, setCreatedPlanets] = useState<CreatedPlanet[] | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setCreatedPlanets(lobbyAdminTools?.planets);
  }, [lobbyAdminTools]);

  useEffect(() => {
    if (config.ADMIN_PLANETS.warning) {
      onError(config.ADMIN_PLANETS.warning);
    }
  }, [config.ADMIN_PLANETS.warning]);

  // <div style={{ ...jcFlexEnd, ...rowStyle }}>
  // //       <Btn disabled={!lobbyAdminTools} onClick={async () => await createAndRevealPlanet(i)}>
  // //         ✓
  // //       </Btn>
  // //       <Btn onClick={() => onUpdate({ type: 'ADMIN_PLANETS', value: planet, index: i })}>X</Btn>
  // //     </div>

  const StagedPlanetItem: React.FC<{ planet: LobbyPlanet; index: number }> = ({
    planet,
    index,
  }) => {
    const [hoveringPlanet, setHoveringPlanet] = useState<boolean>(false);
    return (
      <StagedPlanetListItem
        onMouseEnter={() => {
          // onPlanetHover(planet);
          setHoveringPlanet(true);
        }}
        onMouseLeave={() => {
          setHoveringPlanet(false);
        }}
        onClick={() => {
          onPlanetSelect(planet, index);
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StagedPlanetIcon>
            {PLANET_TYPE_NAMES[planet.planetType].charAt(0).toUpperCase()}
          </StagedPlanetIcon>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                color: '#fff',
              }}
            >
              ({planet.x},{planet.y})
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#bbb' }}>Level {planet.level}</span>
              {planet.isSpawnPlanet && (
                <span style={{ color: '#F4BF00', letterSpacing: '0.06em' }}>SPAWN</span>
              )}
              {planet.isTargetPlanet && (
                <span style={{ color: '#FF4163', letterSpacing: '0.06em' }}>TARGET</span>
              )}
            </div>
          </div>
        </div>
        <div>
          {hoveringPlanet && (
            <CloseButton
              onClick={() => {
                onUpdate({ type: 'ADMIN_PLANETS', value: planet, index: index });
              }}
            >
              <CloseIcon />
            </CloseButton>
          )}
        </div>
      </StagedPlanetListItem>
    );
  };

  function StagedPlanets({ config }: LobbiesPaneProps) {
    const LobbyPlanets = config.ADMIN_PLANETS.currentValue;
    const [currentPage, setCurrentPage] = useState<number>(0);
    return LobbyPlanets && LobbyPlanets.length > 0 ? (
      <>
        <Row>
          <span>Staged Planets</span>
        </Row>

        <Row>
          <List>
            {chunk(LobbyPlanets, maxPlanetsPerPage)[currentPage].map((planet, j) => (
              <StagedPlanetItem
                key={`${currentPage}-${j}`}
                planet={planet}
                index={currentPage * maxPlanetsPerPage + j}
              />
            ))}
            <PaginationContainer>
              <span
                onClick={() => {
                  setCurrentPage(Math.max(currentPage - 1, 0));
                }}
              >
                &lt;
              </span>
              <span>
                Page {currentPage + 1} of {Math.floor(LobbyPlanets.length / maxPlanetsPerPage) + 1}
              </span>
              <span
                onClick={() => {
                  setCurrentPage(
                    Math.min(currentPage + 1, Math.floor(LobbyPlanets.length / maxPlanetsPerPage))
                  );
                }}
              >
                &gt;
              </span>
            </PaginationContainer>
          </List>
        </Row>
      </>
    ) : (
      <Row>
        <Sub>No planets staged. Edit the map to add some.</Sub>
      </Row>
    );
  }

  //     planet.createTx && (
  //       <Link to={`${BLOCK_EXPLORER_URL}/${planet.createTx}`} style={{ margin: 'auto' }}>
  //         <u>({planet.createTx.slice(2, 6)})</u>
  //       </Link>

  //     planet.revealTx ? (
  //       <Link to={`${BLOCK_EXPLORER_URL}/${planet.revealTx}`} style={{ margin: 'auto' }}>
  //         <u>({planet.revealTx.slice(2, 6)})</u>
  //       </Link>

  const CreatedPlanetListItem: React.FC<{ planet: CreatedPlanet; index: number }> = ({
    planet,
    index,
  }) => {
    const [hoveringPlanet, setHoveringPlanet] = useState<boolean>(false);
    return (
      <StagedPlanetListItem
        onMouseEnter={() => {
          // onPlanetHover(planet);
          setHoveringPlanet(true);
        }}
        onMouseLeave={() => {
          setHoveringPlanet(false);
        }}
        onClick={() => {
          onPlanetSelect(planet, index);
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StagedPlanetIcon>
            {PLANET_TYPE_NAMES[planet.planetType].charAt(0).toUpperCase()}
          </StagedPlanetIcon>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                color: '#fff',
              }}
            >
              ({planet.x},{planet.y})
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#bbb' }}>Level {planet.level}</span>
              {planet.isSpawnPlanet && (
                <span style={{ color: '#F4BF00', letterSpacing: '0.06em' }}>SPAWN</span>
              )}
              {planet.isTargetPlanet && (
                <span style={{ color: '#FF4163', letterSpacing: '0.06em' }}>TARGET</span>
              )}
            </div>
          </div>
        </div>
      </StagedPlanetListItem>
    );
  };

  function CreatedPlanets({ planets }: { planets: CreatedPlanet[] | undefined }) {
    return planets && planets.length > 0 ? (
      <>
        <Row>
          <span>Created Planets</span>
        </Row>

        <Row>
          <List>
            {planets.map((planet, i) => (
              <CreatedPlanetListItem key={i} planet={planet} index={i} />
            ))}
          </List>
        </Row>
      </>
    ) : (
      <Row>
        <Sub>
          {lobbyAdminTools
            ? 'No planets created '
            : "Planets won't be created on-chain until world is created"}
        </Sub>
      </Row>
    );
  }

  return (
    <>
      {config.ADMIN_CAN_ADD_PLANETS.displayValue ? (
        <>
          {config.NO_ADMIN.displayValue && lobbyAdminTools && (
            <Sub>You cannot stage planets after universe creation if admin disabled.</Sub>
          )}
          <Row>
            <Warning>{config.ADMIN_PLANETS.warning}</Warning>
            <Warning>{error}</Warning>
          </Row>
          <StagedPlanets config={config} onUpdate={onUpdate} />
          <Spacer height={24} />
          <CreatedPlanets planets={createdPlanets} />
        </>
      ) : (
        <Sub>Enable admin planets (in admin permissions) to continue</Sub>
      )}
    </>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const StagedPlanetListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  justify-content: space-between;
  transition: all 0.2s ease-in-out;
  &:hover {
    background: #252525;
  }
`;

const StagedPlanetIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #313131;
  width: 24px;
  height: 24px;
  color: #fff;
`;

const CloseButton = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 4px;
  background-color: #3e3e3e;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: #505050;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
`;

const CloseIcon = () => {
  return (
    <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z'
        fill='currentColor'
        fill-rule='evenodd'
        clip-rule='evenodd'
      ></path>
    </svg>
  );
};
