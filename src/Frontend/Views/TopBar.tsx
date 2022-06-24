import { Monomitter } from '@darkforest_eth/events';
import { weiToEth } from '@darkforest_eth/network';
import { EthAddress, ModalName, TooltipName } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CaptureZonesGeneratedEvent } from '../../Backend/GameLogic/CaptureZoneGenerator';
import { Hook } from '../../_types/global/GlobalTypes';
import { AlignCenterHorizontally } from '../Components/CoreUI';
import { AccountLabel } from '../Components/Labels/Labels';
import { Gold, Red, Sub, Text, White } from '../Components/Text';
import { TooltipTrigger } from '../Panes/Tooltip';
import { usePlayer, useUIManager } from '../Utils/AppHooks';
import { DFZIndex } from '../Utils/constants';
import { useEmitterSubscribe, useEmitterValue } from '../Utils/EmitterHooks';
import { ModalToggleButton } from './ModalIcon';
import { NetworkHealth } from './NetworkHealth';
import { Paused } from './Paused';
import { Gameover } from './Gameover';
import { Timer } from './Timer';

const TopBarContainer = styled.div`
  z-index: ${DFZIndex.MenuBar};
  padding: 0 2px;
  width: 530px;
`;

const Numbers = styled.div`
  display: inline-block;
`;

function SpaceJunk({ account }: { account: EthAddress | undefined }) {
  const uiManager = useUIManager();

  const [spaceJunk, setSpaceJunk] = useState<number>(0);
  const [spaceJunkLimit, setSpaceJunkLimit] = useState<number>(0);

  useEffect(() => {
    if (!uiManager) return;
    const gameManager = uiManager.getGameManager();

    const refreshSpaceJunk = () => {
      if (!account) return;

      setSpaceJunk(gameManager.getPlayerSpaceJunk(account) || 0);
      setSpaceJunkLimit(gameManager.getPlayerSpaceJunkLimit(account) || 0);
    };

    const sub = gameManager.playersUpdated$.subscribe(() => {
      refreshSpaceJunk();
    });
    refreshSpaceJunk();

    return () => sub.unsubscribe();
  }, [uiManager, account]);

  return (
    <Numbers>
      <Sub>
        <TooltipTrigger name={TooltipName.SpaceJunk}>
          junk:{' '}
          <Text>
            {spaceJunk} / {spaceJunkLimit}
          </Text>
        </TooltipTrigger>
      </Sub>
    </Numbers>
  );
}

function CaptureZoneExplanation() {
  const uiManager = useUIManager();

  const numberedItem = (n: number, content: string) => (
    <li>
      <White>{n}.)</White> {content}
    </li>
  );

  return (
    <>
      <White>Capture Zones:</White> Energy fluctations are creating highly valuable zones of space.{' '}
      <Gold>
        Invading and holding planets in these areas give you score! The zones are marked as gold
        rings on your map.
      </Gold>
      <br />
      <br />
      In order to capture a planet in a zone, you must:
      <ol>
        {numberedItem(1, 'Own a planet in the capture zone.')}
        {numberedItem(2, 'Start the invasion by clicking the Invade button.')}
        {numberedItem(
          3,
          `Hold the planet for ${uiManager.contractConstants.CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED}
          blocks.`
        )}
        {numberedItem(
          4,
          'Capture the planet by clicking the Capture button (Capturing does not require you to be in the zone, only Invading).'
        )}
      </ol>
      <br />
      <Red>
        Planets can only be Captured once. However, after an Invasion has started, anyone can
        capture it.
      </Red>{' '}
      If you see an opponent start their Invasion, you can take the planet from them and Capture it
      for yourself!
    </>
  );
}

function CaptureZones({
  emitter,
  nextChangeBlock,
}: {
  emitter: Monomitter<CaptureZonesGeneratedEvent>;
  nextChangeBlock: number;
}) {
  const uiManager = useUIManager();
  const currentBlockNumber = useEmitterValue(uiManager.getEthConnection().blockNumber$, undefined);
  const [nextGenerationBlock, setNextGenerationBlock] = useState(
    Math.max(
      uiManager.contractConstants.GAME_START_BLOCK +
        uiManager.contractConstants.CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL,
      nextChangeBlock
    )
  );

  useEmitterSubscribe(
    emitter,
    (zoneGeneration) => {
      setNextGenerationBlock(zoneGeneration.nextChangeBlock);
    },
    [setNextGenerationBlock]
  );

  return (
    <Numbers>
      <TooltipTrigger name={TooltipName.Empty} extraContent={<CaptureZoneExplanation />}>
        Capture Zones change in {nextGenerationBlock - (currentBlockNumber || 0)} blocks.
      </TooltipTrigger>
    </Numbers>
  );
}

export function TopBar({ twitterVerifyHook }: { twitterVerifyHook: Hook<boolean> }) {
  const uiManager = useUIManager();
  const player = usePlayer(uiManager);
  const account = player.value?.address;
  const twitter = player.value?.twitter;
  const balance = useEmitterValue(uiManager.getMyBalance$(), uiManager.getMyBalanceBn());

  let captureZones = null;
  if (uiManager.captureZonesEnabled) {
    const captureZoneGenerator = uiManager.getCaptureZoneGenerator();
    if (captureZoneGenerator) {
      const emitter = captureZoneGenerator.generated$;
      const nextChangeBlock = captureZoneGenerator.getNextChangeBlock();
      captureZones = <CaptureZones emitter={emitter} nextChangeBlock={nextChangeBlock} />;
    }
  }

  return (
    <TopBarContainer>
      <AlignCenterHorizontally style={{ width: '100%', justifyContent: 'space-around' }}>
        <TooltipTrigger
          name={TooltipName.Empty}
          extraContent={<Text>Your burner wallet address.</Text>}
        >
          <AccountLabel includeAddressIfHasTwitter={true} width={'50px'} />
        </TooltipTrigger>
        <TooltipTrigger
          name={TooltipName.Empty}
          extraContent={<Text>Your burner wallet balance.</Text>}
        >
          <Sub>({weiToEth(balance).toFixed(2)} xDAI)</Sub>
        </TooltipTrigger>
        {process.env.DF_TWITTER_URL && (
          <>
            <TooltipTrigger
              name={TooltipName.Empty}
              extraContent={<Text>Connect your burner wallet to your twitter account.</Text>}
            >
              <ModalToggleButton
                size='small'
                modal={ModalName.TwitterVerify}
                hook={twitterVerifyHook}
                style={
                  {
                    width: !twitter ? '100px' : undefined,
                  } as CSSStyleDeclaration & React.CSSProperties
                }
                text={!twitter ? 'Connect' : undefined}
              />
            </TooltipTrigger>
          </>
        )}
        {/* {captureZones} */}
        {uiManager.getSpaceJunkEnabled() && (
          <>
            <SpaceJunk account={account} />
          </>
        )}
        {/* <BoardPlacement account={account} /> */}
      </AlignCenterHorizontally>
      <Timer account={account} />
      <NetworkHealth />
      <Gameover />
      <Paused />
    </TopBarContainer>
  );
}
