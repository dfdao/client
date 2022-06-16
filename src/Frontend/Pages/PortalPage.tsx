import { EthConnection } from '@darkforest_eth/network';
import { EthAddress } from '@darkforest_eth/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { InitRenderState, Wrapper } from '../Components/GameLandingPageComponents';
import { HideSmall } from '../Components/Text';
import { PortalMainView } from '../Views/Portal/PortalMainView';
import { PortalSidebarView } from '../Views/Portal/PortalSidebarView';
import { PrettyOverlayGradient } from './LandingPage';
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

   
    if(connection && ownerAddress) {
      return <Portal address={ownerAddress} />
    } 
    return (
      <Wrapper initRender={InitRenderState.NONE} terminalEnabled={false}>
        <PortalLandingPage onReady={onReady} />
      </Wrapper>
    )
}

function Portal({ address }: { address: EthAddress }) {
  const history = useHistory();

  return (
    <>
      <PrettyOverlayGradient />
      <PortalContainer>
        <HideSmall>
          <PortalSidebarView address={address} />
        </HideSmall>
        <PortalMainView address={address} />
      </PortalContainer>
    </>
  );
}

const PortalContainer = styled.div`
  vertical-align: baseline;
  display: grid;
  margin: 0 auto;
  grid-template-columns: 350px minmax(500px,100%) 0;
  min-height: 100vh;

`;
