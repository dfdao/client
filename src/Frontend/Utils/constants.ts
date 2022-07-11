import * as bigInt from 'big-integer';

// To developer, increase this number to 256. This, in combination with setting `DISABLE_ZK_CHECKS`
// in darkforest.toml, will make you mine the map at ULTRA SPEED!
// To code reviewer, make sure this does not change in a PR to develop!
const MIN_CHUNK_SIZE = 16;

/**
 * @tutorial to speed up the game's background rendering code, it is possible to set this value to
 * be a higher power of two. This means that smaller chunks will be merged into larger chunks via
 * the algorithms implemented in {@link ChunkUtils}.
 *
 * {@code Math.floor(Math.pow(2, 16))} should be large enough for most.
 */
const MAX_CHUNK_SIZE = 2 ** 14;

const LOCATION_ID_UB = bigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);

const apiUrl = 'http://localhost:8000/subgraphs/name/df' //'https://9a46-143-244-168-87.ngrok.io/subgraphs/name/df-arena-v2';

const competitiveConfig = '0xda4f1d3dd164e56d66f146827a08a7ffa6ae7844e49d51211ab9daf2c56483f5';

const roundStartTimestamp = '2022-06-25T00:00:00.000Z';

const roundEndTimestamp = '2022-06-28T00:00:00.000Z';

const bronzeTime = 4500; // 80 minutes in seconds

const silverTime = 3500; // 40 minutes in seconds

const goldTime = 2500; // 20 minutes in seconds

const OPTIMISM_GAS_LIMIT = 15000000

export {
  MIN_CHUNK_SIZE,
  MAX_CHUNK_SIZE,
  OPTIMISM_GAS_LIMIT,
  LOCATION_ID_UB,
  apiUrl,
  roundEndTimestamp,
  roundStartTimestamp,
  competitiveConfig,
  bronzeTime,
  silverTime,
  goldTime
};

export const enum DFZIndex {
  MenuBar = 4,
  HoverPlanet = 1001,
  Modal = 1001,
  Tooltip = 16000000,
  Notification = 1000,
}
