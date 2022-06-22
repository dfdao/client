import { EthAddress, GraphArena, GraphPlanet } from '@darkforest_eth/types';
import { LobbyInitializers } from '../../Frontend/Panes/Lobbies/Reducer';
import { apiUrl } from '../../Frontend/Utils/constants';
import { getGraphQLData } from './GraphApi';

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
        ${CONSTANTS}
      }
    }
`;
    try {
    const rawData : GraphArena = (await getGraphQLData(query, apiUrl)).data.arena;
    const configData = convertGraphConfig(rawData);
    return configData;
    } catch (e) {
      console.log(e);
    }
}

export function convertGraphConfig(
  arena: GraphArena
): { config: LobbyInitializers; address: string } {
  return {
    config: {
      ...arena.config,
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
      ADMIN_PLANETS: arena.planets.map((planet: GraphPlanet) => {
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
    address: arena.lobbyAddress,
  };
}
