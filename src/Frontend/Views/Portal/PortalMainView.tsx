import { EthAddress } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { loadAccountData } from '../../../Backend/Network/AccountApi';
import { logOut } from '../../../Backend/Network/AccountManager';
import { loadRecentMaps } from '../../../Backend/Network/MapsApi';
import { Dropdown, DropdownItem } from '../../Components/Dropdown';
import dfstyles from '../../Styles/dfstyles';
import { useTwitters } from '../../Utils/AppHooks';
import { Account } from './Account';
import { AccountInfoView } from './AccountInfoView';
import { MapInfoView } from './MapInfoView';
import { PortalHomeView } from './PortalHomeView';

export function PortalMainView({ playerAddress }: { playerAddress: EthAddress }) {
  const [input, setInput] = useState<string>('');
  const [results, setResults] = useState<DropdownItem[]>([]);
  const history = useHistory();
  const twitters = useTwitters() as Object;

  function handleSearch() {
    if (input.length > 0) {
      let results: DropdownItem[] = [];
      const lower = input.trim().toLowerCase();
      // check twitters
      const foundTwitter = Object.entries(twitters).find((t) => t[1] == lower);
      if (foundTwitter) {
        results.push({
          label: foundTwitter[0],
          action: () => history.push(`/portal/account/${foundTwitter[0]}`),
        });
      }
      // check config hashes
      loadRecentMaps(1, lower, undefined).then((maps) => {
        if (maps && maps.length > 0) {
          results.push({
            label: maps[0].configHash,
            action: () => history.push(`/portal/map/${maps[0].configHash}`),
          });
        }
      });
      // check accounts
      loadAccountData(lower as EthAddress).then((account) => {
        if (account) {
          results.push({
            label: lower,
            action: () => history.push(`/portal/account/${lower}`),
          });
        }
      });
      console.log('test', results);
      setResults(results);
      return;
    }
    setResults([{ label: 'No results found.', action: () => {} }]);
    return;
  }

  return (
    <MainContainer>
      <TopBar>
        <TitleContainer>
          <Title onClick={() => history.push('/portal/home')}>Home</Title>
        </TitleContainer>

        <TitleContainer>
          <InputContainer>
            <PortalInput
              placeholder={'Search for a map hash, twitter, or address'}
              // TODO: fix type
              onChange={(e: any) => setInput(e.target.value)}
            />
            <Dropdown items={results} open={true} />
          </InputContainer>
          <button onClick={() => handleSearch()}>Search</button>
        </TitleContainer>
        <TitleContainer>
          <Account address={playerAddress} />
        </TitleContainer>
      </TopBar>
      <Switch>
        {/* <Redirect path='/portal/map' to={`/portal/map/${competitiveConfig}`} exact={true} /> */}
        <Redirect path='/portal/map' to={`/portal/home`} exact={true} />

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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
`;

const TopBar = styled.div`
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
  gap: 8px;
`;

export const MinimalButton = styled.button`
  border-radius: 3px;
  padding: 8px;
  background: #252525;
  color: #fff;
  text-transform: uppercase;
`;

const PortalInput = styled.input`
  min-width: 350px;
  background: #252525;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${dfstyles.colors.borderDarker};
  z-index: 1;
`;
