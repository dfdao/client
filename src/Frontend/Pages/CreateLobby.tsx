import { INIT_ADDRESS } from '@darkforest_eth/contracts';
// This is loaded as URL paths by a webpack loader
import { fakeHash, mimcHash, modPBigInt, perlin } from '@darkforest_eth/hashing';
// import * as snarkjs from 'snarkjs';
import revealCircuitPath from '@darkforest_eth/snarks/reveal.wasm';
import revealZkeyPath from '@darkforest_eth/snarks/reveal.zkey';

import {
  buildContractCallArgs,
  fakeProof,
  RevealSnarkContractCallArgs,
  RevealSnarkInput,
  SnarkJSProofAndSignals,
} from '@darkforest_eth/snarks';

import arenaInitContractAbiUrl from '@darkforest_eth/contracts/abis/DFArenaInitialize.json';

import { EthConnection } from '@darkforest_eth/network';
import { address } from '@darkforest_eth/serde';
import {
  ArtifactRarity,
  ContractMethodName,
  EthAddress,
  LocationId,
  UnconfirmedCreateLobby,
  UnconfirmedCreateArenaPlanet,
  UnconfirmedReveal,
  WorldCoords,
  WorldLocation,
  AdminPlanet,
} from '@darkforest_eth/types';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ContractsAPI, makeContractsAPI } from '../../Backend/GameLogic/ContractsAPI';
import { ContractsAPIEvent } from '../../_types/darkforest/api/ContractsAPITypes';
import { InitRenderState, Wrapper } from '../Components/GameLandingPageComponents';
import { ConfigurationPane } from '../Panes/Lobbies/ConfigurationPane';
import { Minimap } from '../Panes/Lobbies/MinimapPane';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import { LobbyInitializers } from '../Panes/Lobbies/Reducer';
import { listenForKeyboardEvents, unlinkKeyboardEvents } from '../Utils/KeyEmitters';
import { CadetWormhole } from '../Views/CadetWormhole';
import { LobbyLandingPage } from './LobbyLandingPage';
import GameUIManager from '../../Backend/GameLogic/GameUIManager';

type ErrorState =
  | { type: 'invalidAddress' }
  | { type: 'contractLoad' }
  | { type: 'invalidContract' }
  | { type: 'invalidCreate' };

type CreatePlanetData = {
  location: string;
  planetCoords: {
    x: number;
    y: number;
  };
  perlinValue: number;
  biomeBase: number;
};

function detectPopupBlocker() {
  var test = window.open(undefined, '', 'width=1,height=1');
  if (!test) throw 'unable to detect popup blocker';
  try {
    test.close();
    // alert('Pop-ups not blocked.');
  } catch (e) {
    alert('Pop-ups blocked.');
  }
}

