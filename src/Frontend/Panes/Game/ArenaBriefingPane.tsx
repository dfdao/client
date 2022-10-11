import React, { useEffect, useState } from 'react';
import { Btn } from '../../Components/Btn';
import { Gold, Green, Sub } from '../../Components/Text';
import { useUIManager } from '../../Utils/AppHooks';
import { StyledTutorialPane } from './StyledTutorialPane';
import { setBooleanSetting } from '../../Utils/SettingsHooks';
import {
  Artifact,
  ArtifactRarity,
  ArtifactType,
  Setting,
  WorldLocation,
} from '@darkforest_eth/types';
import { setObjectSyncState } from '../../Utils/EmitterUtils';
import { ArtifactThumb } from '../../Views/Game/ArtifactRow';

const enum BriefingStep {
  Welcome,
  Target,
  AlmostComplete,
  Complete,
}
export function ArenaBriefingPane() {
  const uiManager = useUIManager();
  const [open, setOpen] = useState(!uiManager.gameStarted);
  const [step, setStep] = useState<BriefingStep>(BriefingStep.Welcome);
  const [targetCoords, setTargetCoords] = useState<WorldLocation>();
  const [targetIdx, setTargetIdx] = useState(0);
  const config = {
    contractAddress: uiManager.getContractAddress(),
    account: uiManager.getAccount(),
  };
  const spectatorMode = uiManager.getGameManager().getIsSpectator();

  useEffect(() => {
    if (step == BriefingStep.Target) {
      const antimatterCubes: Artifact[] = [...uiManager.getArtifactMap()]
        .filter(([, artifact]) => artifact.artifactType == ArtifactType.AntimatterCube)
        .map((p) => p[1]);

      const location = antimatterCubes.length > 0 ? antimatterCubes[0].onPlanetId : undefined;
      const coords = location
        ? uiManager.getGameManager().getRevealedLocations().get(location)
        : undefined;
      if (!coords || !location) return setStep(BriefingStep.AlmostComplete);

      setTargetCoords(coords);
      uiManager.centerLocationId(location);
    } else if (step == BriefingStep.AlmostComplete) {
      const homeLocation = uiManager.getHomeHash();
      if (homeLocation) uiManager.centerLocationId(homeLocation);
    } else if (step == BriefingStep.Complete) {
      setOpen(false);
      setBooleanSetting(config, Setting.ShowArenaBriefing, true);
    }
  }, [step, setStep, targetIdx]);
  const welcomeContent = (
    <div className='tutzoom'>
      gm, dfdao Galactic Protection Division Agent. Thank you for accepting this mission.
      <br />
      <br />
      <div>
        You have been tasked with locating the Antimatter Cube within this universe and extracting
        it through a Spacetime Rips. This Cube is vital to protecting our universe from the
        Trisolarans.{' '}
        <Sub>(Note: the only Spacetime Rips are located next to player spawn points!)</Sub>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px',
          }}
        >
          <ArtifactThumb
            artifact={
              {
                artifactType: ArtifactType.AntimatterCube,
                rarity: ArtifactRarity.Common,
              } as Artifact
            }
            selectedArtifact={undefined}
            onArtifactChange={() => {}}
          />
        </div>
        <div>
          Our recon reports the Antimatter Cube may have powerful weakening effects on the planet it
          is on.
        </div>
        <div>
          Whatever you do, DO NOT let an enemy agent extract the Cube! We must protect the citizens
          of our universe at all costs.
        </div>
        <div>Good luck!</div>
      </div>
      <br />
      <div style={{ gap: '5px' }}>
        <Btn className='btn' onClick={() => setOpen(false)}>
          Close
        </Btn>
        <Btn className='btn' onClick={() => setStep(BriefingStep.Target)}>
          View Antimatter Cube
        </Btn>
      </div>
    </div>
  );

  const targetContent = (
    <div className='tutzoom'>
      {targetCoords ? (
        <>
          <div>
            This is your objective: the Antimatter Cube.
            {targetCoords &&
              `It is located at (${targetCoords.coords.x}, ${targetCoords.coords.y}).`}
          </div>
          <br />
          Extract it at a Spacetime Rip (preferably the one next to your spawn point) to win.
          <br />
          <div style={{ gap: '5px' }}>
            <Btn className='btn' onClick={() => setStep(BriefingStep.AlmostComplete)}>
              Continue
            </Btn>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );

  const completeContent = (
    <div className='tutzoom'>
      <div>Here is your spawn planet. Good luck!</div>
      <br />
      <div style={{ gap: '5px' }}>
        <Btn
          className='btn'
          onClick={() => {
            setStep(BriefingStep.Complete);
          }}
        >
          Exit
        </Btn>
      </div>
    </div>
  );

  if (spectatorMode || !open) {
    return null;
  }

  return (
    <StyledTutorialPane>
      {step == BriefingStep.Welcome && welcomeContent}
      {step == BriefingStep.Target && targetContent}
      {step == BriefingStep.AlmostComplete && completeContent}
    </StyledTutorialPane>
  );
}
