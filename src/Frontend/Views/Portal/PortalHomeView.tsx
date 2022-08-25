import { BigNumber } from 'ethers';
import React from 'react';
import styled from 'styled-components';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { useConfigFromHash, useEthConnection } from '../../Utils/AppHooks';
import { MapOverview } from './MapOverview';

export interface RoundResponse {
  configHash: string;
  startTime: BigNumber;
  endTime: BigNumber;
  parentAddress: string;
  seasonId: BigNumber;
}

const DUMMY = {
  configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
  startTime: BigNumber.from('1661435558381'),
  endTime: BigNumber.from('1661435658381'),
  parentAddress: '0x7B8a51dB1E02bCDA0d16a9a48D80C5E544814ca9',
  seasonId: BigNumber.from('1'),
} as RoundResponse;

export const PortalHomeView: React.FC<{}> = () => {
  const { config, lobbyAddress, error } = useConfigFromHash(DUMMY.configHash);
  if (error) {
    return (
      <Container>
        <Content>Couldn't load map.</Content>
        <span>{error}</span>
      </Container>
    );
  }

  if (!config) {
    return (
      <Container>
        <Content>
          <LoadingSpinner />
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <MapOverview round={DUMMY} config={config} lobbyAddress={lobbyAddress} />
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 0 3rem;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
  gap: 24px;
  margin-bottom: 24px;
`;
