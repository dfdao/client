import { ModalName } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { Icon, IconType } from '../Components/Icons';
import { Blue, Green, Red, White } from '../Components/Text';
import { TextPreview } from '../Components/TextPreview';
import dfstyles from '../Styles/dfstyles';
import { useAccount, useUIManager } from '../Utils/AppHooks';
import { ModalPane } from '../Views/ModalPane';

const StyledOnboardingContent = styled.div`
  width: 36em;
  height: 20em;
  position: relative;
  color: ${dfstyles.colors.text};

  .btn {
    position: absolute;
    right: 0.5em;
    bottom: 0.5em;
  }

  .indent {
    margin-left: 1em;
  }

  & > p,
  & > div {
    margin: 1em 0;
  }

  & > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const enum OnboardState {
  Money,
  Keys,
}

function OnboardMoney({ advance }: { advance: () => void }) {
  const uiManager = useUIManager();
  const account = useAccount(uiManager);

  const explorerAddressLink = `https://blockscout.com/poa/xdai/optimism/address/${account}`;

  return (
    <StyledOnboardingContent>
      <p>
        Welcome to <Green>Dark Forest Arena</Green>!
      </p>
      <p>
        We have initialized a {' '}
        <a onClick={() => window.open('https://github.com/austintgriffith/burner-wallet')}>
          burner wallet:
        </a>{' '}
        </p>
        <div>
        <Blue>
          <a onClick={() => window.open(explorerAddressLink)}>({account})</a>
        </Blue>
        </div>
        <p>
        for you and dripped 5c to it, courtesy of dfdao and Gnosis Chain.{' '}
        <White>Please enable popups</White> so that all transactions may be confirmed by you.
        <Icon type={IconType.Settings} />
      </p>
      <div>
        <span></span>
        <Btn className='btn' onClick={advance}>
          Proceed
        </Btn>
      </div>
    </StyledOnboardingContent>
  );
}

function OnboardKeys({ advance }: { advance: () => void }) {
  const uiManager = useUIManager();
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

  return (
    <StyledOnboardingContent>
      <p>
        The game stores your <White>private key</White> and home coordinates in your browser. They
        are your password, and <Red>should never be viewed by anyone else.</Red>
      </p>
      <p>
        <Btn onClick = {() => {setViewPrivateKey(!viewPrivateKey)}}>{viewPrivateKey ? 'Hide' : 'View'} private key</Btn> <br />
        Your private key is:{' '}
        <TextPreview text={viewPrivateKey ? sKey : 'hidden'} focusedWidth={'150px'} unFocusedWidth={'150px'} />
      </p>
      <p>
      <Btn onClick = {() => {setViewHomeCoords(!viewHomeCoords)}}>{viewHomeCoords ? 'Hide' : 'View'}  home coords</Btn> <br />
        Your private key is:{' '}
        <TextPreview text={viewHomeCoords ? home : "hidden"} focusedWidth={'150px'} unFocusedWidth={'150px'} />
      </p>

      <p>We recommend you back this information up.</p>
      <p>
        That's all! Click <White>Proceed</White> to join the world of <White>DARK FOREST...</White>
      </p>
      <div>
        <span></span>
        <Btn onClick={advance} className='btn'>
          Proceed
        </Btn>
      </div>
    </StyledOnboardingContent>
  );
}

export default function OnboardingPane({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [onboardState, setOnboardState] = useState<OnboardState>(OnboardState.Money);

  const advance = () => setOnboardState((x) => x + 1);

  useEffect(() => {
    if (onboardState === OnboardState.Keys + 1) {
      onClose();
    }
  }, [onboardState, onClose]);

  return (
    <ModalPane
      id={ModalName.Onboarding}
      title={'Welcome to Dark Forest'}
      hideClose
      visible={visible}
      onClose={onClose}
    >
      {onboardState === OnboardState.Money && <OnboardMoney advance={advance} />}
      {onboardState === OnboardState.Keys && <OnboardKeys advance={advance} />}
    </ModalPane>
  );
}
