import { EthConnection } from '@darkforest_eth/network';
import { EthAddress } from '@darkforest_eth/types';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllTwitters } from '../../Backend/Network/UtilityServerAPI';
import { AddressTwitterMap } from '../../_types/darkforest/api/UtilityServerAPITypes';
import { InitRenderState, Wrapper } from '../Components/GameLandingPageComponents';
import { HideSmall } from '../Components/Text';
import { TwitterProvider } from '../Utils/AppHooks';
import { PortalMainView } from '../Views/Portal/PortalMainView';
import { PortalSidebarView } from '../Views/Portal/PortalSidebarView';
import { PrettyOverlayGradient } from './LandingPage';
import LoadingPage from './LoadingPage';
import { PortalLandingPage } from './PortalLandingPage';

export function PortalPage() {
  const [connection, setConnection] = useState<EthConnection | undefined>();
  const [ownerAddress, setOwnerAddress] = useState<EthAddress | undefined>();

  const onReady = useCallback(
    (connection: EthConnection) => {
      setConnection(connection);
      setOwnerAddress(connection.getAddress());
    },
    [setConnection]
  );

  if (connection && ownerAddress) {
    return <Portal playerAddress={ownerAddress} />;
  } 
  return (
    <Wrapper initRender={InitRenderState.NONE} terminalEnabled={false}>
      <PortalLandingPage onReady={onReady} />
    </Wrapper>
  );
}

function Portal({ playerAddress }: { playerAddress: EthAddress }) {
  const [twitters, setTwitters] = useState<AddressTwitterMap | undefined>()

  useEffect(() => {
    getAllTwitters().then((t) => setTwitters(t));
  }, []);
  return (
    
    <>
    {twitters ? (
      <TwitterProvider value={twitters}>

      <PrettyOverlayGradient />
      <PortalContainer>
        <HideSmall>
          <PortalSidebarView playerAddress={playerAddress} />
        </HideSmall>
        <PortalMainView/>
      </PortalContainer>
      </TwitterProvider>
     ) : <LoadingPage/>}
    </>
  );
}

const PortalContainer = styled.div`
  vertical-align: baseline;
  display: grid;
  margin: 0 auto;
  grid-template-columns: 245px 800px;
  min-height: 100vh;
  justify-content: center;

`;
