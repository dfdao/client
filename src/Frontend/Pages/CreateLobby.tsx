import { CONTRACT_ADDRESS } from '@darkforest_eth/contracts';
import { EthConnection } from '@darkforest_eth/network';
import { address } from '@darkforest_eth/serde';
import { ArtifactRarity, EthAddress } from '@darkforest_eth/types';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContractsAPI, makeContractsAPI } from '../../Backend/GameLogic/ContractsAPI';
import { loadConfigFromAddress } from '../../Backend/Network/ConfigApi';
import { InitRenderState, Wrapper } from '../Components/GameLandingPageComponents';
import { LobbyInitializers } from '../Panes/Lobbies/Reducer';
import { listenForKeyboardEvents, unlinkKeyboardEvents } from '../Utils/KeyEmitters';
import { stockConfig } from '../Utils/StockConfigs';
import { CadetWormhole } from '../Views/CadetWormhole';
import { LobbyConfigPage } from './LobbyConfigPage';
import { PortalLandingPage } from './PortalLandingPage';

type ErrorState =
  | { type: 'invalidAddress' }
  | { type: 'contractLoad' }
  | { type: 'invalidContract' };

export function CreateLobby({ match }: RouteComponentProps<{ contract: string }>) {
  const [connection, setConnection] = useState<EthConnection | undefined>();
  const [ownerAddress, setOwnerAddress] = useState<EthAddress | undefined>();
  const [contract, setContract] = useState<ContractsAPI | undefined>();
  const [startingConfig, setStartingConfig] = useState<LobbyInitializers | undefined>();
  const contractAddress: EthAddress = address(CONTRACT_ADDRESS);
  const configContractAddress = address(match.params.contract) || contractAddress;

  const [errorState, setErrorState] = useState<ErrorState | undefined>(
    contractAddress ? undefined : { type: 'invalidAddress' }
  );

  useEffect(() => {
    listenForKeyboardEvents();

    return () => unlinkKeyboardEvents();
  }, []);

  const onReady = useCallback(
    (connection: EthConnection) => {
      setConnection(connection);
      setOwnerAddress(connection.getAddress());
    },
    [setConnection]
  );

  useEffect(() => {
    if (connection) {
      if (contractAddress) {
        makeContractsAPI({ connection, contractAddress })
          .then((contract) => setContract(contract))
          .catch((e) => {
            console.log(e);
            setErrorState({ type: 'contractLoad' });
          });
      }
      if (configContractAddress) {
        loadConfigFromAddress(configContractAddress)
          .then((config) => {
            if (!config) {
              setStartingConfig(stockConfig.vanilla);
            } else {
              setStartingConfig(config.config);
            }
            return;

          })
          .catch((e) => {
            console.log(e);
            setErrorState({ type: 'contractLoad' });
          });
      }
    }
  }, [connection, contractAddress]);

  if (errorState) {
    switch (errorState.type) {
      case 'contractLoad':
        return <CadetWormhole imgUrl='/public/img/wrong-text.png' />;
      case 'invalidAddress':
      case 'invalidContract':
        return <CadetWormhole imgUrl='/public/img/no-contract-text.png' />;
      default:
        // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustive: never = errorState;
        return _exhaustive;
    }
  }

  const content =
    contract && connection && ownerAddress && startingConfig ? (
      <LobbyConfigPage
        contractsAPI={contract}
        connection={connection}
        ownerAddress={ownerAddress}
        startingConfig={startingConfig}
        root={`/arena/${configContractAddress}`}
      />
    ) : (
      <PortalLandingPage onReady={onReady} />
    );

  return (
    <Wrapper initRender={InitRenderState.NONE} terminalEnabled={false}>
      {content}
    </Wrapper>
  );
}
