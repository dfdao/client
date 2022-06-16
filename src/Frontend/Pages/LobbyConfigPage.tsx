import { INIT_ADDRESS } from '@darkforest_eth/contracts';
import initContractAbiUrl from '@darkforest_eth/contracts/abis/DFArenaInitialize.json';
import { DFArenaInitialize } from '@darkforest_eth/contracts/typechain';
import { EthConnection } from '@darkforest_eth/network';
import { ContractMethodName, EthAddress, UnconfirmedCreateLobby } from '@darkforest_eth/types';
import { Contract } from 'ethers';
import _, { initial } from 'lodash';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { ContractsAPI } from '../../Backend/GameLogic/ContractsAPI';
import { loadInitContract } from '../../Backend/Network/Blockchain';
import { LobbyAdminTools } from '../../Backend/Utils/LobbyAdminTools';
import { ConfigurationPane } from '../Panes/Lobbies/ConfigurationPane';
import { ExtrasNavPane } from '../Panes/Lobbies/ExtrasNavPane';
import { MinimapPane } from '../Panes/Lobbies/MinimapPane';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import {
  LobbyConfigAction,
  lobbyConfigInit,
  lobbyConfigReducer,
  LobbyInitializers,
} from '../Panes/Lobbies/Reducer';
import { WorldSettingsPane } from '../Panes/Lobbies/WorldSettingsPane';
import { getLobbyCreatedEvent, lobbyPlanetsToInitPlanets } from '../Utils/helpers';
import { LobbyMapSelectPage } from './LobbyMapSelectPage';
import { LobbyWorldSettingsPage } from './LobbyWorldSettingsPage';

type Status = 'creating' | 'created' | 'errored' | undefined;

