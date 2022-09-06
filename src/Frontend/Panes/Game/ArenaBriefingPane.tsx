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
  const targetLocations = uiManager.getPlayerTargetPlanets();
  const targetLocation = targetLocations.length > 0 ? targetLocations[0] : undefined;
  const targetCoords = targetLocation
    ? uiManager.getGameManager().getRevealedLocations().get(targetLocation.locationId)
    : undefined;
  const homeLocation = uiManager.getHomeHash();
  useEffect(() => {
    if (!targetLocation) setStep(BriefingStep.Complete);
    if (step == BriefingStep.Target && targetLocation) {
      uiManager.centerLocationId(targetLocation.locationId);
    } else if (step === BriefingStep.Target && !targetLocation) {
      setStep(BriefingStep.Complete);
    } else if (step == BriefingStep.Complete) {
      if (homeLocation) uiManager.centerLocationId(homeLocation);
      setOpen(false);
      setBooleanSetting(config, Setting.ShowArenaBriefing, true);
    }
  }, [step, setStep]);

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
        <div>
          You need {numForVictory} target planet{numForVictory > 1 && 's'} to claim victory.
        </div>
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
        The timer ⏲️ starts {isSinglePlayer ? 'with your first move' : 'when you press ready'}. Good
        luck!
      </div>
      <br />
      <div style={{ gap: '5px' }}>
        <Btn
          className='btn'
          onClick={() => {
            setStep(BriefingStep.Complete);
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
