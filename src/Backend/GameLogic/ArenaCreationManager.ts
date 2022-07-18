import { INIT_ADDRESS } from '@darkforest_eth/contracts';
import { DarkForest, DFArenaInitialize } from '@darkforest_eth/contracts/typechain';
import { fakeHash, mimcHash, modPBigInt, perlin } from '@darkforest_eth/hashing';
import { EthConnection } from '@darkforest_eth/network';
import { address } from '@darkforest_eth/serde';
import {
  buildContractCallArgs,
  fakeProof,
  RevealSnarkContractCallArgs,
  RevealSnarkInput,
  SnarkJSProofAndSignals,
} from '@darkforest_eth/snarks';
import revealCircuitPath from '@darkforest_eth/snarks/reveal.wasm';
import revealZkeyPath from '@darkforest_eth/snarks/reveal.zkey';
import {
  ContractMethodName,
  EthAddress,
  LocationId,
  UnconfirmedCreateArenaPlanet,
  UnconfirmedCreateLobby,
  UnconfirmedReveal,
  WorldCoords,
  WorldLocation,
} from '@darkforest_eth/types';
import { TransactionReceipt } from '@ethersproject/providers';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import _ from 'lodash';
import { InitPlanet, LobbyPlanet } from '../../Frontend/Panes/Lobbies/LobbiesUtils';
import { LobbyInitializers } from '../../Frontend/Panes/Lobbies/Reducer';
import { OPTIMISM_GAS_LIMIT } from '../../Frontend/Utils/constants';
import { loadDiamondContract, loadInitContract } from '../Network/Blockchain';
import { ContractsAPI, makeContractsAPI } from './ContractsAPI';

export type CreatePlanetData = {
  location: string;
  planetCoords: {
    x: number;
    y: number;
  };
  perlinValue: number;
  biomeBase: number;
};

export type CreatedPlanet = LobbyPlanet & {
  createTx: string | undefined;
  revealTx: string | undefined;
};

export class ArenaCreationManager {
  private readonly lobbyAddress: EthAddress;
  private readonly contract: ContractsAPI;
  private readonly connection: EthConnection;
  private whitelistedAddresses: EthAddress[];
  private createdPlanets: CreatedPlanet[];

  private constructor(lobbyAddress: EthAddress, contract: ContractsAPI, connection: EthConnection) {
    this.lobbyAddress = lobbyAddress;
    this.contract = contract;
    this.connection = connection;
    this.whitelistedAddresses = [];
    this.createdPlanets = [];
  }

  public async createAndInitArena(config: LobbyInitializers) {
    if (config.ADMIN_PLANETS) {
      config.INIT_PLANETS = this.lobbyPlanetsToInitPlanets(
        config,
        config.ADMIN_PLANETS
      );
    }

    /* Don't want to submit ADMIN_PLANET as initdata because not used */

    // @ts-expect-error The Operand of a delete must be optional
    delete config.ADMIN_PLANETS;

    try {
      const initContract = await this.connection.loadContract<DFArenaInitialize>(
        INIT_ADDRESS,
        loadInitContract
      );

      const artifactBaseURI = '';
      const initInterface = initContract.interface;
      const initAddress = INIT_ADDRESS;
      const initFunctionCall = initInterface.encodeFunctionData('init', [
        config,
        {
          allowListEnabled: config.WHITELIST_ENABLED,
          artifactBaseURI,
          allowedAddresses: config.WHITELIST,
        },
      ]);
      console.log('creating lobby at', this.contract.getContractAddress());
      const txIntent: UnconfirmedCreateLobby = {
        methodName: 'createLobby',
        contract: this.contract.contract,
        args: Promise.resolve([initAddress, initFunctionCall]),
      };

      const tx = await this.contract.submitTransaction(txIntent, {
        // The createLobby function costs somewhere around 12mil gas
        gasLimit: OPTIMISM_GAS_LIMIT,
      });

      const lobbyReceipt = await tx.confirmedPromise;
      console.log(`created arena with ${lobbyReceipt.gasUsed} gas`);

      const { owner, lobby } = this.getLobbyCreatedEvent(lobbyReceipt, this.contract.contract);

      const diamond = await this.connection.loadContract<DarkForest>(lobby, loadDiamondContract);

      const startTx = await diamond.start({ gasLimit: OPTIMISM_GAS_LIMIT });
      const startRct = await startTx.wait();
      console.log(`initialized arena with ${startRct.gasUsed} gas`);
      return { owner, lobby, startTx };
    } catch (e) {
      console.log(e);
      throw new Error('lobby creation transaction failed.');
    }
  }

  public async createPlanet(planet: LobbyPlanet, initializers: LobbyInitializers) {
    const args = Promise.resolve([this.lobbyPlanetToInitPlanet(planet, initializers)]);

    const txIntent: UnconfirmedCreateArenaPlanet = {
      methodName: 'createArenaPlanet',
      contract: this.contract.contract,
      args: args,
    };

    const tx = await this.contract.submitTransaction(txIntent, {
      gasLimit: '15000000',
    });

    await tx.confirmedPromise;
    this.createdPlanets.push({ ...planet, createTx: tx?.hash, revealTx: undefined });
  }

