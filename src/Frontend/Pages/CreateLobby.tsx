import { INIT_ADDRESS } from '@darkforest_eth/contracts';
// This is loaded as URL paths by a webpack loader
import initContractAbiUrl from '@darkforest_eth/contracts/abis/DFArenaInitialize.json';
import { EthConnection } from '@darkforest_eth/network';
import { address } from '@darkforest_eth/serde';
import {
  ArtifactRarity,
  ContractMethodName,
  EthAddress,
  UnconfirmedCreateLobby
} from '@darkforest_eth/types';
import { Contract } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContractsAPI, makeContractsAPI } from '../../Backend/GameLogic/ContractsAPI';
import { PlanetCreator } from '../../Backend/Utils/PlanetCreator';
import { ContractsAPIEvent } from '../../_types/darkforest/api/ContractsAPITypes';
import { InitRenderState, Wrapper } from '../Components/GameLandingPageComponents';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import { LobbyInitializers } from '../Panes/Lobbies/Reducer';
import { listenForKeyboardEvents, unlinkKeyboardEvents } from '../Utils/KeyEmitters';
import { CadetWormhole } from '../Views/CadetWormhole';
import { LobbyConfigPage } from './LobbyConfigPage';
import { LobbyLandingPage } from './LobbyLandingPage';

type ErrorState =
  | { type: 'invalidAddress' }
  | { type: 'contractLoad' }
  | { type: 'invalidContract' }
  | { type: 'invalidCreate' };

export function CreateLobby({ match }: RouteComponentProps<{ contract: string }>) {
  const [connection, setConnection] = useState<EthConnection | undefined>();
  const [ownerAddress, setOwnerAddress] = useState<EthAddress | undefined>();
  const [contract, setContract] = useState<ContractsAPI | undefined>();
  const [startingConfig, setStartingConfig] = useState<LobbyInitializers | undefined>();
  const [lobbyAddress, setLobbyAddress] = useState<EthAddress | undefined>();
  const [minimapConfig, setMinimapConfig] = useState<MinimapConfig | undefined>();
  const [planetCreator, setPlanetCreator] = useState<PlanetCreator>();

  let contractAddress: EthAddress | undefined;
  try {
    contractAddress = address(match.params.contract);
  } catch (err) {
    console.error('Invalid address', err);
  }

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
    if (connection && contractAddress) {
      makeContractsAPI({ connection, contractAddress })
        .then((contract) => setContract(contract))
        .catch((e) => {
          console.log(e);
          setErrorState({ type: 'contractLoad' });
        });
    }
  }, [connection, contractAddress]);

  useEffect(() => {
    if (contract) {
      contract
        .getConstants()
        .then((config) => {
          setStartingConfig({
            ...config,
            WHITELIST_ENABLED: false,
            START_PAUSED: true,
            CLAIM_PLANET_COOLDOWN: 0,
            ADMIN_PLANETS: [],
            TOKEN_MINT_END_TIMESTAMP: Date.now() + 21600000, // six hours from now
            ARTIFACT_POINT_VALUES: [
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Unknown],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Common],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Rare],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Epic],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Legendary],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Mythic],
            ],
          });
        })
        .catch((e) => {
          console.log(e);
          setErrorState({ type: 'invalidContract' });
        });
    }
  }, [contract]);

  async function createLobby(config: LobbyInitializers) {
    if (!contract) {
      setErrorState({ type: 'invalidCreate' });
      return;
    }

    const initializers = { ...startingConfig, ...config };
    const InitABI = await fetch(initContractAbiUrl).then((r) => r.json());
    const artifactBaseURI = '';
    const initInterface = Contract.getInterface(InitABI);
    const initAddress = INIT_ADDRESS;
    const initFunctionCall = initInterface.encodeFunctionData('init', [
      initializers.WHITELIST_ENABLED,
      artifactBaseURI,
      initializers,
    ]);
    const txIntent: UnconfirmedCreateLobby = {
      methodName: ContractMethodName.CREATE_LOBBY,
      contract: contract.contract,
      args: Promise.resolve([initAddress, initFunctionCall]),
    };

    contract.once(ContractsAPIEvent.LobbyCreated, async (owner: EthAddress, lobby: EthAddress) => {
      if (owner === ownerAddress) {
        setLobbyAddress(lobby);
        if (!connection) {
          throw 'error: no connection';
        }
        const planetCreator = await PlanetCreator.create(lobby, connection);
        setPlanetCreator(planetCreator);
      }
    });

    const tx = await contract.submitTransaction(txIntent, {
      // The createLobby function costs somewhere around 12mil gas
      gasLimit: '16777215',
    });
    await tx.confirmedPromise;
  }

  if (errorState) {
    switch (errorState.type) {
      case 'contractLoad':
        return <CadetWormhole imgUrl='/public/img/wrong-text.png' />;
      case 'invalidAddress':
      case 'invalidContract':
        return <CadetWormhole imgUrl='/public/img/no-contract-text.png' />;
      case 'invalidCreate':
        return <CadetWormhole imgUrl='/public/img/wrong-text.png' />;
      default:
        // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
        const _exhaustive: never = errorState;
        return _exhaustive;
    }
  }

  const content = startingConfig ? (
    <LobbyConfigPage
      startingConfig={startingConfig}
      onCreate={createLobby}
      lobbyAddress={lobbyAddress}
      planetCreator={planetCreator}
    />
  ) : (
    <LobbyLandingPage onReady={onReady} />
  );

  return (
    <Wrapper initRender={InitRenderState.NONE} terminalEnabled={false}>
      {content}
    </Wrapper>
  );
}
