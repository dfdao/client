import { CONTRACT_ADDRESS } from '@darkforest_eth/contracts';
import { EthConnection } from '@darkforest_eth/network';
import { address } from '@darkforest_eth/serde';
import { ArtifactRarity, EthAddress } from '@darkforest_eth/types';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContractsAPI, makeContractsAPI } from '../../Backend/GameLogic/ContractsAPI';
import { Account, getActive } from '../../Backend/Network/AccountManager';
import { getEthConnection } from '../../Backend/Network/Blockchain';
import { loadConfigFromAddress } from '../../Backend/Network/ConfigApi';
import { InitRenderState, Wrapper } from '../Components/GameLandingPageComponents';
import { LobbyInitializers } from '../Panes/Lobbies/Reducer';
import { listenForKeyboardEvents, unlinkKeyboardEvents } from '../Utils/KeyEmitters';
import { stockConfig } from '../Utils/StockConfigs';
import { CadetWormhole } from '../Views/CadetWormhole';
import LoadingPage from './LoadingPage';
import { LobbyConfigPage } from './LobbyConfigPage';
import { PortalLandingPage } from './PortalLandingPage';

type ErrorState =
  | { type: 'invalidAddress' }
  | { type: 'contractLoad' }
  | { type: 'invalidContract' };

export function CreateLobby({ match }: RouteComponentProps<{ contract: string }>) {
  const [connection, setConnection] = useState<EthConnection | undefined>();
  const [account, setAccount] = useState<Account | undefined>(getActive());
  const [contract, setContract] = useState<ContractsAPI | undefined>();
  const [startingConfig, setStartingConfig] = useState<LobbyInitializers | undefined>();
  const contractAddress: EthAddress = address(CONTRACT_ADDRESS);
  const configContractAddress = address(match.params.contract) || contractAddress;

  const [errorState, setErrorState] = useState<ErrorState | undefined>(
    contractAddress ? undefined : { type: 'invalidAddress' }
  );

  useEffect(() => {
    async function getConnection() {
      try {
        const connection = await getEthConnection();
        setConnection(connection);
      } catch (e) {
        alert('error connecting to blockchain');
        console.log(e);
      }
    }

    getConnection();
    listenForKeyboardEvents();

    return () => unlinkKeyboardEvents();
  }, []);

  const onReady = useCallback(
    (connect: EthConnection) => {
      const address = connect.getAddress();
      const privateKey = connect.getPrivateKey();
      if (!address || !privateKey) throw new Error('account not found');
      setAccount({ address, privateKey });
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

  let content = <LoadingPage />;

  if (connection && startingConfig && contract) {
    content =
      account ? (
        <LobbyConfigPage
          contractsAPI={contract}
          connection={connection}
          ownerAddress={account.address}
          startingConfig={startingConfig}
          root={`/arena/${configContractAddress}`}
        />
      ) : (
        <PortalLandingPage onReady={onReady} connection={connection} />
      );
  }

  return (
    <Wrapper initRender={InitRenderState.NONE} terminalEnabled={false}>
      {content}
    </Wrapper>
  );
}
