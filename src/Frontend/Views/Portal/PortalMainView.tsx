import { DarkForestTextInput } from '@darkforest_eth/ui';
import React, { useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Btn } from '../../Components/Btn';
import { SelectFrom } from '../../Components/CoreUI';
import { TextInput } from '../../Components/Input';
import dfstyles from '../../Styles/dfstyles';
import { competitiveConfig } from '../../Utils/constants';
import { AccountInfoView } from './AccountInfoView';
import { MapInfoView } from './MapInfoView';

export function PortalMainView() {
  const [input, setInput] = useState<string>('');
  const [type, setType] = useState<string>('Map');

  return (
    <MainContainer>
      <TopBar>
        <TitleContainer>
          <Title>Home</Title>
        </TitleContainer>

        <TitleContainer>
          <Btn variant='portal' onClick={() => validateAddress(input, type)}>
            go
          </Btn>
          <SelectFrom
            portal
            wide={false}
            style={{ padding: '6px' }}
            values={['Account', 'Map']}
            labels={['Account', 'Map']}
            value={type}
            setValue={setType}
          />
          <TextInput
            portal={true}
            style={inputStyle}
            value={input}
            placeholder={'Search for a map or acct'}
            onChange={(e: Event & React.ChangeEvent<DarkForestTextInput>) =>
              setInput(e.target.value)
            }
          />{' '}
        </TitleContainer>
      </TopBar>
      <Switch>
        <Redirect path='/portal/map' to={`/portal/map/${competitiveConfig}`} exact={true} />

        <Route path={'/portal/map/:configHash'} component={MapInfoView} />
        <Route path={'/portal/account/:account'} component={AccountInfoView} />

        <Route
          path='/portal/*'
          component={() => (
            <TitleContainer style={{ justifyContent: 'center' }}>Page Not Found</TitleContainer>
          )}
        />
      </Switch>
    </MainContainer>
  );
}

function validateAddress(input: string, type: string) {
  console.log('here')
  const history = useHistory();

  let lower = input.toLowerCase();
  if (lower.slice(0, 2) === '0x') {
    lower = lower.slice(2);
  }
  let error = false;
  for (const c of lower) {
    if ('0123456789abcdef'.indexOf(c) === -1) {
      console.log(`bad letter: ${c}`);
      error = true;
      alert('invalid map address! Try again with a valid address.');
      return;
    }
  }
  if (type == 'Map' && lower.length !== 64) error = true;
  else if (lower.length !== 40) error = true;

  if (error) {
    alert('invalid map address! Try again with a valid address.');
    return;
  }

  const link = `/portal/${type == 'Map' ? 'map/' : 'account/'}${input}`

  history.push(link);
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
