import { TooltipName } from '@darkforest_eth/types';
import React from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { AccountLabel } from '../Components/Labels/Labels';
import { Gold, Green, Red } from '../Components/Text';
import { TooltipTrigger } from '../Panes/Tooltip';
import { useGameover, useUIManager } from '../Utils/AppHooks';

export function TargetPlanetVictory() {
  const uiManager = useUIManager();
  const gameManager = uiManager.getGameManager();
  const canClaimVictory = uiManager.checkVictoryCondition();
  const gameover = useGameover();
  const requiredPlanets = gameManager.getContractConstants().TARGETS_REQUIRED_FOR_VICTORY;
  const requiredEnergy = gameManager.getContractConstants().CLAIM_VICTORY_ENERGY_PERCENT;

  if (gameover) {
    return <></>;
  }
  return (
    <>
      <GameoverContainer>
        <TooltipTrigger
          extraContent={
            <>
              In this game, you need to capture <Red>{requiredPlanets}</Red> target planet
              {requiredPlanets !== 1 && 's'} and fill each with{' '}
              <Green>{requiredEnergy}% energy</Green>. Then you can claim victory and win the game!
            </>
          }
          name={TooltipName.Empty}
          style = {{gap: '5px'}}
        >
          <span>
            Targets: {gameManager.getTargetsHeld().length}/{requiredPlanets}
          </span>
          <Btn
            size='small'
            disabled={!canClaimVictory}
            onClick={() => uiManager.getGameManager().claimVictory()}
          >
            Claim Victory!
          </Btn>

          <br />
        </TooltipTrigger>
      </GameoverContainer>
      {/* <TimeContainer>Game length: {prettyTime(gameDuration)}</TimeContainer> */}
    </>
  );
}

const GameoverContainer = styled.div`
  // font-size: 2em;
  text-align: center;
`;
const TimeContainer = styled.div`
  font-size: 1em;
  text-align: center;
`;
