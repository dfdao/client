import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../Components/Button';
import { PortalHistoryView } from './PortalHistoryView';
import { useConfigFromHash, useEthConnection, useTwitters } from '../../Utils/AppHooks';
import { competitiveConfig, tutorialConfig } from '../../Utils/constants';
import { Account } from './Account';
import { AccountInfoView } from './AccountInfoView';
import { MapInfoView } from './MapInfoView';
import { PortalCommunityView } from './PortalCommunityView';
import { MatchmakingView } from './MatchmakingView';
import { PortalHomeView } from './PortalHomeView';
import { populate } from '../../../Backend/Utils/Populate';
import { CONTRACT_ADDRESS } from '@darkforest_eth/contracts';
import { address } from '@darkforest_eth/serde';
import { SeasonLeaderboard } from '../Leaderboards/SeasonLeaderboard';
import { Logo } from '../../Panes/Lobby/LobbiesUtils';
import { TabNav } from './Components/TabNav';
import './portal.css';
import { PortalHeader } from './Components/PortalHeader';
import { theme } from './styleUtils';

export function PortalMainView() {
  return (
    <>
      <div style={{ paddingBottom: '3rem' }}>
        <PortalHeader />
        <Switch>
          <Redirect path='/portal/map' to={`/portal/map/${competitiveConfig}`} exact={true} />
          <Route path={'/portal/home'} exact={true} component={PortalHomeView} />
          <Route path={'/portal/map/:configHash'} component={MapInfoView} />
          <Route path={'/portal/account/:account'} component={AccountInfoView} />
          <Route path={'/portal/history/:account'} component={PortalHistoryView} />
          <Route path={'/portal/community'} component={PortalCommunityView} />
          <Route path={'/portal/matchmaking'} component={MatchmakingView} />
          <Route path={'/portal/leaderboard'} component={SeasonLeaderboard} />
          <Route
            path='/portal/*'
            component={() => (
              <div className='row' style={{ justifyContent: 'center' }}>
                Page Not Found
              </div>
            )}
          />
        </Switch>
      </div>
    </>
  );
}

export const MinimalButton = styled.button`
  border-radius: 3px;
  padding: 8px;
  background: ${theme.colors.bg1};
  color: #fff;
  text-transform: uppercase;
`;
