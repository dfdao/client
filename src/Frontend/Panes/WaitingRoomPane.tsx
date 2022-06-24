import { EMPTY_ADDRESS, RECOMMENDED_MODAL_WIDTH } from '@darkforest_eth/constants';
import { formatNumber } from '@darkforest_eth/gamelogic';
import {
  getPlanetClass,
  getPlanetCosmetic,
  getPlanetName,
  rgbStr,
} from '@darkforest_eth/procedural';
import { engineConsts } from '@darkforest_eth/renderer';
import { ModalName, Planet, PlanetType, RGBVec } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { getPlanetRank } from '../../Backend/Utils/Utils';
import { Btn } from '../Components/Btn';
import { CenterBackgroundSubtext, Spacer } from '../Components/CoreUI';
import { Icon, IconType } from '../Components/Icons';
import { Row } from '../Components/Row';
import { Green, Red, Sub } from '../Components/Text';
import { TextPreview } from '../Components/TextPreview';
import dfstyles from '../Styles/dfstyles';
import { useUIManager } from '../Utils/AppHooks';
import { ModalPane } from '../Views/ModalPane';
import { PlanetLink } from '../Views/PlanetLink';
import { SortableTable } from '../Views/SortableTable';
import { Table } from '../Views/Table';
import { PlanetThumb } from './PlanetDexPane';

const StyledOnboardingContent = styled.div`
  width: 25em;
  //   height: 25em;
  position: relative;
  color: ${dfstyles.colors.text};
`;
const ReadyContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 2em;
`;
const StyledPlanetThumb = styled.div<{ iconColor?: string }>`
  width: 20px;
  height: 20px;
  position: relative;
  line-height: 0;
  z-index: 1;

  /* Set the Icon color if specified on the outer component */
  --df-icon-color: ${({ iconColor }) => iconColor};
`;

const PlanetElement = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlanetName = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
`;

const TableContainer = styled.div`
  overflow-y: scroll;
`;

function HelpContent() {
  return (
    <div>
      <p>These are all the planets you currently own.</p>
      <Spacer height={8} />
      <p>
        The table is interactive, and allows you to sort the planets by clicking each column's
        header. You can also navigate to a planet that you own by clicking on its name. The planet
        you click will be centered at the spot on the screen where the current planet you have
        selected is located.
      </p>
    </div>
  );
}

export function WaitingRoomPane({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const uiManager = useUIManager();
  const spawnPlanets = uiManager.getSpawnPlanets();
  const ready = uiManager.getPlayer();
  const [planets, setPlanets] = useState<Planet[]>(spawnPlanets);

  // update planet list on open / close
  useEffect(() => {
    if (!uiManager) return;
    const myAddr = uiManager.getAccount();
    if (!myAddr) return;
    const planets = uiManager.getSpawnPlanets();
    setPlanets(planets);
  }, [visible, uiManager]);

  const headers = ['', 'Planet', 'Owner', 'Ready'];
  const alignments: Array<'r' | 'c' | 'l'> = ['l', 'l', 'l', 'r'];

  const columns = [
    //thumb
    (planet: Planet) => <PlanetThumb planet={planet} />,
    // name
    (planet: Planet) => (
      <PlanetLink planet={planet}>
        <PlanetName>{getPlanetName(planet)}</PlanetName>
      </PlanetLink>
    ),
    //player
    (planet: Planet) => (
      <Sub>
        {planet.owner === EMPTY_ADDRESS
          ? 'nobody'
          : uiManager.getTwitter(planet.owner) || (
              <TextPreview text={planet.owner} unFocusedWidth='100px' focusedWidth='100px' />
            )}
      </Sub>
    ),
    //ready
    (planet: Planet) => {
      const player = uiManager.getPlayer(planet.owner);
      if (!player || !player.ready) return <Red>N</Red>;
      return <Green>Y</Green>;
    },
  ];
  let content;

  if (planets.length === 0) {
    content = (
      <CenterBackgroundSubtext width={RECOMMENDED_MODAL_WIDTH} height='100px'>
        Loading...
      </CenterBackgroundSubtext>
    );
  } else {
    content = (
      <StyledOnboardingContent>
        <Row>
          Welcome to Dark Forest Arena! Once everyone presses READY, the game will
          begin!
        </Row>
        <ReadyContainer style={{ fontSize: '2em' } as CSSProperties & CSSStyleDeclaration}>
          <span>You are {!ready && 'not '} ready</span>
          <Btn
            size='large'
            onClick={() =>
              ready ? uiManager.getGameManager().notReady() : uiManager.getGameManager().ready()
            }
          >
            {ready ? 'Not Ready' : 'Ready'}
          </Btn>
        </ReadyContainer>
        <TableContainer>
          <Table rows={planets} headers={headers} columns={columns} alignments={alignments} />
        </TableContainer>
      </StyledOnboardingContent>
    );
  }

  return (
    <ModalPane
      visible={visible}
      onClose={onClose}
      //   hideClose
      id={ModalName.WaitingRoom}
      title='Waiting Room'
      helpContent={HelpContent}
    >
      {content}
    </ModalPane>
  );
}
