import { EthAddress, GraphArena, GraphPlanet } from '@darkforest_eth/types';
import _ from 'lodash';
import { LobbyPlanet } from '../../Frontend/Panes/Lobbies/LobbiesUtils';
import { LobbyInitializers } from '../../Frontend/Panes/Lobbies/Reducer';
import { apiUrl } from '../../Frontend/Utils/constants';
import { PlanetTypeWeights } from '../../_types/darkforest/api/ContractsAPITypes';
import { getGraphQLData } from './GraphApi';

export const CONSTANTS = `config{
  # START_PAUSED,
ADMIN_CAN_ADD_PLANETS,
TOKEN_MINT_END_TIMESTAMP,
WORLD_RADIUS_LOCKED,
WORLD_RADIUS_MIN,
DISABLE_ZK_CHECKS,
PLANETHASH_KEY,
SPACETYPE_KEY,
BIOMEBASE_KEY,
PERLIN_MIRROR_X,
PERLIN_MIRROR_Y,
PERLIN_LENGTH_SCALE,
MAX_NATURAL_PLANET_LEVEL,
TIME_FACTOR_HUNDREDTHS,
PERLIN_THRESHOLD_1,
PERLIN_THRESHOLD_2,
PERLIN_THRESHOLD_3,
INIT_PERLIN_MAX,
INIT_PERLIN_MIN,
BIOME_THRESHOLD_1,
BIOME_THRESHOLD_2,
PLANET_LEVEL_THRESHOLDS,
PLANET_RARITY,
PLANET_TRANSFER_ENABLED,
PHOTOID_ACTIVATION_DELAY,
SPAWN_RIM_AREA,
LOCATION_REVEAL_COOLDOWN,
# CLAIM_PLANET_COOLDOWN,
# PLANET_TYPE_WEIGHTS,
SILVER_SCORE_VALUE,
ARTIFACT_POINT_VALUES,
SPACE_JUNK_ENABLED,
SPACE_JUNK_LIMIT,
PLANET_LEVEL_JUNK,
ABANDON_SPEED_CHANGE_PERCENT,
ABANDON_RANGE_CHANGE_PERCENT,
CAPTURE_ZONES_ENABLED,
CAPTURE_ZONE_COUNT,
CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL,
CAPTURE_ZONE_RADIUS,
CAPTURE_ZONE_PLANET_LEVEL_SCORE,
CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED,
CAPTURE_ZONES_PER_5000_WORLD_RADIUS,
MANUAL_SPAWN,
TARGET_PLANETS,
CLAIM_VICTORY_ENERGY_PERCENT,
MODIFIERS,
SPACESHIPS,
RANDOM_ARTIFACTS,
START_PAUSED,
WHITELIST_ENABLED,
CONFIRM_START,
TARGETS_REQUIRED_FOR_VICTORY,
BLOCK_CAPTURE,
BLOCK_MOVES,
TEAMS_ENABLED,
NUM_TEAMS,
RANKED,
NO_ADMIN,
PLANET_TYPE_WEIGHTS,
# INIT_PLANETS,
},
planets(first: 30) {
  x,
  y,
  locationDec,
  perlin,
  level,
  planetType,
  targetPlanet,
  spawnPlanet
}`;

export async function loadConfigFromHash(config: string): Promise<
  | {
      config: LobbyInitializers;
      address: string;
    }
  | undefined
> {
  const query = `
query {
    arenas(first:1, where: {configHash: "${config}"}) {
        lobbyAddress,
        configHash,
        gameOver,
        startTime,
        ${CONSTANTS}
      }
}
`;
  const rawData = await getGraphQLData(query, apiUrl);
  return await convertGraphConfig(rawData.data.arenas[0]);
}

export async function loadConfigFromAddress(address: EthAddress): Promise<
  | {
      config: LobbyInitializers;
      address: string;
    }
  | undefined
> {
  const query = `
  query {
    arena(id: "${address}") {
      lobbyAddress,
        configHash,
        gameOver,
        startTime,
        ${CONSTANTS}
    }
  }
`;
  try {
    const rawData: GraphArena = (await getGraphQLData(query, apiUrl)).data.arena;
    console.log('graph Data pre parse', rawData);
    const configData = convertGraphConfig(rawData);
    console.log('graphConfigData:', configData);

    return configData;
  } catch (e) {
    console.log(e);
  }
}

const GraphPlanetType = ['PLANET', 'ASTEROID', 'FOUNDRY', 'SPACETIME_RIP', 'QUASAR'];

export function convertGraphConfig(arena: GraphArena): {
  config: LobbyInitializers;
  address: string;
} {
  if (!arena.config) throw new Error("Can't load arena config");

  const thresholds: number[] = arena.config.PLANET_LEVEL_THRESHOLDS;
  return {
    config: {
      ...arena.config,
      // CLAIM_PLANET_COOLDOWN: 0,
      PLANET_TYPE_WEIGHTS: _.chunk(arena.config.PLANET_TYPE_WEIGHTS, 50).map((block) =>
        _.chunk(block, 5)
      ) as any,
      PLANET_LEVEL_THRESHOLDS:
        thresholds.find((i) => i == 0) !== undefined
          ? [16_777_216, 4_194_292, 1_048_561, 262_128, 65_520, 16_368, 4_080, 1_008, 240, 48]
          : arena.config.PLANET_LEVEL_THRESHOLDS,
      WHITELIST: [],
      ADMIN_PLANETS: arena.planets.map((planet: GraphPlanet) => {
        return {
          ...planet,
          planetType: GraphPlanetType.indexOf(planet.planetType),
          x: Number(planet.x),
          y: Number(planet.y),
          location: planet.locationDec,
          isTargetPlanet: planet.targetPlanet,
          isSpawnPlanet: planet.spawnPlanet,
          blockedPlanetLocs: [],
        } as LobbyPlanet;
      }),
      INIT_PLANETS: [],
    },
    address: arena.lobbyAddress,
  };
}
