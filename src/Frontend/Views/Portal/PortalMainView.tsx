import { DarkForestTextInput } from '@darkforest_eth/ui';
import React, { useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Btn } from '../../Components/Btn';
import { TextInput } from '../../Components/Input';
import { NotFoundPage } from '../../Pages/NotFoundPage';
import dfstyles from '../../Styles/dfstyles';
import { competitiveConfig } from '../../Utils/constants';
import { MapInfoView } from './MapInfoView';

export function PortalMainView() {
  const [input, setInput] = useState<string>('');

  return (
    <MainContainer>
      <TopBar>
        <TitleContainer>
          <Title>Home</Title>
        </TitleContainer>

        <TitleContainer>
          <Btn variant='portal' onClick={() => validateAddress(input)}>
            Go
          </Btn>
          <TextInput
            portal={true}
            style={inputStyle}
            value={input}
            placeholder={'Search for a map config'}
            onChange={(e: Event & React.ChangeEvent<DarkForestTextInput>) =>
              setInput(e.target.value)
            }
          />{' '}
        </TitleContainer>
      </TopBar>
      <Switch>
        <Redirect path='/portal/map' to={`/portal/map/${competitiveConfig}`} exact={true} />

        <Route path={'/portal/map/:configHash'} component={MapInfoView} />
        <Route path = '/portal/*' component = {() => <TitleContainer style = {{justifyContent: 'center'}}>Page Not Found</TitleContainer>} />
      </Switch>
    </MainContainer>
  );
}


function validateAddress(input: string) {
  const history = useHistory();

  let lower = input.toLowerCase();
  if (lower.slice(0, 2) === '0x') {
    lower = lower.slice(2);
  }
  let error = false;
  if (lower.length !== 64) {
    console.log('incorrect length');
    error = true;
  }
  for (const c of lower) {
    if ('0123456789abcdef'.indexOf(c) === -1) {
      console.log(`bad letter: ${c}`);
      error = true;
      alert('invalid map address! Try again with a valid address.');
      return;
    }
  }
  if (error) {
    alert('invalid map address! Try again with a valid address.');
    return;
  }

  history.push(`/portal/map/${input}`);
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
  gap: 8px;
`;

const inputStyle = {
  width: '100%',
} as CSSStyleDeclaration & React.CSSProperties;
