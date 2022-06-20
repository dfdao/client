import { EMPTY_ADDRESS } from '@darkforest_eth/constants';
import { address } from '@darkforest_eth/serde';
import {
  ExactArray10,
  ExactArray5,
  ExactArray8,
  Tuple6,
} from '@darkforest_eth/settings/dist/decoder-helpers';
import {
  ArenaLeaderboard,
  ArenaLeaderboardEntry,
  EthAddress,
  Leaderboard,
  LeaderboardEntry,
} from '@darkforest_eth/types';
import { LobbyInitializers } from '../../Frontend/Panes/Lobbies/Reducer';
import { planetBackground } from '../../Frontend/Styles/Mixins';
import {
  roundEndTimestamp,
  roundStartTimestamp,
  competitiveConfig,
  apiUrl,
} from '../../Frontend/Utils/constants';
import { getGraphQLData } from './GraphApi';
import { getAllTwitters } from './UtilityServerAPI';

const CONSTANTS = `config{
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
# RANDOM_ARTIFACTS,
NO_ADMIN,
# INIT_PLANETS,
},
planets(first: 20) {
  x,
  y,
  locationDec,
  perlin,
  level,
  planetType,
  targetPlanet,
  spawnPlanet
}`;

export async function loadConfigFromHash(config: string): Promise<{
  config: LobbyInitializers;
  address: string;
} | undefined> {
  const query = `
query {
    arenas(first:1, where: {configHash: "${config}"}) {
        lobbyAddress,
        ${CONSTANTS}
      }
}
`;
const rawData = await getGraphQLData(query, apiUrl);
return await convertData(rawData.data.arenas[0]);}

export async function loadConfigFromAddress(address: EthAddress): Promise<{
  config: LobbyInitializers;
  address: string; }
 | undefined> {
  const query = `
query {
    arena(id: "${address}") {
        lobbyAddress,
        ${CONSTANTS}
      }
    }
`;
const rawData = await getGraphQLData(query, apiUrl);
console.log(rawData);
return await convertData(rawData.data.arena);

}

interface rawConfig {
  lobbyAddress: string;
  config: {
    // START_PAUSED,
    ADMIN_CAN_ADD_PLANETS: boolean;
    TOKEN_MINT_END_TIMESTAMP: number;
    WORLD_RADIUS_LOCKED: boolean;
    WORLD_RADIUS_MIN: number;
    DISABLE_ZK_CHECKS: boolean;
    PLANETHASH_KEY: number;
    SPACETYPE_KEY: number;
    BIOMEBASE_KEY: number;
    PERLIN_MIRROR_X: boolean;
    PERLIN_MIRROR_Y: boolean;
    PERLIN_LENGTH_SCALE: number;
    MAX_NATURAL_PLANET_LEVEL: number;
    TIME_FACTOR_HUNDREDTHS: number;
    PERLIN_THRESHOLD_1: number;
    PERLIN_THRESHOLD_2: number;
    PERLIN_THRESHOLD_3: number;
    INIT_PERLIN_MAX: number;
    INIT_PERLIN_MIN: number;
    BIOME_THRESHOLD_1: number;
    BIOME_THRESHOLD_2: number;
    PLANET_LEVEL_THRESHOLDS: ExactArray10<number>;
    PLANET_RARITY: number;
    PLANET_TRANSFER_ENABLED: boolean;
    PHOTOID_ACTIVATION_DELAY: number;
    SPAWN_RIM_AREA: number;
    LOCATION_REVEAL_COOLDOWN: number;
    // # CLAIM_PLANET_COOLDOWN,
    // # PLANET_TYPE_WEIGHTS,
    SILVER_SCORE_VALUE: number;
    ARTIFACT_POINT_VALUES: Tuple6<number>;
    SPACE_JUNK_ENABLED: boolean;
    SPACE_JUNK_LIMIT: number;
    PLANET_LEVEL_JUNK: ExactArray10<number>;
    ABANDON_SPEED_CHANGE_PERCENT: number;
    ABANDON_RANGE_CHANGE_PERCENT: number;
    CAPTURE_ZONES_ENABLED: boolean;
    CAPTURE_ZONE_COUNT: number;
    CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: number;
    CAPTURE_ZONE_RADIUS: number;
    CAPTURE_ZONE_PLANET_LEVEL_SCORE: ExactArray10<number>;
    CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: number;
    CAPTURE_ZONES_PER_5000_WORLD_RADIUS: number;
    MANUAL_SPAWN: boolean;
    TARGET_PLANETS: boolean;
    CLAIM_VICTORY_ENERGY_PERCENT: number;
    MODIFIERS: ExactArray8<number>;
    SPACESHIPS: ExactArray5<boolean>;
    // # RANDOM_ARTIFACTS,
    NO_ADMIN: boolean;
    // # INIT_PLANETS,
  };
  planets: {
    x: number;
    y: number;
    level: number;
    planetType: number;
    locationDec: string;
    perlin: number;
    targetPlanet: boolean;
    spawnPlanet: boolean;
  }[];
}

async function convertData(
  config: rawConfig | undefined
): Promise<{ config: LobbyInitializers; address: string } | undefined> {
  if(!config) return undefined;
  return {
    config: {
      ...config.config,
      START_PAUSED: true,
      CLAIM_PLANET_COOLDOWN: 0,
      PLANET_TYPE_WEIGHTS: [
        [
          [1, 0, 0, 0, 0],
          [13, 2, 0, 1, 0],
          [13, 2, 0, 1, 0],
          [13, 2, 0, 0, 1],
          [13, 2, 0, 0, 1],
          [13, 2, 0, 0, 1],
          [13, 2, 0, 0, 1],
          [13, 2, 0, 0, 1],
          [13, 2, 0, 0, 1],
          [13, 2, 0, 0, 1],
        ],
        [
          [1, 0, 0, 0, 0],
          [13, 2, 1, 0, 0],
          [12, 2, 1, 1, 0],
          [11, 2, 1, 1, 1],
          [12, 2, 1, 0, 1],
          [12, 2, 1, 0, 1],
          [12, 2, 1, 0, 1],
          [12, 2, 1, 0, 1],
          [12, 2, 1, 0, 1],
          [12, 2, 1, 0, 1],
        ],
        [
          [1, 0, 0, 0, 0],
          [10, 4, 2, 0, 0],
          [10, 4, 1, 1, 0],
          [8, 4, 1, 2, 1],
          [8, 4, 1, 2, 1],
          [8, 4, 1, 2, 1],
          [8, 4, 1, 2, 1],
          [8, 4, 1, 2, 1],
          [8, 4, 1, 2, 1],
          [8, 4, 1, 2, 1],
        ],
        [
          [1, 0, 0, 0, 0],
          [11, 4, 1, 0, 0],
          [11, 4, 1, 0, 0],
          [7, 4, 2, 2, 1],
          [7, 4, 2, 2, 1],
          [7, 4, 2, 2, 1],
          [7, 4, 2, 2, 1],
          [7, 4, 2, 2, 1],
          [7, 4, 2, 2, 1],
          [7, 4, 2, 2, 1],
        ],
      ],
      RANDOM_ARTIFACTS: false,
      ADMIN_PLANETS: config.planets.map((planet) => {
        return {
          ...planet,
          x: Number(planet.x),
          y: Number(planet.y),
          location: planet.locationDec,
          isTargetPlanet: planet.targetPlanet,
          isSpawnPlanet: planet.spawnPlanet,
        };
      }),
      INIT_PLANETS: [],
      WHITELIST_ENABLED: false,
      WHITELIST: [],
    },
    address: config.lobbyAddress,
  };
}