export function CreateLobby({ match }: RouteComponentProps<{ contract: string }>) {
  const [connection, setConnection] = useState<EthConnection | undefined>();
  const [ownerAddress, setOwnerAddress] = useState<EthAddress | undefined>();
  const [contract, setContract] = useState<ContractsAPI | undefined>();
  const [startingConfig, setStartingConfig] = useState<LobbyInitializers | undefined>();
  const [lobbyAddress, setLobbyAddress] = useState<EthAddress | undefined>();
  const [status, setStatus] = useState<string>();
  const [minimapConfig, setMinimapConfig] = useState<MinimapConfig | undefined>();
  const [errorPlanets, setErrorPlanets] = useState<AdminPlanet[]>();

  const onMapChange = useMemo(() => {
    return _.debounce((config: MinimapConfig) => setMinimapConfig(config), 500);
  }, [setMinimapConfig]);

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
            // Explicitly defaulting this to false
            WHITELIST_ENABLED: false,
            // TODO: Figure out if we should expose this from contract
            START_PAUSED: false,
            ADMIN_CAN_ADD_PLANETS: config.ADMIN_CAN_ADD_PLANETS,
            WORLD_RADIUS_LOCKED: config.WORLD_RADIUS_LOCKED,
            WORLD_RADIUS_MIN: config.WORLD_RADIUS_MIN,
            DISABLE_ZK_CHECKS: config.DISABLE_ZK_CHECKS,
            PLANETHASH_KEY: config.PLANETHASH_KEY,
            SPACETYPE_KEY: config.SPACETYPE_KEY,
            BIOMEBASE_KEY: config.BIOMEBASE_KEY,
            PERLIN_MIRROR_X: config.PERLIN_MIRROR_X,
            PERLIN_MIRROR_Y: config.PERLIN_MIRROR_Y,
            PERLIN_LENGTH_SCALE: config.PERLIN_LENGTH_SCALE,
            MAX_NATURAL_PLANET_LEVEL: config.MAX_NATURAL_PLANET_LEVEL,
            TIME_FACTOR_HUNDREDTHS: config.TIME_FACTOR_HUNDREDTHS,
            PERLIN_THRESHOLD_1: config.PERLIN_THRESHOLD_1,
            PERLIN_THRESHOLD_2: config.PERLIN_THRESHOLD_2,
            PERLIN_THRESHOLD_3: config.PERLIN_THRESHOLD_3,
            INIT_PERLIN_MIN: config.INIT_PERLIN_MIN,
            INIT_PERLIN_MAX: config.INIT_PERLIN_MAX,
            SPAWN_RIM_AREA: config.SPAWN_RIM_AREA,
            BIOME_THRESHOLD_1: config.BIOME_THRESHOLD_1,
            BIOME_THRESHOLD_2: config.BIOME_THRESHOLD_2,
            PLANET_LEVEL_THRESHOLDS: config.PLANET_LEVEL_THRESHOLDS,
            PLANET_RARITY: config.PLANET_RARITY,
            LOCATION_REVEAL_COOLDOWN: config.LOCATION_REVEAL_COOLDOWN,
            // TODO: Implement when we add this scoring contract back
            CLAIM_PLANET_COOLDOWN: 0,
            // TODO: Need to think through this implementation a bit more, even if only toggling planet types
            PLANET_TYPE_WEIGHTS: config.PLANET_TYPE_WEIGHTS,
            // TODO: Rename in one of the places
            // TODO: Implement... Needs a datetime input component (WIP)
            TOKEN_MINT_END_TIMESTAMP: 1948939200, // new Date("2031-10-05T04:00:00.000Z").getTime() / 1000,
            PHOTOID_ACTIVATION_DELAY: config.PHOTOID_ACTIVATION_DELAY,
            SILVER_SCORE_VALUE: config.SILVER_SCORE_VALUE,
            ARTIFACT_POINT_VALUES: [
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Unknown],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Common],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Rare],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Epic],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Legendary],
              config.ARTIFACT_POINT_VALUES[ArtifactRarity.Mythic],
            ],
            PLANET_TRANSFER_ENABLED: config.PLANET_TRANSFER_ENABLED,
            SPACE_JUNK_ENABLED: config.SPACE_JUNK_ENABLED,
            SPACE_JUNK_LIMIT: config.SPACE_JUNK_LIMIT,
            PLANET_LEVEL_JUNK: config.PLANET_LEVEL_JUNK,
            ABANDON_SPEED_CHANGE_PERCENT: config.ABANDON_SPEED_CHANGE_PERCENT,
            ABANDON_RANGE_CHANGE_PERCENT: config.ABANDON_RANGE_CHANGE_PERCENT,
            CAPTURE_ZONES_ENABLED: config.CAPTURE_ZONES_ENABLED,
            CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: config.CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL,
            CAPTURE_ZONE_COUNT: config.CAPTURE_ZONE_COUNT,
            CAPTURE_ZONE_PLANET_LEVEL_SCORE: config.CAPTURE_ZONE_PLANET_LEVEL_SCORE,
            CAPTURE_ZONE_RADIUS: config.CAPTURE_ZONE_RADIUS,
            CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: config.CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED,
            CAPTURE_ZONES_PER_5000_WORLD_RADIUS: config.CAPTURE_ZONES_PER_5000_WORLD_RADIUS,
            TARGET_PLANETS: config.TARGET_PLANETS,
            TARGET_PLANET_HOLD_BLOCKS_REQUIRED: config.TARGET_PLANET_HOLD_BLOCKS_REQUIRED,
            MANUAL_SPAWN: config.MANUAL_SPAWN,
            ADMIN_PLANETS: [],
          });
        })
        .catch((e) => {
          console.log(e);
          setErrorState({ type: 'invalidContract' });
        });
    }
  }, [contract]);

  async function createAndRevealPlanets(initializers: LobbyInitializers) {
    detectPopupBlocker();
    // const contract = await hre.ethers.getContractAt('DarkForest', hre.contracts.CONTRACT_ADDRESS);
    if (!lobbyAddress) return;
    console.log('creating and revealing planets');
    if (!connection) return;
    const lobbyContract = await makeContractsAPI({ connection, contractAddress: lobbyAddress });
    console.log(lobbyContract);
    if (!lobbyContract) {
      setErrorState({ type: 'invalidCreate' });
      return;
    }

    const planets = initializers.ADMIN_PLANETS;
    if (!planets) return;

    for (const planet of planets) {
      try {
        const createPlanetData = generatePlanetData(planet, initializers);

        await createPlanet(planet, createPlanetData, lobbyContract);
        if (planet.revealLocation) {
          await revealPlanet(planet, initializers, createPlanetData, lobbyContract);
        }
        console.log(`created admin planet at (${planet.x}, ${planet.y})`);
      } catch (e) {
        console.log(`error creating planet at (${planet.x}, ${planet.y}):`);
        alert(`error creating planet at (${planet.x}, ${planet.y}): ${e}.`);
      }
    }
  }

  function generatePlanetData(planet: AdminPlanet, initializers: LobbyInitializers) {
    const location = initializers.DISABLE_ZK_CHECKS
      ? fakeHash(initializers.PLANET_RARITY)(planet.x, planet.y).toString()
      : mimcHash(initializers.PLANETHASH_KEY)(planet.x, planet.y).toString();

    const planetCoords = {
      x: planet.x,
      y: planet.y,
    };

    const perlinValue = perlin(planetCoords, {
      key: initializers.SPACETYPE_KEY,
      scale: initializers.PERLIN_LENGTH_SCALE,
      mirrorX: initializers.PERLIN_MIRROR_X,
      mirrorY: initializers.PERLIN_MIRROR_Y,
      floor: true,
    });

    const biomeBase = perlin(planetCoords, {
      key: initializers.BIOMEBASE_KEY,
      scale: initializers.PERLIN_LENGTH_SCALE,
      mirrorX: initializers.PERLIN_MIRROR_X,
      mirrorY: initializers.PERLIN_MIRROR_Y,
      floor: true,
    });

    return {
      location: location,
      planetCoords: planetCoords,
      perlinValue: perlinValue,
      biomeBase: biomeBase,
    };
  }

  async function createPlanet(
    planet: AdminPlanet,
    createPlanetData: CreatePlanetData,
    lobbyContract: ContractsAPI
  ) {
    setStatus(`Creating planet at (${planet.x}, ${planet.y})...`);

    try {
      const locNum = createPlanetData.location as BigNumberish;

      const args = Promise.resolve([
        {
          location: locNum,
          perlin: createPlanetData.perlinValue,
          level: planet.level,
          planetType: planet.planetType,
          requireValidLocationId: planet.requireValidLocationId,
          isTargetPlanet: planet.isTargetPlanet,
          isSpawnPlanet: planet.isSpawnPlanet,
        },
      ]);

      const txIntent: UnconfirmedCreateArenaPlanet = {
        methodName: ContractMethodName.CREATE_ARENA_PLANET,
        contract: lobbyContract.contract,
        args: args,
      };

      const tx = await lobbyContract.submitTransaction(txIntent, {
        // The createLobby function costs somewhere around 12mil gas
        gasLimit: '16777215',
      });

      await tx.confirmedPromise;
    } catch (e) {}
  }

  async function revealPlanet(
    planet: AdminPlanet,
    initializers: LobbyInitializers,
    createPlanetData: CreatePlanetData,
    lobbyContract: ContractsAPI
  ) {
    setStatus(`Revealing planet at (${planet.x}, ${planet.y})...`);

    console.log(`revealing planet`);

    let proofArgs = [
      planet.x,
      planet.y,
      initializers.PLANETHASH_KEY,
      initializers.SPACETYPE_KEY,
      initializers.PERLIN_LENGTH_SCALE,
      initializers.PERLIN_MIRROR_X,
      initializers.PERLIN_MIRROR_Y,
      initializers.DISABLE_ZK_CHECKS,
      initializers.PLANET_RARITY,
    ];
    console.log(`proofArgs: ${proofArgs}`);

    const getArgs = async () => {
      const revealArgs = await makeRevealProof(
        planet.x,
        planet.y,
        initializers.PLANETHASH_KEY,
        initializers.SPACETYPE_KEY,
        initializers.PERLIN_LENGTH_SCALE,
        initializers.PERLIN_MIRROR_X,
        initializers.PERLIN_MIRROR_Y,
        initializers.DISABLE_ZK_CHECKS,
        initializers.PLANET_RARITY
      );
      return revealArgs;
    };

    const worldLocation = {
      coords: createPlanetData.planetCoords as WorldCoords,
      hash: location.toString() as LocationId,
      perlin: createPlanetData.perlinValue,
      biomebase: createPlanetData.biomeBase,
    } as WorldLocation;

    const txIntent: UnconfirmedReveal = {
      methodName: ContractMethodName.REVEAL_LOCATION,
      contract: lobbyContract.contract,
      locationId: location.toString() as LocationId,
      location: worldLocation,
      args: getArgs(),
    };

    // Always await the submitTransaction so we can catch rejections
    const tx = await lobbyContract.submitTransaction(txIntent);
    console.log(`reveal tx submitted`);

    await tx.confirmedPromise;
    console.log(`reveal tx accepted`);
  }

  async function createLobby(config: LobbyInitializers) {
    if (!contract) {
      setErrorState({ type: 'invalidCreate' });
      return;
    }
    setStatus('Creating Lobby...');
    const initializers = { ...startingConfig, ...config };

    console.log(initializers);
    const InitABI = await fetch(arenaInitContractAbiUrl).then((r) => r.json());
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
        // await createAndRevealPlanets(initializers, lobby as EthAddress);
        setStatus('Lobby Created...');
        setLobbyAddress(lobby);
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
  let content;
  if (startingConfig) {
    content = (
      <>
        <ConfigurationPane
          modalIndex={2}
          lobbyAddress={lobbyAddress}
          progress={status || ''}
          startingConfig={startingConfig}
          onMapChange={onMapChange}
          onCreate={createLobby}
          createPlanets={createAndRevealPlanets}
        />
        {/* Minimap uses modalIndex=1 so it is always underneath the configuration pane */}
        <Minimap modalIndex={1} config={minimapConfig} />
      </>
    );
  } else {
    content = <LobbyLandingPage onReady={onReady} />;
  }

  return (
    <Wrapper initRender={InitRenderState.NONE} terminalEnabled={false}>
      {content}
    </Wrapper>
  );
}

