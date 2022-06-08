import { ModalName, Setting } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TutorialManager, {
  TutorialManagerEvent,
  TutorialState,
} from '../../Backend/GameLogic/TutorialManager';
import { Hook } from '../../_types/global/GlobalTypes';
import { Btn } from '../Components/Btn';
import { Link } from '../Components/CoreUI';
import { Icon, IconType } from '../Components/Icons';
import { Gold, Green, Red, White } from '../Components/Text';
import dfstyles from '../Styles/dfstyles';
import { useUIManager } from '../Utils/AppHooks';
import { useBooleanSetting } from '../Utils/SettingsHooks';
import { ModalPane } from '../Views/ModalPane';

function SurveyPaneContent() {
  const uiManager = useUIManager();
  return (
    <div>
      <p> We hope you enjoyed your time playing Dark Forest!</p>
      <br/>
      <p>Consider helping us improve the Arena by  </p>
      <Link
      to = {'https://docs.google.com/forms/d/1NTkjl5D9iz77aEv3gD_lrlgUE8dIYWKkwLL_Jys6pBM/'}>
        {' '}
        providing feedback on our short survey!
      </Link>
      <br/>
      <p>All respondants will earn a POAP for their time.</p>
    </div>
  );
}

const StyledSurveyPane = styled.div`
  display: block;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;

  background: ${dfstyles.colors.backgroundlighter};
  color: ${dfstyles.colors.text};
  padding: 8px;
  border-bottom: 1px solid ${dfstyles.colors.border};
  border-right: 1px solid ${dfstyles.colors.border};

  width: 24em;
  height: fit-content;

  z-index: 10;

  & .tutintro {
    & > div:last-child {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-top: 1em;
    }
  }

  & .tutzoom,
  & .tutalmost {
    & > div:last-child {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 1em;
    }
  }
`;

export function SurveyPane({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const uiManager = useUIManager();
  return (
    <ModalPane
      id={ModalName.Survey}
      title={`Thanks for Playing!`}
      visible={visible}
      hideClose
      onClose={onClose}
    >
      <SurveyPaneContent />
    </ModalPane>
  );
}
