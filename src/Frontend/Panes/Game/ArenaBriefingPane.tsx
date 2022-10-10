import React, { useEffect, useState } from 'react';
import { Btn } from '../../Components/Btn';
import { Gold, Green } from '../../Components/Text';
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
  const isSinglePlayer = uiManager.getSpawnPlanets().length == 1;
  const victoryThreshold = uiManager.contractConstants.CLAIM_VICTORY_ENERGY_PERCENT;
  const numForVictory = uiManager.contractConstants.TARGETS_REQUIRED_FOR_VICTORY;
  const targetLocations = uiManager.getPlayerTargetPlanets();

  if (spectatorMode || !open) {
    return null;
  }

  const welcomeContent = (
    <div className='tutzoom'>
      gm, dfdao Galactic Protection Division Agent. Thank you for accepting this mission.
      <br />
      <br />
      <div>
        You have been tasked with locating the Antimatter Cube within this universe and extracting
        it through a Spacetime Rip. This Cube is vital to protecting our universe from the
        Trisolarans.
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
      </div>
    </div>
  );

  return <StyledTutorialPane>{step == BriefingStep.Welcome && welcomeContent}</StyledTutorialPane>;
}
