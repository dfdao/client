import { EthAddress, ModalName } from '@darkforest_eth/types';
import React, { useState } from 'react';
import { useHistory } from "react-router";
import styled from 'styled-components';
import dfstyles, { PortalButton } from '../../Styles/dfstyles';
import {Text} from '../../Components/Text'
import { AccountView } from './AccountView';
import { Btn } from '../../Components/Btn';


export function PortalSidebarView({
    address
}: {
  address: EthAddress
}) {
  const history = useHistory();

  return (
    <SidebarContainer>
      <Text style = {{fontSize : '1.5em'}}>Dark Forest Arena</Text>
      <AccountView address = {address}/>
      <a style = {{width: '100%'}} href = 'https://arena.dfdao.xyz/arena' target = 'blank'><Btn variant = 'portal' size = 'stretch'>Design an Arena</Btn></a>
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 16px 12px;
  box-sizing: border-box;
  z-index: 10;
  overflow-y: auto;
  width: 246px;
  gap: 15px;
`;
