import { DarkForestTextInput } from '@darkforest_eth/ui';
import { validate } from 'email-validator';
import React, { useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Btn } from '../../Components/Btn';
import { SelectFrom } from '../../Components/CoreUI';
import { TextInput } from '../../Components/Input';
import dfstyles from '../../Styles/dfstyles';
import { useTwitters } from '../../Utils/AppHooks';
import { competitiveConfig } from '../../Utils/constants';
import { AccountInfoView } from './AccountInfoView';
import { MapInfoView } from './MapInfoView';
import { PortalHomeView } from './PortalHomeView';

export function PortalMainView() {
  const [input, setInput] = useState<string>('');
  const [type, setType] = useState<string>('Account');
  const history = useHistory();
  const twitters = useTwitters() as Object;
  function validateAddress() {
    let output: string | undefined = undefined;
    let lower = input.toLowerCase();
    if (lower.slice(0, 2) === '0x') {
      lower = lower.slice(2);
    }
    let error = false;
    // for (const c of lower) {
    //   if ('0123456789abcdef'.indexOf(c) === -1) {
    //     console.log(`bad letter: ${c}`);
    //     error = true;
    //     alert(`invalid ${type == 'Account'? 'account address' : 'config hash'}! Please try again.`);
    //     return;
    //   }
    // }

    if (type == 'Map' && lower.length !== 64) error = true;
    else if (lower.length !== 40) {
      const foundTwitter = Object.entries(twitters).find((t) => t[1] == input);
      if (!foundTwitter) error = true;
      else output = foundTwitter[0];
    }

    console.log('output:', output);

    if (error) {
      alert(`invalid ${type == 'Account' ? 'account address' : 'config hash'}! Please try again.`);
      return;
    }

    const link = `/portal/${type == 'Map' ? 'map/' : 'account/'}${output ? output : input}`;

    history.push(link);
  }

  return (
    <MainContainer>
      <TopBar>
        <TitleContainer>
          <Title onClick={() => history.push('/portal/home')}>Home</Title>
        </TitleContainer>

        <TitleContainer>
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
            placeholder={'Search for a map, twitter, or acct'}
            onChange={(e: Event & React.ChangeEvent<DarkForestTextInput>) =>
              setInput(e.target.value)
            }
          />{' '}
          <MinimalButton onClick={() => validateAddress()}>Search</MinimalButton>
        </TitleContainer>
      </TopBar>
      <Switch>
        <Redirect path='/portal/map' to={`/portal/map/${competitiveConfig}`} exact={true} />

        <Route path={'/portal/home'} exact={true} component={PortalHomeView} />
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

const MainContainer = styled.div`
  display: flex;
  flex: 1 1;
  flex-direction: column;
  // border-left: 1px solid ${dfstyles.colors.border};
  height: 100vh;
  overflow: hidden;
  // padding-bottom: 3em;
  background: rgba(255, 255, 255, 0.04);
`;

const TopBar = styled.div`
  // border-bottom: 1px solid ${dfstyles.colors.border};

  height: 56px;
  max-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 1.5em;
  cursor: pointer;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  // width: 100%;
  justify-content: space-between;
  gap: 8px;
`;

const inputStyle = {
  minWidth: '350px',
  background: '#252525',
  color: '#fff',
} as CSSStyleDeclaration & React.CSSProperties;

export const MinimalButton = styled.button`
  border-radius: 3px;
  padding: 8px;
  background: #252525;
  color: #fff;
  text-transform: uppercase;
`;
