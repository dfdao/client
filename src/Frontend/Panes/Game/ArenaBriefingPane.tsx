import React, { useEffect, useState } from 'react';
import { Btn } from '../../Components/Btn';
import { Gold, Green } from '../../Components/Text';
import { useUIManager } from '../../Utils/AppHooks';
import { StyledTutorialPane } from './StyledTutorialPane';
import { setBooleanSetting } from '../../Utils/SettingsHooks';
import { Setting } from '@darkforest_eth/types';

const enum BriefingStep {
  Welcome,
  Target,
  Complete,
}
export function ArenaBriefingPane() {
  const uiManager = useUIManager();
  const [open, setOpen] = useState(!uiManager.gameStarted);
  const [step, setStep] = useState<BriefingStep>(BriefingStep.Welcome);

  const config = {
    contractAddress: uiManager.getContractAddress(),
    account: uiManager.getAccount(),
  };
  const spectatorMode = uiManager.getGameManager().getIsSpectator();
  const isSinglePlayer = uiManager.getSpawnPlanets().length == 1;
  const victoryThreshold = uiManager.contractConstants.CLAIM_VICTORY_ENERGY_PERCENT;
  const numForVictory = uiManager.contractConstants.TARGETS_REQUIRED_FOR_VICTORY;
  const targetLocation = uiManager.getPlayerTargetPlanets()[0].locationId;
  const targetCoords = uiManager.getGameManager().getRevealedLocations().get(targetLocation);
  const homeLocation = uiManager.getHomeHash();
  useEffect(() => {
    if (step == BriefingStep.Target) {
      uiManager.centerLocationId(targetLocation);
    } else if (step == BriefingStep.Complete) {
      if (homeLocation) uiManager.centerLocationId(homeLocation);
    }
  }, [step]);

  if (spectatorMode || !open) {
    return null;
  }

  const welcomeContent = (
    <div className='tutzoom'>
      Welcome to Dark Forest Arena!
      <br />
      <br />
      <div>
        {isSinglePlayer ? (
          <>
            Race against the clock to capture the Target Planet (it has a big 🎯 floating above it)
            and{' '}
            <Green>
              claim victory when it contains at least <Gold>{victoryThreshold}%</Gold> energy!
            </Green>
          </>
        ) : (
          <>
            Battle your opponent to capture the Target Planet (it has a big 🎯 floating above it)
            and{' '}
            <Green>
              claim victory when it contains at least <Gold>{victoryThreshold}%</Gold> energy!
            </Green>
            .
          </>
        )}
        <div>You need {numForVictory} target planets to claim victory.</div>
      </div>
      <br />
      <div style={{ gap: '5px' }}>
        <Btn className='btn' onClick={() => setOpen(false)}>
          Close
        </Btn>
        <Btn className='btn' onClick={() => setStep(BriefingStep.Target)}>
          View Target Planet
        </Btn>
      </div>
    </div>
  );

  const targetContent = (
    <div className='tutZoom'>
      <div>
        This is your objective: the 🎯 Target Planet.{' '}
        {targetCoords && `It is located at (${targetCoords.coords.x}, ${targetCoords.coords.y}).`}
      </div>
      <br />
      <div>
        ⏲️ starts {isSinglePlayer ? 'with your first move' : 'when you press ready'}. Good luck!
      </div>
      <br />
      <div style={{ gap: '5px' }}>
        <Btn
          className='btn'
          onClick={() => {
            setOpen(false);
            setStep(BriefingStep.Complete);
            setBooleanSetting(config, Setting.ShowArenaBriefing, true);
          }}
        >
          Return to home planet
        </Btn>
      </div>
    </div>
  );

  const completeContent = <></>;

  return (
    <StyledTutorialPane>
      {step == BriefingStep.Welcome && welcomeContent}
      {step == BriefingStep.Target && targetContent}
      {step == BriefingStep.Complete && completeContent}
    </StyledTutorialPane>
  );
}