  public async revealPlanet(planet: LobbyPlanet, initializers: LobbyInitializers) {
    const planetData = this.generatePlanetData(planet, initializers);
    const getArgs = async () => {
      const revealArgs = await this.makeRevealProof(
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
      coords: planetData.planetCoords as WorldCoords,
      hash: location.toString() as LocationId,
      perlin: planetData.perlinValue,
      biomebase: planetData.biomeBase,
    } as WorldLocation;

    const txIntent: UnconfirmedReveal = {
      methodName: 'revealLocation',
      contract: this.contract.contract,
      locationId: location.toString() as LocationId,
      location: worldLocation,
      args: getArgs(),
    };

    // Always await the submitTransaction so we can catch rejections
    const tx = await this.contract.submitTransaction(txIntent);
    console.log(`reveal tx submitted`);

    await tx.confirmedPromise;
    console.log(`reveal tx accepted`);
    const createdPlanet = this.createdPlanets.find((p) => p.x == planet.x && p.y == planet.y);
    if (!createdPlanet) throw new Error('created planet not found');
    createdPlanet.revealTx = tx?.hash;
  }

  public async bulkCreateAndReveal(planets: LobbyPlanet[], initializers: LobbyInitializers) {
    // make create Planet args
    const initPlanets = this.lobbyPlanetsToInitPlanets(initializers, planets);

    const args = Promise.resolve([initPlanets]);
    const txIntent = {
      methodName: 'bulkCreateAndReveal' as ContractMethodName,
      contract: this.contract.contract,
      args: args,
    };

    const tx = await this.contract.submitTransaction(txIntent, {
      gasLimit: '15000000',
    });

    await tx.confirmedPromise;

    planets.map((p) => this.createdPlanets.push({ ...p, createTx: tx?.hash, revealTx: tx?.hash }));
  }

  public async createPlanets({
    config,
    CHUNK_SIZE = 10,
  }: {
    config: LobbyInitializers;
    CHUNK_SIZE?: number;
  }) {
    const createPlanetTxs = _.chunk(config.INIT_PLANETS, CHUNK_SIZE).map(async (chunk) => {
      const args = Promise.resolve([chunk]);
      const txIntent = {
        methodName: 'bulkCreateAndReveal' as ContractMethodName,
        contract: this.contract.contract,
        args: args,
      };

      const tx = await this.contract.submitTransaction(txIntent, {
        gasLimit: OPTIMISM_GAS_LIMIT,
      });

      return tx.confirmedPromise;
    });

    await Promise.all(createPlanetTxs);
    console.log(
      `successfully created planets`,
      createPlanetTxs.map((i) => i)
    );
  }

  public async whitelistPlayer(address: EthAddress) {
    const args = Promise.resolve([address]);
    const txIntent = {
      methodName: 'addToWhitelist' as ContractMethodName,
      contract: this.contract.contract,
      args: args,
    };

    const tx = await this.contract.submitTransaction(txIntent, {
      gasLimit: '15000000',
    });

    await tx.confirmedPromise;
    this.whitelistedAddresses.push(address);
  }

  public lobbyPlanetToInitPlanet(planet: LobbyPlanet, initializers: LobbyInitializers) {
    const locationFunc = initializers.DISABLE_ZK_CHECKS
      ? fakeHash(initializers.PLANET_RARITY)
      : mimcHash(initializers.PLANETHASH_KEY);

    const location = locationFunc(planet.x, planet.y).toString();

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

    return {
      location: location,
      x: modPBigInt(planet.x).toString(),
      y: modPBigInt(planet.y).toString(),
      perlin: perlinValue,
      level: planet.level,
      planetType: planet.planetType,
      requireValidLocationId: false,
      isTargetPlanet: planet.isTargetPlanet,
      isSpawnPlanet: planet.isSpawnPlanet,
      blockedPlanetIds: planet.blockedPlanetLocs.map((p) => locationFunc(p.x, p.y).toString()),
    };
  }

  public lobbyPlanetsToInitPlanets(initializers: LobbyInitializers, planets: LobbyPlanet[]) : InitPlanet[] {
    const initPlanets: InitPlanet[] = [];
    planets.forEach((p) => initPlanets.push(this.lobbyPlanetToInitPlanet(p, initializers)));
    // SORT INIT PLANETS SO THEY HAVE SAME ORDER ON-CHAIN. THIS CAN BREAK CONFIG HASH OTHERWISE.
    initPlanets.sort((a, b) => (a.location > b.location ? 1 : -1));
    return initPlanets;
  }

  public getLobbyCreatedEvent(
    lobbyReceipt: TransactionReceipt,
    contract: DarkForest
  ): { owner: EthAddress; lobby: EthAddress } {
    const lobbyCreatedHash = keccak256(toUtf8Bytes('LobbyCreated(address,address)'));
    const log = lobbyReceipt.logs.find((log) => log.topics[0] === lobbyCreatedHash);
    if (log) {
      return {
        owner: address(contract.interface.parseLog(log).args.creatorAddress),
        lobby: address(contract.interface.parseLog(log).args.lobbyAddress),
      };
    } else {
      throw new Error('Lobby Created event not found');
    }
  }

  private generatePlanetData(planet: LobbyPlanet, initializers: LobbyInitializers) {
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

  private async makeRevealProof(
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

      const { proof, publicSignals }: SnarkJSProofAndSignals =
        await window.snarkjs.groth16.fullProve(input, revealCircuitPath, revealZkeyPath);

      return buildContractCallArgs(proof, publicSignals) as RevealSnarkContractCallArgs;
    }
  }

  get planets() {
    return this.createdPlanets;
  }

  get allAddresses() {
    return this.whitelistedAddresses;
  }

  get address() {
    return this.lobbyAddress;
  }

  static async create(
    connection: EthConnection,
    contractAddress: EthAddress
  ): Promise<ArenaCreationManager> {
    try {
      const contract = await makeContractsAPI({ connection, contractAddress });
      const manager = new ArenaCreationManager(contractAddress, contract, connection);
      return manager;
    } catch (e) {
      throw new Error("couldn't connect to blockchain.");
    }
  }
}