async function makeRevealProof(
  x: number,
  y: number,
  planetHashKey: number,
  spaceTypeKey: number,
  scale: number,
  mirrorX: boolean,
  mirrorY: boolean,
  zkChecksDisabled: boolean,
  planetRarity: number
): Promise<RevealSnarkContractCallArgs> {
  if (zkChecksDisabled) {
    const location = fakeHash(planetRarity)(x, y).toString();
    const perlinValue = perlin(
      { x, y },
      {
        key: spaceTypeKey,
        scale,
        mirrorX,
        mirrorY,
        floor: true,
      }
    );
    const { proof, publicSignals } = fakeProof([
      location,
      perlinValue.toString(),
      modPBigInt(x).toString(),
      modPBigInt(y).toString(),
      planetHashKey.toString(),
      spaceTypeKey.toString(),
      scale.toString(),
      mirrorX ? '1' : '0',
      mirrorY ? '1' : '0',
    ]);
    return buildContractCallArgs(proof, publicSignals) as RevealSnarkContractCallArgs;
  } else {
    const input: RevealSnarkInput = {
      x: modPBigInt(x).toString(),
      y: modPBigInt(y).toString(),
      PLANETHASH_KEY: planetHashKey.toString(),
      SPACETYPE_KEY: spaceTypeKey.toString(),
      SCALE: scale.toString(),
      xMirror: mirrorX ? '1' : '0',
      yMirror: mirrorY ? '1' : '0',
    };

    const { proof, publicSignals }: SnarkJSProofAndSignals = await window.snarkjs.groth16.fullProve(
      input,
      revealCircuitPath,
      revealZkeyPath
    );

    return buildContractCallArgs(proof, publicSignals) as RevealSnarkContractCallArgs;
  }
}
