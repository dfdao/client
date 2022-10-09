import { address } from '@darkforest_eth/serde';
import { LobbyInitializers } from '../Panes/Lobby/Reducer';

const tutorial: LobbyInitializers = {
  ABANDON_RANGE_CHANGE_PERCENT: 150,
  ABANDON_SPEED_CHANGE_PERCENT: 150,
  ADMIN_CAN_ADD_PLANETS: true,
  ARTIFACT_POINT_VALUES: [0, 100000, 200000, 500000, 20000000, 50000000],
  BIOME_THRESHOLD_1: 14,
  BIOME_THRESHOLD_2: 17,
  BIOMEBASE_KEY: 69,
  BLOCK_CAPTURE: false,
  BLOCK_MOVES: false,
  CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: 255,
  CAPTURE_ZONE_COUNT: 20,
  CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: 2048,
  CAPTURE_ZONE_PLANET_LEVEL_SCORE: [
    0, 0, 250000, 500000, 750000, 1000000, 10000000, 20000000, 50000000, 100000000,
  ],
  CAPTURE_ZONE_RADIUS: 1000,
  CAPTURE_ZONES_ENABLED: false,
  CAPTURE_ZONES_PER_5000_WORLD_RADIUS: 3,
  CLAIM_VICTORY_ENERGY_PERCENT: 1,
  CONFIRM_START: false,
  DISABLE_ZK_CHECKS: false,
  INIT_PERLIN_MAX: 32,
  INIT_PERLIN_MIN: 0,
  INIT_PLANETS: [],
  LOCATION_REVEAL_COOLDOWN: 10800,
  MANUAL_SPAWN: true,
  MAX_NATURAL_PLANET_LEVEL: 2,
  MODIFIERS: [100, 100, 100, 100, 5, 10, 100, 100],
  NO_ADMIN: false,
  NUM_TEAMS: 2,
  PERLIN_LENGTH_SCALE: 32,
  PERLIN_MIRROR_X: false,
  PERLIN_MIRROR_Y: false,
  PERLIN_THRESHOLD_1: 14,
  PERLIN_THRESHOLD_2: 15,
  PERLIN_THRESHOLD_3: 19,
  PHOTOID_ACTIVATION_DELAY: 20,
  PLANET_LEVEL_JUNK: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  PLANET_LEVEL_THRESHOLDS: [16777172, 4194292, 1048561, 262128, 65520, 16368, 4080, 1008, 240, 48],
  PLANET_RARITY: 40,
  PLANET_TRANSFER_ENABLED: false,
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
  PLANETHASH_KEY: 69,
  RANDOM_ARTIFACTS: false,
  RANKED: false,
  RANGE_DOUBLING_SECS: 0,
  SILVER_SCORE_VALUE: 10,
  SPACE_JUNK_ENABLED: false,
  SPACE_JUNK_LIMIT: 1000,
  SPACESHIPS: [true, true, true, true, false],
  SPACETYPE_KEY: 69,
  SPAWN_RIM_AREA: 0,
  START_PAUSED: false,
  TARGET_PLANETS: true,
  TARGETS_REQUIRED_FOR_VICTORY: 1,
  TEAMS_ENABLED: false,
  TIME_FACTOR_HUNDREDTHS: 1500,
  TOKEN_MINT_END_TIMESTAMP: 1717258179,
  WHITELIST_ENABLED: false,
  WORLD_RADIUS_LOCKED: true,
  WORLD_RADIUS_MIN: 15,
  WHITELIST: [],
  ADMIN_PLANETS: [
    {
      x: 0,
      y: 12,
      level: 2,
      planetType: 4,
      isTargetPlanet: true,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: -12,
      level: 2,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: 8,
      y: -10,
      level: 2,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -8,
      y: -10,
      level: 2,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
  ],
};
const vanilla: LobbyInitializers = {
  ADMIN_CAN_ADD_PLANETS: true,
  WORLD_RADIUS_LOCKED: true,
  WORLD_RADIUS_MIN: 5000,
  DISABLE_ZK_CHECKS: false,
  PLANETHASH_KEY: 69,
  SPACETYPE_KEY: 69,
  BIOMEBASE_KEY: 69,
  PERLIN_LENGTH_SCALE: 512,
  PERLIN_MIRROR_X: false,
  PERLIN_MIRROR_Y: false,
  MAX_NATURAL_PLANET_LEVEL: 3,
  TIME_FACTOR_HUNDREDTHS: 100,
  PERLIN_THRESHOLD_1: 11,
  PERLIN_THRESHOLD_2: 15,
  PERLIN_THRESHOLD_3: 19,
  INIT_PERLIN_MIN: 0,
  INIT_PERLIN_MAX: 32,
  BIOME_THRESHOLD_1: 14,
  BIOME_THRESHOLD_2: 17,
  SILVER_SCORE_VALUE: 10,
  PLANET_LEVEL_THRESHOLDS: [4194293, 4194292, 1048561, 262128, 65520, 16368, 4080, 1008, 240, 48],
  PLANET_RARITY: 7000,
  PLANET_TRANSFER_ENABLED: false,
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
  ARTIFACT_POINT_VALUES: [0, 100000, 200000, 500000, 20000000, 50000000],
  SPACE_JUNK_ENABLED: false,
  SPACE_JUNK_LIMIT: 1000,
  PLANET_LEVEL_JUNK: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  ABANDON_SPEED_CHANGE_PERCENT: 150,
  ABANDON_RANGE_CHANGE_PERCENT: 150,
  PHOTOID_ACTIVATION_DELAY: 300,
  SPAWN_RIM_AREA: 0,
  LOCATION_REVEAL_COOLDOWN: 10800,
  CAPTURE_ZONES_ENABLED: false,
  CAPTURE_ZONE_COUNT: 20,
  CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: 255,
  CAPTURE_ZONE_RADIUS: 1000,
  CAPTURE_ZONE_PLANET_LEVEL_SCORE: [
    0, 0, 250000, 500000, 750000, 1000000, 10000000, 20000000, 50000000, 100000000,
  ],
  CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: 2048,
  CAPTURE_ZONES_PER_5000_WORLD_RADIUS: 3,
  MANUAL_SPAWN: true,
  TARGET_PLANETS: true,
  CLAIM_VICTORY_ENERGY_PERCENT: 100,
  MODIFIERS: [100, 100, 100, 100, 75, 100, 100, 100],
  SPACESHIPS: [true, true, true, true, false],
  RANDOM_ARTIFACTS: false,
  NO_ADMIN: false,
  WHITELIST_ENABLED: false,
  START_PAUSED: false,
  ADMIN_PLANETS: [],
  TOKEN_MINT_END_TIMESTAMP: 1717258179,
  WHITELIST: [],
  INIT_PLANETS: [],
  CONFIRM_START: false,
  TARGETS_REQUIRED_FOR_VICTORY: 1,
  BLOCK_CAPTURE: false,
  BLOCK_MOVES: false,
  TEAMS_ENABLED: false,
  NUM_TEAMS: 2,
  RANKED: false,
  RANGE_DOUBLING_SECS: 0,
};

const devOnePlayerRace: LobbyInitializers = {
  ADMIN_CAN_ADD_PLANETS: true,
  WORLD_RADIUS_LOCKED: true,
  WORLD_RADIUS_MIN: 3000,
  DISABLE_ZK_CHECKS: true,
  PLANETHASH_KEY: 4401,
  SPACETYPE_KEY: 4402,
  BIOMEBASE_KEY: 4403,
  PERLIN_LENGTH_SCALE: 512,
  PERLIN_MIRROR_X: false,
  PERLIN_MIRROR_Y: false,
  MAX_NATURAL_PLANET_LEVEL: 3,
  TIME_FACTOR_HUNDREDTHS: 1000,
  PERLIN_THRESHOLD_1: 11,
  PERLIN_THRESHOLD_2: 15,
  PERLIN_THRESHOLD_3: 19,
  INIT_PERLIN_MIN: 0,
  INIT_PERLIN_MAX: 32,
  BIOME_THRESHOLD_1: 14,
  BIOME_THRESHOLD_2: 17,
  SILVER_SCORE_VALUE: 10,
  PLANET_LEVEL_THRESHOLDS: [4194293, 4194292, 1048561, 262128, 65520, 16368, 4080, 1008, 240, 48],
  PLANET_RARITY: 7000,
  PLANET_TRANSFER_ENABLED: false,
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
  ARTIFACT_POINT_VALUES: [0, 100000, 200000, 500000, 20000000, 50000000],
  SPACE_JUNK_ENABLED: false,
  SPACE_JUNK_LIMIT: 1000,
  PLANET_LEVEL_JUNK: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  ABANDON_SPEED_CHANGE_PERCENT: 150,
  ABANDON_RANGE_CHANGE_PERCENT: 150,
  PHOTOID_ACTIVATION_DELAY: 300,
  SPAWN_RIM_AREA: 0,
  LOCATION_REVEAL_COOLDOWN: 10800,
  CAPTURE_ZONES_ENABLED: false,
  CAPTURE_ZONE_COUNT: 20,
  CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: 255,
  CAPTURE_ZONE_RADIUS: 1000,
  CAPTURE_ZONE_PLANET_LEVEL_SCORE: [
    0, 0, 250000, 500000, 750000, 1000000, 10000000, 20000000, 50000000, 100000000,
  ],
  CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: 2048,
  CAPTURE_ZONES_PER_5000_WORLD_RADIUS: 3,
  MANUAL_SPAWN: true,
  TARGET_PLANETS: true,
  CLAIM_VICTORY_ENERGY_PERCENT: 20,
  MODIFIERS: [100, 100, 100, 100, 75, 100, 100, 100],
  SPACESHIPS: [true, true, false, true, false],
  RANDOM_ARTIFACTS: false,
  NO_ADMIN: false,
  WHITELIST_ENABLED: false,
  START_PAUSED: false,
  ADMIN_PLANETS: [
    {
      x: 0,
      y: 0,
      level: 3,
      planetType: 0,
      isSpawnPlanet: true,
      isTargetPlanet: true,
      blockedPlanetLocs: [],
    },
  ],
  TOKEN_MINT_END_TIMESTAMP: 1717258179,
  WHITELIST: [],
  INIT_PLANETS: [],
  CONFIRM_START: false,
  TARGETS_REQUIRED_FOR_VICTORY: 1,
  BLOCK_CAPTURE: false,
  BLOCK_MOVES: false,
  TEAMS_ENABLED: false,
  NUM_TEAMS: 2,
  RANKED: false,
  RANGE_DOUBLING_SECS: 300,
};

const fourPlayerBattle: LobbyInitializers = {
  ADMIN_CAN_ADD_PLANETS: true,
  WORLD_RADIUS_LOCKED: true,
  WORLD_RADIUS_MIN: 7000,
  DISABLE_ZK_CHECKS: false,
  PLANETHASH_KEY: 2401,
  SPACETYPE_KEY: 2402,
  BIOMEBASE_KEY: 2403,
  PERLIN_LENGTH_SCALE: 2048,
  PERLIN_MIRROR_X: true,
  PERLIN_MIRROR_Y: true,
  MAX_NATURAL_PLANET_LEVEL: 9,
  TIME_FACTOR_HUNDREDTHS: 1500,
  PERLIN_THRESHOLD_1: 13,
  PERLIN_THRESHOLD_2: 14,
  PERLIN_THRESHOLD_3: 17,
  INIT_PERLIN_MIN: 0,
  INIT_PERLIN_MAX: 32,
  BIOME_THRESHOLD_1: 14,
  BIOME_THRESHOLD_2: 17,
  SILVER_SCORE_VALUE: 10,
  PLANET_LEVEL_THRESHOLDS: [1048563, 1048562, 1048561, 262128, 65520, 16368, 4080, 1008, 240, 48],
  PLANET_RARITY: 9000,
  PLANET_TRANSFER_ENABLED: true,
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
  ARTIFACT_POINT_VALUES: [0, 100000, 200000, 500000, 20000000, 50000000],
  SPACE_JUNK_ENABLED: true,
  SPACE_JUNK_LIMIT: 1000,
  PLANET_LEVEL_JUNK: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  ABANDON_SPEED_CHANGE_PERCENT: 150,
  ABANDON_RANGE_CHANGE_PERCENT: 150,
  PHOTOID_ACTIVATION_DELAY: 60,
  SPAWN_RIM_AREA: 0,
  LOCATION_REVEAL_COOLDOWN: 10800,
  CAPTURE_ZONES_ENABLED: false,
  CAPTURE_ZONE_COUNT: 20,
  CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: 255,
  CAPTURE_ZONE_RADIUS: 1000,
  CAPTURE_ZONE_PLANET_LEVEL_SCORE: [
    0, 0, 250000, 500000, 750000, 1000000, 10000000, 20000000, 50000000, 100000000,
  ],
  CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: 2048,
  CAPTURE_ZONES_PER_5000_WORLD_RADIUS: 3,
  MANUAL_SPAWN: true,
  TARGET_PLANETS: true,
  CLAIM_VICTORY_ENERGY_PERCENT: 50,
  MODIFIERS: [100, 100, 100, 100, 100, 100, 100, 100],
  SPACESHIPS: [true, true, false, true, false],
  WHITELIST_ENABLED: false,
  START_PAUSED: false,
  RANDOM_ARTIFACTS: true,
  ADMIN_PLANETS: [
    {
      x: -5500,
      y: 0,
      level: 3,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: 5500,
      y: 0,
      level: 3,
      planetType: 0,
      isTargetPlanet: true,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: 5500,
      level: 3,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: -5500,
      level: 3,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: 0,
      level: 4,
      planetType: 4,
      isTargetPlanet: true,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
  ],
  TOKEN_MINT_END_TIMESTAMP: 1717258179, // SECONDS!,
  NO_ADMIN: false,
  INIT_PLANETS: [],
  WHITELIST: [],
  CONFIRM_START: true,
  TARGETS_REQUIRED_FOR_VICTORY: 2,
  BLOCK_CAPTURE: false,
  BLOCK_MOVES: false,
  TEAMS_ENABLED: false,
  NUM_TEAMS: 2,
  RANKED: false,
  RANGE_DOUBLING_SECS: 0,
};

const sprint: LobbyInitializers = {
  ADMIN_CAN_ADD_PLANETS: true,
  WORLD_RADIUS_LOCKED: true,
  WORLD_RADIUS_MIN: 6000,
  DISABLE_ZK_CHECKS: false,
  PLANETHASH_KEY: 9348,
  SPACETYPE_KEY: 9349,
  BIOMEBASE_KEY: 9350,
  PERLIN_LENGTH_SCALE: 2048,
  PERLIN_MIRROR_X: false,
  PERLIN_MIRROR_Y: true,
  MAX_NATURAL_PLANET_LEVEL: 4,
  TIME_FACTOR_HUNDREDTHS: 1500,
  PERLIN_THRESHOLD_1: 12,
  PERLIN_THRESHOLD_2: 13,
  PERLIN_THRESHOLD_3: 16,
  INIT_PERLIN_MIN: 0,
  INIT_PERLIN_MAX: 32,
  BIOME_THRESHOLD_1: 14,
  BIOME_THRESHOLD_2: 17,
  SILVER_SCORE_VALUE: 10,
  PLANET_LEVEL_THRESHOLDS: [1048563, 1048562, 1048561, 262128, 65520, 16368, 4080, 1008, 240, 48],
  PLANET_RARITY: 10000,
  PLANET_TRANSFER_ENABLED: true,
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
  ARTIFACT_POINT_VALUES: [0, 100000, 200000, 500000, 20000000, 50000000],
  SPACE_JUNK_ENABLED: false,
  SPACE_JUNK_LIMIT: 1000,
  PLANET_LEVEL_JUNK: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  ABANDON_SPEED_CHANGE_PERCENT: 150,
  ABANDON_RANGE_CHANGE_PERCENT: 150,
  PHOTOID_ACTIVATION_DELAY: 60,
  SPAWN_RIM_AREA: 0,
  LOCATION_REVEAL_COOLDOWN: 10800,
  CAPTURE_ZONES_ENABLED: false,
  CAPTURE_ZONE_COUNT: 20,
  CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: 255,
  CAPTURE_ZONE_RADIUS: 1000,
  CAPTURE_ZONE_PLANET_LEVEL_SCORE: [
    0, 0, 250000, 500000, 750000, 1000000, 10000000, 20000000, 50000000, 100000000,
  ],
  CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: 2048,
  CAPTURE_ZONES_PER_5000_WORLD_RADIUS: 3,
  MANUAL_SPAWN: true,
  TARGET_PLANETS: true,
  CLAIM_VICTORY_ENERGY_PERCENT: 50,
  MODIFIERS: [100, 100, 100, 100, 100, 100, 100, 100],
  SPACESHIPS: [true, true, false, true, true],
  WHITELIST_ENABLED: false,
  START_PAUSED: false,
  RANDOM_ARTIFACTS: true,
  ADMIN_PLANETS: [
    {
      x: -4000,
      y: -4000,
      level: 2,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: 4000,
      y: 4000,
      level: 2,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: -4000,
      y: 4000,
      level: 4,
      planetType: 0,
      isTargetPlanet: true,
      isSpawnPlanet: false,
      blockedPlanetLocs: [
        {
          x: -4000,
          y: -4000,
        },
      ],
    },
    {
      x: 4000,
      y: -4000,
      level: 4,
      planetType: 0,
      isTargetPlanet: true,
      isSpawnPlanet: false,
      blockedPlanetLocs: [
        {
          x: 4000,
          y: 4000,
        },
      ],
    },
  ],
  TOKEN_MINT_END_TIMESTAMP: 1717258179, // SECONDS!,
  NO_ADMIN: false,
  INIT_PLANETS: [],
  WHITELIST: [],
  CONFIRM_START: true,
  TARGETS_REQUIRED_FOR_VICTORY: 1,
  BLOCK_CAPTURE: true,
  BLOCK_MOVES: true,
  TEAMS_ENABLED: false,
  NUM_TEAMS: 2,
  RANKED: true,
  RANGE_DOUBLING_SECS: 0,
};

const grandPrix: LobbyInitializers = {
  ADMIN_CAN_ADD_PLANETS: true,
  WORLD_RADIUS_LOCKED: true,
  WORLD_RADIUS_MIN: 5500,
  DISABLE_ZK_CHECKS: false,
  PLANETHASH_KEY: 9469,
  SPACETYPE_KEY: 9470,
  BIOMEBASE_KEY: 9471,
  PERLIN_LENGTH_SCALE: 1024,
  PERLIN_MIRROR_X: false,
  PERLIN_MIRROR_Y: false,
  MAX_NATURAL_PLANET_LEVEL: 3,
  TIME_FACTOR_HUNDREDTHS: 1600,
  PERLIN_THRESHOLD_1: 15,
  PERLIN_THRESHOLD_2: 16,
  PERLIN_THRESHOLD_3: 20,
  INIT_PERLIN_MIN: 0,
  INIT_PERLIN_MAX: 32,
  BIOME_THRESHOLD_1: 14,
  BIOME_THRESHOLD_2: 17,
  SILVER_SCORE_VALUE: 10,
  PLANET_LEVEL_THRESHOLDS: [1048563, 1048562, 1048561, 262128, 65520, 16368, 4080, 1008, 240, 48],
  PLANET_RARITY: 12000,
  PLANET_TRANSFER_ENABLED: false,
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
  ARTIFACT_POINT_VALUES: [0, 100000, 200000, 500000, 20000000, 50000000],
  SPACE_JUNK_ENABLED: true,
  SPACE_JUNK_LIMIT: 1000,
  PLANET_LEVEL_JUNK: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  ABANDON_SPEED_CHANGE_PERCENT: 150,
  ABANDON_RANGE_CHANGE_PERCENT: 150,
  PHOTOID_ACTIVATION_DELAY: 300,
  SPAWN_RIM_AREA: 0,
  LOCATION_REVEAL_COOLDOWN: 10800,
  CAPTURE_ZONES_ENABLED: false,
  CAPTURE_ZONE_COUNT: 20,
  CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: 255,
  CAPTURE_ZONE_RADIUS: 1000,
  CAPTURE_ZONE_PLANET_LEVEL_SCORE: [
    0, 0, 250000, 500000, 750000, 1000000, 10000000, 20000000, 50000000, 100000000,
  ],
  CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: 2048,
  CAPTURE_ZONES_PER_5000_WORLD_RADIUS: 3,
  MANUAL_SPAWN: true,
  TARGET_PLANETS: true,
  CLAIM_VICTORY_ENERGY_PERCENT: 0,
  MODIFIERS: [95, 100, 150, 150, 75, 100, 100, 100],
  SPACESHIPS: [true, true, false, true, false],
  RANDOM_ARTIFACTS: false,
  NO_ADMIN: false,
  WHITELIST_ENABLED: false,
  START_PAUSED: false,
  ADMIN_PLANETS: [
    {
      x: -2800,
      y: 4150,
      level: 2,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: 3500,
      y: -3000,
      level: 5,
      planetType: 4,
      isTargetPlanet: true,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 400,
      y: 4000,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -2800,
      y: -1500,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 2000,
      y: -1500,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: 0,
      level: 4,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 3000,
      y: 1000,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -2300,
      y: 3800,
      level: 3,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 5000,
      y: -1500,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
  ],
  TOKEN_MINT_END_TIMESTAMP: 1682435240778,
  INIT_PLANETS: [],
  WHITELIST: [],
  CONFIRM_START: true,
  TARGETS_REQUIRED_FOR_VICTORY: 1,
  BLOCK_CAPTURE: true,
  BLOCK_MOVES: true,
  TEAMS_ENABLED: false,
  NUM_TEAMS: 2,
  RANKED: false,
  RANGE_DOUBLING_SECS: 0,
};

const grandPrixWeek4: LobbyInitializers = {
  ADMIN_CAN_ADD_PLANETS: true,
  WORLD_RADIUS_LOCKED: false,
  WORLD_RADIUS_MIN: 5000,
  DISABLE_ZK_CHECKS: false,
  PLANETHASH_KEY: 8829,
  SPACETYPE_KEY: 8830,
  BIOMEBASE_KEY: 8831,
  PERLIN_LENGTH_SCALE: 2048,
  PERLIN_MIRROR_X: false,
  PERLIN_MIRROR_Y: true,
  MAX_NATURAL_PLANET_LEVEL: 3,
  TIME_FACTOR_HUNDREDTHS: 1300,
  PERLIN_THRESHOLD_1: 14,
  PERLIN_THRESHOLD_2: 15,
  PERLIN_THRESHOLD_3: 19,
  INIT_PERLIN_MIN: 0,
  INIT_PERLIN_MAX: 32,
  BIOME_THRESHOLD_1: 14,
  BIOME_THRESHOLD_2: 17,
  SILVER_SCORE_VALUE: 10,
  PLANET_LEVEL_THRESHOLDS: [16777216, 4194292, 1048561, 262128, 65520, 16368, 4080, 1008, 240, 48],
  PLANET_RARITY: 12000,
  PLANET_TRANSFER_ENABLED: true,
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
  ARTIFACT_POINT_VALUES: [0, 100000, 200000, 500000, 20000000, 50000000],
  SPACE_JUNK_ENABLED: true,
  SPACE_JUNK_LIMIT: 500,
  PLANET_LEVEL_JUNK: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  ABANDON_SPEED_CHANGE_PERCENT: 150,
  ABANDON_RANGE_CHANGE_PERCENT: 150,
  PHOTOID_ACTIVATION_DELAY: 60,
  SPAWN_RIM_AREA: 0,
  LOCATION_REVEAL_COOLDOWN: 10800,
  CAPTURE_ZONES_ENABLED: false,
  CAPTURE_ZONE_COUNT: 20,
  CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: 255,
  CAPTURE_ZONE_RADIUS: 1000,
  CAPTURE_ZONE_PLANET_LEVEL_SCORE: [
    0, 0, 250000, 500000, 750000, 1000000, 10000000, 20000000, 50000000, 100000000,
  ],
  CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: 2048,
  CAPTURE_ZONES_PER_5000_WORLD_RADIUS: 3,
  MANUAL_SPAWN: true,
  TARGET_PLANETS: true,
  CLAIM_VICTORY_ENERGY_PERCENT: 25,
  MODIFIERS: [100, 100, 100, 100, 100, 100, 100, 100],
  SPACESHIPS: [true, true, false, true, false],
  RANDOM_ARTIFACTS: false,
  NO_ADMIN: true,
  WHITELIST_ENABLED: false,
  START_PAUSED: false,
  ADMIN_PLANETS: [
    {
      x: -3000,
      y: 3000,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 3044,
      y: 2512,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: 4000,
      level: 3,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: 3000,
      y: 3000,
      level: 4,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -2931,
      y: 2646,
      level: 3,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -3139,
      y: 3533,
      level: 3,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: 1700,
      level: 4,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: -4500,
      level: 5,
      planetType: 4,
      isTargetPlanet: true,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
  ],
  TOKEN_MINT_END_TIMESTAMP: 1682435240778,
  INIT_PLANETS: [],
  WHITELIST: [],
  CONFIRM_START: true,
  TARGETS_REQUIRED_FOR_VICTORY: 1,
  BLOCK_CAPTURE: true,
  BLOCK_MOVES: true,
  TEAMS_ENABLED: false,
  NUM_TEAMS: 2,
  RANKED: false,
  RANGE_DOUBLING_SECS: 0,
};
// const competitive: LobbyInitializers = grandPrixWeek4;

const EloMap: LobbyInitializers = {
  ADMIN_CAN_ADD_PLANETS: true,
  WORLD_RADIUS_LOCKED: true,
  WORLD_RADIUS_MIN: 5000,
  DISABLE_ZK_CHECKS: false,
  PLANETHASH_KEY: 9070,
  SPACETYPE_KEY: 9071,
  BIOMEBASE_KEY: 9072,
  PERLIN_LENGTH_SCALE: 2048,
  PERLIN_MIRROR_X: true,
  PERLIN_MIRROR_Y: true,
  MAX_NATURAL_PLANET_LEVEL: 3,
  TIME_FACTOR_HUNDREDTHS: 1500,
  PERLIN_THRESHOLD_1: 11,
  PERLIN_THRESHOLD_2: 15,
  PERLIN_THRESHOLD_3: 19,
  INIT_PERLIN_MIN: 0,
  INIT_PERLIN_MAX: 32,
  BIOME_THRESHOLD_1: 14,
  BIOME_THRESHOLD_2: 17,
  SILVER_SCORE_VALUE: 10,
  PLANET_LEVEL_THRESHOLDS: [4194293, 4194292, 1048561, 262128, 65520, 16368, 4080, 1008, 240, 48],
  PLANET_RARITY: 7000,
  PLANET_TRANSFER_ENABLED: false,
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
  ARTIFACT_POINT_VALUES: [0, 100000, 200000, 500000, 20000000, 50000000],
  SPACE_JUNK_ENABLED: true,
  SPACE_JUNK_LIMIT: 1000,
  PLANET_LEVEL_JUNK: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  ABANDON_SPEED_CHANGE_PERCENT: 150,
  ABANDON_RANGE_CHANGE_PERCENT: 150,
  PHOTOID_ACTIVATION_DELAY: 60,
  SPAWN_RIM_AREA: 0,
  LOCATION_REVEAL_COOLDOWN: 10800,
  CAPTURE_ZONES_ENABLED: false,
  CAPTURE_ZONE_COUNT: 20,
  CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: 255,
  CAPTURE_ZONE_RADIUS: 1000,
  CAPTURE_ZONE_PLANET_LEVEL_SCORE: [
    0, 0, 250000, 500000, 750000, 1000000, 10000000, 20000000, 50000000, 100000000,
  ],
  CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: 2048,
  CAPTURE_ZONES_PER_5000_WORLD_RADIUS: 3,
  MANUAL_SPAWN: true,
  TARGET_PLANETS: true,
  CLAIM_VICTORY_ENERGY_PERCENT: 25,
  MODIFIERS: [100, 150, 100, 150, 75, 200, 100, 100],
  SPACESHIPS: [true, true, true, true, false],
  RANDOM_ARTIFACTS: false,
  NO_ADMIN: false,
  WHITELIST_ENABLED: false,
  START_PAUSED: false,
  ADMIN_PLANETS: [
    {
      x: -3000,
      y: 0,
      level: 5,
      planetType: 3,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 3000,
      y: 0,
      level: 5,
      planetType: 3,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: 1750,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: -1750,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 4500,
      y: 0,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -4500,
      y: 0,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -4250,
      y: 1000,
      level: 4,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -4250,
      y: -1000,
      level: 4,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 4250,
      y: -1000,
      level: 4,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 4250,
      y: 1000,
      level: 4,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 1500,
      y: -3000,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -1500,
      y: -3000,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -1500,
      y: 3000,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 1500,
      y: 3000,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 161,
      y: -117,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 61,
      y: -190,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -61,
      y: -190,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -161,
      y: -117,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -200,
      y: 0,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -161,
      y: 117,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -61,
      y: 190,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 61,
      y: 190,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 161,
      y: 117,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 200,
      y: 0,
      level: 3,
      planetType: 2,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 0,
      y: 0,
      level: 5,
      planetType: 3,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 1500,
      y: 0,
      level: 5,
      planetType: 4,
      isTargetPlanet: true,
      isSpawnPlanet: false,
      blockedPlanetLocs: [
        {
          x: 4000,
          y: 0,
        },
      ],
    },
    {
      x: -1500,
      y: 0,
      level: 5,
      planetType: 4,
      isTargetPlanet: true,
      isSpawnPlanet: false,
      blockedPlanetLocs: [
        {
          x: -4000,
          y: 0,
        },
      ],
    },
    {
      x: -4000,
      y: 0,
      level: 3,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: 4000,
      y: 0,
      level: 3,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
  ],
  TOKEN_MINT_END_TIMESTAMP: 1717258179,
  WHITELIST: [],
  CONFIRM_START: true,
  TARGETS_REQUIRED_FOR_VICTORY: 1,
  BLOCK_CAPTURE: false,
  BLOCK_MOVES: true,
  TEAMS_ENABLED: false,
  NUM_TEAMS: 2,
  RANKED: true,
  INIT_PLANETS: [],
  RANGE_DOUBLING_SECS: 0,
};

const grandPrixWeek5: LobbyInitializers = {
  ADMIN_CAN_ADD_PLANETS: true,
  WORLD_RADIUS_LOCKED: false,
  WORLD_RADIUS_MIN: 5000,
  DISABLE_ZK_CHECKS: false,
  PLANETHASH_KEY: 4273,
  SPACETYPE_KEY: 4274,
  BIOMEBASE_KEY: 4275,
  PERLIN_LENGTH_SCALE: 2048,
  PERLIN_MIRROR_X: true,
  PERLIN_MIRROR_Y: false,
  MAX_NATURAL_PLANET_LEVEL: 3,
  TIME_FACTOR_HUNDREDTHS: 1500,
  PERLIN_THRESHOLD_1: 14,
  PERLIN_THRESHOLD_2: 15,
  PERLIN_THRESHOLD_3: 19,
  INIT_PERLIN_MIN: 0,
  INIT_PERLIN_MAX: 32,
  BIOME_THRESHOLD_1: 14,
  BIOME_THRESHOLD_2: 17,
  SILVER_SCORE_VALUE: 10,
  PLANET_LEVEL_THRESHOLDS: [16777216, 4194292, 1048561, 262128, 65520, 16368, 4080, 1008, 240, 48],
  PLANET_RARITY: 12000,
  PLANET_TRANSFER_ENABLED: true,
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
  ARTIFACT_POINT_VALUES: [0, 100000, 200000, 500000, 20000000, 50000000],
  SPACE_JUNK_ENABLED: true,
  SPACE_JUNK_LIMIT: 500,
  PLANET_LEVEL_JUNK: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
  ABANDON_SPEED_CHANGE_PERCENT: 150,
  ABANDON_RANGE_CHANGE_PERCENT: 150,
  PHOTOID_ACTIVATION_DELAY: 60,
  SPAWN_RIM_AREA: 0,
  LOCATION_REVEAL_COOLDOWN: 10800,
  CAPTURE_ZONES_ENABLED: false,
  CAPTURE_ZONE_COUNT: 20,
  CAPTURE_ZONE_CHANGE_BLOCK_INTERVAL: 255,
  CAPTURE_ZONE_RADIUS: 1000,
  CAPTURE_ZONE_PLANET_LEVEL_SCORE: [
    0, 0, 250000, 500000, 750000, 1000000, 10000000, 20000000, 50000000, 100000000,
  ],
  CAPTURE_ZONE_HOLD_BLOCKS_REQUIRED: 2048,
  CAPTURE_ZONES_PER_5000_WORLD_RADIUS: 3,
  MANUAL_SPAWN: true,
  TARGET_PLANETS: true,
  CLAIM_VICTORY_ENERGY_PERCENT: 25,
  MODIFIERS: [100, 160, 100, 150, 100, 200, 100, 100],
  SPACESHIPS: [true, true, false, true, false],
  RANDOM_ARTIFACTS: false,
  NO_ADMIN: true,
  WHITELIST_ENABLED: false,
  START_PAUSED: false,
  INIT_PLANETS: [],
  ADMIN_PLANETS: [
    {
      x: 0,
      y: 0,
      level: 3,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: true,
      blockedPlanetLocs: [],
    },
    {
      x: -1050,
      y: 1200,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -1050,
      y: -1200,
      level: 4,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 475,
      y: -1400,
      level: 4,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 475,
      y: 1400,
      level: 4,
      planetType: 1,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: -2000,
      y: 0,
      level: 5,
      planetType: 0,
      isTargetPlanet: false,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
    {
      x: 4500,
      y: 0,
      level: 5,
      planetType: 4,
      isTargetPlanet: true,
      isSpawnPlanet: false,
      blockedPlanetLocs: [],
    },
  ],
  TOKEN_MINT_END_TIMESTAMP: 1682435240778,
  WHITELIST: [],
  CONFIRM_START: true,
  TARGETS_REQUIRED_FOR_VICTORY: 1,
  BLOCK_CAPTURE: false,
  BLOCK_MOVES: true,
  TEAMS_ENABLED: false,
  NUM_TEAMS: 2,
  RANKED: true,
  RANGE_DOUBLING_SECS: 0,
};

const competitive: LobbyInitializers = grandPrixWeek5;

export interface StockConfig {
  vanilla: LobbyInitializers;
  onePlayerRace: LobbyInitializers;
  fourPlayerBattle: LobbyInitializers;
  sprint: LobbyInitializers;
  competitive: LobbyInitializers;
  devOnePlayerRace: LobbyInitializers;
  devOnePlayerRaceB: LobbyInitializers;
  tutorial: LobbyInitializers;
}
export const stockConfig: StockConfig = {
  vanilla: vanilla,
  onePlayerRace: devOnePlayerRace,
  devOnePlayerRace: devOnePlayerRace,
  devOnePlayerRaceB: {
    ...devOnePlayerRace,
    TIME_FACTOR_HUNDREDTHS: 1500,
  },
  fourPlayerBattle: fourPlayerBattle,
  sprint: EloMap,
  competitive: EloMap,
  tutorial,
};
