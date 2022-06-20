import { DarkForestTextInput } from '@darkforest_eth/ui';
import React, { useState } from 'react';
import { Redirect, Route, Router, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Btn } from '../../Components/Btn';
import { TextInput } from '../../Components/Input';
import dfstyles from '../../Styles/dfstyles';
import { competitiveConfig } from '../../Utils/constants';
import { MapInfoView } from './MapInfoView';

export function PortalMainView() {
  const history = useHistory();
  const [input, setInput] = useState<string>();
  return (
    <MainContainer>
      <TopBar>
        <TitleContainer>
          <Title>Grand Prix </Title>
          </TitleContainer>

          <div>
          <Btn variant = 'portal' onClick= {() => history.push(`/portal/map/${input}`)}>Enter</Btn>
          <TextInput
            value={input}
            placeholder={'Search for a map config'}
            onChange={(e: Event & React.ChangeEvent<DarkForestTextInput>) =>
              setInput(e.target.value)
            }
          />{' '}
          </div>
      </TopBar>
      <Switch>
        <Redirect
          path='/portal/map'
          to={`/portal/map/${competitiveConfig}`}
          push={true}
          exact={true}
        />

        <Route path={'/portal/map/:configHash'} component={MapInfoView} />
      </Switch>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex: 1 1;
  flex-direction: column;
  border-left: 1px solid ${dfstyles.colors.border};
  height: 100vh;
  overflow: hidden;
  padding-bottom: 3em;
  background: rgba(255, 255, 255, 0.04);
`;

const TopBar = styled.div`
  border-bottom: 1px solid ${dfstyles.colors.border};

  height: 56px;
  max-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 16px;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 1.5em;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  justify-content: space-between;
`;
const TimeContainer = styled.div`
  font-size: 1em;
  text-align: center;
`;
