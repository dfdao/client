import { Setting } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import TutorialManager, {
  TutorialManagerEvent,
  TutorialState,
} from '../../../Backend/GameLogic/TutorialManager';
import { Btn } from '../../Components/Btn';
import { Link } from '../../Components/CoreUI';
import { Icon, IconType } from '../../Components/Icons';
import { Bronze, Gold, Green, Red, Silver, White } from '../../Components/Text';
import { TextPreview } from '../../Components/TextPreview';
import { useUIManager } from '../../Utils/AppHooks';
import { useBooleanSetting } from '../../Utils/SettingsHooks';
import { StyledTutorialPane } from './StyledTutorialPane';

function TutorialPaneContent({ tutorialState }: { tutorialState: TutorialState }) {
  const uiManager = useUIManager();
  const tutorialManager = TutorialManager.getInstance(uiManager);

  const [sKey, setSKey] = useState<string | undefined>(undefined);
  const [viewPrivateKey, setViewPrivateKey] = useState<boolean>(false);
  const [viewHomeCoords, setViewHomeCoords] = useState<boolean>(false);

  useEffect(() => {
    if (!uiManager) return;
    setSKey(uiManager.getPrivateKey());
  }, [uiManager]);

  const [home, setHome] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!uiManager) return;
    const coords = uiManager.getHomeCoords();
    setHome(coords ? `(${coords.x}, ${coords.y})` : '');
  }, [uiManager]);
  if (tutorialState === TutorialState.Welcome) {
    return (
      <div className='tutzoom'>
        <White>
          Welcome to the Dark Forest Arena tutorial, Captain! You're an intergalactic explorer who
          commands planets in a fully on-chain universe.
        </White>
        <br />
        <div>Click your spawn planet to get started.</div>
      </div>
    );
  } else if (tutorialState === TutorialState.SpawnPlanet) {
    return (
      <div className='tutzoom'>
        Well done! This is your first planet. Over the course of the game, you will capture more
        throughout the universe.
        <br />
        The planet pane displays quick information about a planet.
        <br />
        <br />
        <div>
          Try hovering over different planet stats (located beneath the planet's Level and Rank) to
          learn more.
        </div>
        <div style={{ gap: '5px' }}>
          <Btn
            className='btn'
            onClick={() => tutorialManager.acceptInput(TutorialState.SpawnPlanet)}
          >
            Continue
          </Btn>
        </div>
      </div>
    );
  } else if (tutorialState === TutorialState.SendFleet) {
    return (
      <div className='tutzoom'>
        To expand your empire, you need to capture planets. Use some of your planet's{' '}
        <White>Energy</White> to do so.
        <br />
        <br />
        Here's how: Click your planet, press {<White>q</White>}, and click a nearby planet. You
        should see some energy fly there!
      </div>
    );
  } else if (tutorialState === TutorialState.SpaceJunk) {
    return (
      <div className='tutzoom'>
        <p>
          Every time you capture a planet you accumulate <White>Space Junk</White>. Once you hit the
          Space Junk limit, you won't be able to move to new planets.
        </p>
        <p>
          To reduce your space junk, <Red>Abandon</Red> planets and keep expanding!
        </p>
        <br />
        <br />
        Take a look at the top of the screen to see you current and maximum{' '}
        <White>Space Junk</White>.
        <div style={{ gap: '5px' }}>
          <Btn className='btn' onClick={() => tutorialManager.complete()}>
            Exit
          </Btn>
          <Btn className='btn' onClick={() => tutorialManager.acceptInput(TutorialState.SpaceJunk)}>
            Next
          </Btn>
        </div>
      </div>
    );
  } else if (tutorialState === TutorialState.Spaceship) {
    return (
      <div className='tutzoom'>
        <p>
          You also control{' '}
          {uiManager.getMySpaceships().length > 1 ? 'several space ships' : 'a space ship'} - check
          your home planet! You can move spaceships between any two planets, even if you don't own
          them. Space ships can move any distance.
          <White>Try moving a spaceship you own to another planet now!</White>
        </p>
        <p>Tip: Before moving, click a spaceship to select it. Then execute your move.</p>
        <div style={{ gap: '5px' }}>
          <Btn className='btn' onClick={() => tutorialManager.complete()}>
            Exit
          </Btn>
          <Btn className='btn' onClick={() => tutorialManager.acceptInput(TutorialState.Spaceship)}>
            Skip
          </Btn>
        </div>
      </div>
    );
  } else if (tutorialState === TutorialState.ZoomOut) {
    return (
      <div className='tutzoom'>
        <p>Great! You can zoom using the mouse wheel. </p>
        <p>Try zooming all the way out so you can find the target planet!</p>
        <div style={{ gap: '5px' }}>
          <Btn className='btn' onClick={() => tutorialManager.complete()}>
            Exit
          </Btn>

          <Btn className='btn' onClick={() => tutorialManager.acceptInput(TutorialState.ZoomOut)}>
            Next
          </Btn>
        </div>
      </div>
    );
  } else if (tutorialState === TutorialState.MinerMove) {
    return (
      <div className='tutzoom'>
        Most of the universe appears greyed out. You need to use your explorer{' '}
        <Icon type={IconType.Target} /> to reveal those areas.
        <br />
        The explorer <Icon type={IconType.Target} /> indicates where you are exploring.
        <br />
        <White>
          Move your explorer with the bottom-left context menu by clicking on the Move{' '}
          <Icon type={IconType.Target} /> button
        </White>
        , then clicking in a grey region.
        <div style={{ gap: '5px' }}>
          <Btn className='btn' onClick={() => tutorialManager.complete()}>
            Exit
          </Btn>
          <Btn className='btn' onClick={() => tutorialManager.acceptInput(TutorialState.MinerMove)}>
            Skip
          </Btn>
        </div>
      </div>
    );
  } else if (tutorialState === TutorialState.MinerPause) {
    return (
      <div className='tutzoom'>
        Great! You can also pause your explorer by clicking the pause <Icon type={IconType.Pause} />{' '}
        button.
        <br />
        <br />
        <White>Try pausing your explorer now.</White>
        <div style={{ gap: '5px' }}>
          <Btn className='btn' onClick={() => tutorialManager.complete()}>
            Exit
          </Btn>
          <Btn
            className='btn'
            onClick={() => tutorialManager.acceptInput(TutorialState.MinerPause)}
          >
            Skip
          </Btn>
        </div>
      </div>
    );
  } else if (tutorialState === TutorialState.HowToGetScore) {
    const isCompetitive = uiManager.isCompetitive();
    const victoryThreshold = uiManager.contractConstants.CLAIM_VICTORY_ENERGY_PERCENT;
    return (
      <div className='tutzoom'>
        <White>It's a{isCompetitive ? ' Grand Prix!' : 'n Arena Battle!'}</White>
        <p>
          Race against the clock to capture the Target Planet (it has a big 🎯 floating above it)
          and{' '}
          <Green>
            claim victory when it contains at least <Gold>{victoryThreshold}%</Gold> energy!
          </Green>
        </p>
        {isCompetitive && (
          <p>The player with the fastest time after 48hrs will win XDAI and a 🏆!</p>
        )}
        <div style={{ gap: '5px' }}>
          <Btn className='btn' onClick={() => tutorialManager.complete()}>
            Exit
          </Btn>
          <Btn
            className='btn'
            onClick={() => tutorialManager.acceptInput(TutorialState.HowToGetScore)}
          >
            Next
          </Btn>
        </div>
      </div>
    );
  } else if (tutorialState === TutorialState.BlockedPlanet) {
    return (
      <div className='tutzoom'>
        <p>
          This game includes blocked planets. You can't move to this planet! However, your opponents
          may be able to.
        </p>
        <p>
          Hover over the blocked icon on the planet card to see which players can move to that
          planet.
        </p>
        <div style={{ gap: '5px' }}>
          <Btn className='btn' onClick={() => tutorialManager.complete()}>
            Exit
          </Btn>
          <Btn
            className='btn'
            onClick={() => tutorialManager.acceptInput(TutorialState.BlockedPlanet)}
          >
            Next
          </Btn>
        </div>
      </div>
    );
  } else if (tutorialState === TutorialState.DefensePlanet) {
    return (
      <div className='tutzoom'>
        <p>This is your home planet. A home planet is a target planet that you cannot move to!</p>
        <p>
          You will need to defend this planet from potential attacks, because if someone else
          captures it, they could win. Hover over the blocked icon on the planet card to see which
          players can move there.
        </p>
        <div style={{ gap: '5px' }}>
          <Btn className='btn' onClick={() => tutorialManager.complete()}>
            Exit
          </Btn>
          <Btn
            className='btn'
            onClick={() => tutorialManager.acceptInput(TutorialState.DefensePlanet)}
          >
            Next
          </Btn>
        </div>
      </div>
    );
  } else if (tutorialState === TutorialState.AlmostCompleted) {
    return (
      <div className='tutalmost'>
        This is the end of the tutorial. For a more in-depth strategy guide,{' '}
        <Link to='https://medium.com/@classicjdf/classicjs-dark-forest-101-strategy-guide-part-1-energy-1b80923fee69'>
          click here
        </Link>
        . For video tutorials,{' '}
        <Link to='https://www.youtube.com/watch?v=3a4i9IyfmBI&list=PLn4H2Bj-iklclFZW_YpKCQaTnBVaECLDK'>
          click here
        </Link>
        . More information will pop up in the <White>upper-right</White> as you discover more about
        the game.
        <br />
        We hope you enjoy Dark Forest!
        <div style={{ gap: '5px' }}>
          <Btn className='btn' onClick={() => tutorialManager.complete()}>
            Finish
          </Btn>
        </div>
      </div>
    );
  } else {
    return <> </>;
  }
}

export function TutorialPane() {
  const uiManager = useUIManager();
  const tutorialManager = TutorialManager.getInstance(uiManager);
  const [tutorialState, setTutorialState] = useState<TutorialState>(TutorialState.Welcome);
  const [completed, setCompleted] = useBooleanSetting(uiManager, Setting.TutorialCompleted);

  // sync tutorial state
  useEffect(() => {
    const update = (newState: TutorialState) => {
      setTutorialState(newState);
      setCompleted(newState === TutorialState.Completed);
    };
    tutorialManager.on(TutorialManagerEvent.StateChanged, update);

    return () => {
      tutorialManager.removeListener(TutorialManagerEvent.StateChanged, update);
    };
  }, [tutorialManager, setCompleted]);

  if (completed) {
    return null;
  }

  return (
    <StyledTutorialPane>
      <TutorialPaneContent tutorialState={tutorialState} />
    </StyledTutorialPane>
  );
}