export function LobbyConfigPage({
  contract,
  connection,
  ownerAddress,
  startingConfig,
  root,
}: {
  contract: ContractsAPI;
  connection: EthConnection;
  ownerAddress: EthAddress;
  startingConfig: LobbyInitializers;
  root: string;
}) {
  const [config, updateConfig] = useReducer(lobbyConfigReducer, startingConfig, lobbyConfigInit);
  const [minimapConfig, setMinimapConfig] = useState<MinimapConfig | undefined>();
  const [lobbyAdminTools, setLobbyAdminTools] = useState<LobbyAdminTools>();
  const [lobbyTx, setLobbyTx] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>(undefined);
  const [error, setError] = useState<string | undefined>();

  const createDisabled = status === 'creating' || status === 'created';
  const creating = status === 'creating' || (status === 'created' && !lobbyAdminTools?.address);
  const created = status === 'created' && lobbyAdminTools?.address;

  const history = useHistory();
  async function createLobby(config: LobbyInitializers) {
    var initializers = { ...startingConfig, ...config };
    if (initializers.ADMIN_PLANETS) {
      initializers.INIT_PLANETS = lobbyPlanetsToInitPlanets(
        initializers.ADMIN_PLANETS,
        initializers
      );
    }
    /* Don't want to submit ADMIN_PLANET as initdata because they aren't used */
    // @ts-expect-error The Operand of a delete must be optional
    delete initializers.ADMIN_PLANETS;

    const initContract = await contract.ethConnection.loadContract<DFArenaInitialize>(
      INIT_ADDRESS,
      loadInitContract
    );
    const artifactBaseURI = '';
    const initInterface = initContract.interface;
    const initAddress = INIT_ADDRESS;
    const initFunctionCall = initInterface.encodeFunctionData('init', [
      initializers.WHITELIST_ENABLED,
      artifactBaseURI,
      initializers,
    ]);
    const txIntent: UnconfirmedCreateLobby = {
      methodName: 'createLobby',
      contract: contract.contract,
      args: Promise.resolve([initAddress, initFunctionCall]),
    };

    const tx = await contract.submitTransaction(txIntent, {
      // The createLobby function costs somewhere around 12mil gas
      gasLimit: '15000000',
    });

    const lobbyReceipt = await tx.confirmedPromise;
    const { owner, lobby } = getLobbyCreatedEvent(lobbyReceipt, contract.contract);
    setLobbyTx(tx?.hash);

    if (owner === ownerAddress) {
      if (!connection) {
        throw 'error: no connection';
      }
      const lobbyAdminTools = await LobbyAdminTools.create(lobby, connection);
      setLobbyAdminTools(lobbyAdminTools);
      history.push(`${root}/extras`);
    }
  }

  const onMapChange = useMemo(() => {
    return _.debounce((config: MinimapConfig) => setMinimapConfig(config), 500);
  }, [setMinimapConfig]);

  useEffect(() => {
    onMapChange({
      worldRadius: config.WORLD_RADIUS_MIN.currentValue,
      key: config.SPACETYPE_KEY.currentValue,
      scale: config.PERLIN_LENGTH_SCALE.currentValue,
      mirrorX: config.PERLIN_MIRROR_X.currentValue,
      mirrorY: config.PERLIN_MIRROR_Y.currentValue,
      perlinThreshold1: config.PERLIN_THRESHOLD_1.currentValue,
      perlinThreshold2: config.PERLIN_THRESHOLD_2.currentValue,
      perlinThreshold3: config.PERLIN_THRESHOLD_3.currentValue,
      stagedPlanets: config.ADMIN_PLANETS.currentValue || [],
      createdPlanets: lobbyAdminTools?.planets || [],
      dot: 4,
    });
  }, [
    onMapChange,
    config.WORLD_RADIUS_MIN.currentValue,
    config.SPACETYPE_KEY.currentValue,
    config.PERLIN_LENGTH_SCALE.currentValue,
    config.PERLIN_MIRROR_X.currentValue,
    config.PERLIN_MIRROR_Y.currentValue,
    config.PERLIN_THRESHOLD_1.currentValue,
    config.PERLIN_THRESHOLD_2.currentValue,
    config.PERLIN_THRESHOLD_3.currentValue,
    config.ADMIN_PLANETS.currentValue,
    lobbyAdminTools,
  ]);

  function onUpdate(action: LobbyConfigAction) {
    updateConfig(action);
  }

  const lobbyContent: JSX.Element = <div>Temporary Lobby Content</div>;

  // let content = (
  //   <>
  //     <ConfigurationPane
  //       modalIndex={2}
  //       config={config}
  //       startingConfig={startingConfig}
  //       updateConfig={updateConfig}
  //       onCreate={createLobby}
  //       lobbyAdminTools={lobbyAdminTools}
  //       lobbyTx={lobbyTx}
  //       ownerAddress={ownerAddress}
  //       root={root}
  //     />
  //     {/* Minimap uses modalIndex=1 so it is always underneath the configuration pane */}
  //     <MinimapPane
  //       modalIndex={1}
  //       minimapConfig={minimapConfig}
  //       onUpdate={updateConfig}
  //       created={!!lobbyAdminTools}
  //     />
  //   </>
  // );

  return (
    <Switch>
      <Route path={root} exact={true}>
        <LobbyMapSelectPage
          startingConfig={startingConfig}
          updateConfig={updateConfig}
          lobbyAdminTools={lobbyAdminTools}
          createDisabled={createDisabled}
          root={root}
          setError={setError}
        />
      </Route>
      <Route path={`${root}/settings`}>
        <LobbyWorldSettingsPage
          config={config}
          onUpdate={updateConfig}
          createDisabled={createDisabled}
          root={root}
          minimapConfig={minimapConfig}
          lobbyAdminTools={lobbyAdminTools}
        />
      </Route>
      <Route path={`${root}/extras`}>
        <ExtrasNavPane
          lobbyAdminTools={lobbyAdminTools}
          config={config}
          onUpdate={updateConfig}
          lobbyContent={lobbyContent}
          root={root}
        />
      </Route>
    </Switch>
  );
}
