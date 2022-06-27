import { INIT_ADDRESS } from '@darkforest_eth/contracts';
import initContractAbiUrl from '@darkforest_eth/contracts/abis/DFArenaInitialize.json';
import { DFArenaInitialize } from '@darkforest_eth/contracts/typechain';
import { EthConnection } from '@darkforest_eth/network';
import { ContractMethodName, EthAddress, UnconfirmedCreateLobby } from '@darkforest_eth/types';
import { Contract } from 'ethers';
import _, { initial } from 'lodash';
import React, { useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { ContractsAPI } from '../../Backend/GameLogic/ContractsAPI';
import { loadInitContract } from '../../Backend/Network/Blockchain';
import { LobbyAdminTools } from '../../Backend/Utils/LobbyAdminTools';
import { ConfigurationPane } from '../Panes/Lobbies/ConfigurationPane';
import { ExtrasNavPane } from '../Panes/Lobbies/ExtrasNavPane';
import { MinimapPane } from '../Panes/Lobbies/MinimapPane';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import {
  InvalidConfigError,
  LobbyConfigAction,
  lobbyConfigInit,
  lobbyConfigReducer,
  LobbyInitializers,
  toInitializers,
} from '../Panes/Lobbies/Reducer';
import { getLobbyCreatedEvent, lobbyPlanetsToInitPlanets } from '../Utils/helpers';
import { LobbyMapSelectPage } from './LobbyMapSelectPage';
import { LobbyWorldSettingsPage } from './LobbyWorldSettingsPage';
import { LobbyConfirmPage } from './LobbyConfirmPage';
import { LobbyMapEditor } from './LobbyMapEditor';
import { getAllTwitters } from '../../Backend/Network/UtilityServerAPI';
import { LobbyPlanet } from '../Panes/Lobbies/LobbiesUtils';
import { createContext } from 'preact';
import { Toast } from '../Components/Toast';

type Status = 'waitingForCreate' | 'creating' | 'created' | 'errored' | undefined;

const DEFAULT_PLANET: LobbyPlanet = {
  x: 0,
  y: 0,
  level: 0,
  planetType: 0,
  isTargetPlanet: false,
  isSpawnPlanet: false,
};

const BULK_CREATE_CHUNK_SIZE = 5;

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
  const [error, setError] = useState<string | undefined>(undefined);
  const [playerTwitter, setPlayerTwitter] = useState<string | undefined>();

  const createDisabled = status === 'creating' || status === 'created';
  const creating = status === 'creating' || (status === 'created' && !lobbyAdminTools?.address);
  const created = status === 'created' && lobbyAdminTools?.address;

  useEffect(() => {
    async function doCreateReveal() {
      await bulkCreateAndRevealPlanets();
    }
    if (lobbyAdminTools && !created) {
      doCreateReveal();
      setStatus('created');
    }
  }, [lobbyAdminTools]);

  useEffect(() => {
    async function fetchTwitters() {
      const allTwitters = await getAllTwitters();
      setPlayerTwitter(allTwitters[ownerAddress]);
    }
    fetchTwitters();
  }, []);

  useEffect(() => {
    if (config.ADMIN_PLANETS.warning) {
      setError(config.ADMIN_PLANETS.warning);
    }
  }, [config.ADMIN_PLANETS.warning]);

  async function bulkCreateAndRevealPlanets() {
    if (!lobbyAdminTools) {
      setError("You haven't created a lobby.");
      throw new Error('No lobby');
    }
    if (!config.ADMIN_PLANETS.currentValue) {
      setError('no planets staged');
      throw new Error('No planets staged');
    }
    let planets = config.ADMIN_PLANETS.currentValue;

    let i = 0;
    while (i < planets.length) {
      try {
        const chunk = planets.slice(i, i + BULK_CREATE_CHUNK_SIZE);
        await lobbyAdminTools.bulkCreateAndReveal(chunk, toInitializers(config));
        updateConfig({
          type: 'ADMIN_PLANETS',
          value: DEFAULT_PLANET,
          index: i,
          number: BULK_CREATE_CHUNK_SIZE,
        });
        planets.splice(i, BULK_CREATE_CHUNK_SIZE);
      } catch (err) {
        i += BULK_CREATE_CHUNK_SIZE;
        console.log('ERROR', err);
        if (err instanceof InvalidConfigError) {
          setError(`Invalid ${err.key} value ${err.value ?? ''} - ${err.message}`);
        } else {
          setError(err?.message || 'Something went wrong. Check your dev console.');
        }
      }
    }
    setStatus('created');
  }

  async function validateAndCreateLobby() {
    try {
      setStatus('creating');
      const initializers = toInitializers(config);
      await createLobby(initializers);
    } catch (err) {
      setStatus('errored');
      console.error(err);
      if (err instanceof InvalidConfigError) {
        setError(`Invalid ${err.key} value ${err.value ?? ''} - ${err.message}`);
      } else {
        setError(err?.message || 'Something went wrong. Check your dev console.');
      }
    }
  }

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

  return (
    <>
      <Toast
        open={!!error}
        title='Error'
        description={error}
        onClose={() => {
          setError(undefined);
          // if (config.ADMIN_PLANETS.warning) {
          //   // remove warning
          // }
        }}
      />
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
        <Route path={`${root}/confirm`}>
          <LobbyConfirmPage
            updateConfig={updateConfig}
            lobbyAdminTools={lobbyAdminTools}
            minimapConfig={minimapConfig}
            config={config}
            onUpdate={updateConfig}
            createDisabled={createDisabled}
            root={root}
            createLobby={createLobby}
            ownerAddress={ownerAddress}
            lobbyTx={lobbyTx}
            onError={setError}
            created={created}
            creating={creating}
            playerTwitter={playerTwitter}
            validateAndCreateLobby={validateAndCreateLobby}
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
        <Route path={`${root}/edit-map`}>
          <LobbyMapEditor
            config={config}
            updateConfig={updateConfig}
            createDisabled={createDisabled}
            root={root}
            minimapConfig={minimapConfig}
            lobbyAdminTools={lobbyAdminTools}
            onError={setError}
            ownerAddress={ownerAddress}
          />
        </Route>
      </Switch>
    </>
  );
}
