import { EMPTY_ADDRESS } from '@darkforest_eth/constants';
import {
  isUnconfirmedClaimVictoryTx,
  isUnconfirmedInvadeTargetPlanetTx,
} from '@darkforest_eth/serde';
import { Planet, TooltipName } from '@darkforest_eth/types';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Wrapper } from '../../Backend/Utils/Wrapper';
import { TooltipTrigger } from '../Panes/Tooltip';
import { useAccount, useUIManager } from '../Utils/AppHooks';
import { useEmitterValue } from '../Utils/EmitterHooks';
import { INVADE } from '../Utils/ShortcutConstants';
import { ShortcutBtn } from './Btn';
import { LoadingSpinner } from './LoadingSpinner';
import { MaybeShortcutButton } from './MaybeShortcutButton';
import { Row } from './Row';
import { Green, Red, White } from './Text';

const StyledRow = styled(Row)`
  .button {
    margin-bottom: 4px;
    flex-grow: 1;
  }
`;

export function TargetPlanetButton({
  planetWrapper,
}: {
  planetWrapper: Wrapper<Planet | undefined>;
}) {
  const uiManager = useUIManager();
  const account = useAccount(uiManager);
  const gameManager = uiManager.getGameManager();
  const planet = planetWrapper.value;
  const owned = planetWrapper.value?.owner === account;
  const isTargetPlanet = planetWrapper.value?.isTargetPlanet;

  const shouldShow = useMemo(
    () => owned && isTargetPlanet,
    [owned, planetWrapper]
  );

  const energyLeftToClaimVictory = useMemo(() => {
    if (!planetWrapper.value || !owned) {
      return undefined;
    }
    const energyRequired = gameManager.getContractConstants().CLAIM_VICTORY_ENERGY_PERCENT;
    const planetEnergyPercent = planetWrapper.value.energy * 100 / planetWrapper.value.energyCap;
    const percentNeeded =  Math.floor(energyRequired - planetEnergyPercent);
    const energyNeeded = Math.floor(percentNeeded / 100 * planetWrapper.value.energyCap);
    return {percentNeeded: percentNeeded, energyNeeded: energyNeeded}
  }, [planetWrapper]);

  const claimable = useMemo(() => energyLeftToClaimVictory && energyLeftToClaimVictory.percentNeeded < 0, [energyLeftToClaimVictory]);

  const claimingVictory = useMemo(
    () => planetWrapper.value?.transactions?.hasTransaction(isUnconfirmedClaimVictoryTx),
    [planetWrapper]
  );

  const claimVictory = useCallback(() => {
    if (!planetWrapper.value) return;
    gameManager.claimVictory(planetWrapper.value.locationId);
  }, [gameManager, planetWrapper]);

  return (
    <StyledRow>
      {shouldShow && (
        <>
            <ShortcutBtn
              className='button'
              size='stretch'
              active={claimingVictory}
              disabled={!claimable || claimingVictory}
              onClick={claimVictory}
              onShortcutPressed={claimVictory}
              shortcutKey={INVADE}
              shortcutText={INVADE}
            >
              <TooltipTrigger
                style={{ width: '100%', textAlign: 'center' }}
                name={TooltipName.Empty}
                extraContent={
                  <>
                    <Green>
                      Capture this planet to win the game!{' '}
                      {!!energyLeftToClaimVictory && energyLeftToClaimVictory.percentNeeded >= 0 && (
                        <>
                          You need <White>{energyLeftToClaimVictory.energyNeeded}</White> ({energyLeftToClaimVictory.percentNeeded}%) more energy to claim victory with this planet.
                        </>
                      )}
                    </Green>
                  </>
                }
              >
                {claimingVictory ? (
                  <LoadingSpinner initialText={'Claiming Victory...'} />
                ) : (
                  'Claim Victory!'
                )}
              </TooltipTrigger>
            </ShortcutBtn>
        </>
      )}
    </StyledRow>
  );
}
