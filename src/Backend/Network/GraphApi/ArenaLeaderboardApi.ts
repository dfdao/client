import { EMPTY_ADDRESS } from '@darkforest_eth/constants';
import { address } from '@darkforest_eth/serde';
import {
  ArenaLeaderboard,
  ArenaLeaderboardEntry,
  Leaderboard,
  LeaderboardEntry,
} from '@darkforest_eth/types';
import {
  roundEndTimestamp,
  roundStartTimestamp,
  competitiveConfig,
  apiUrl,
  ARENA_V1_SUBGRAPH,
} from '../../Frontend/Utils/constants';
import { getGraphQLData } from '../GraphApi';
import { getAllTwitters } from '../UtilityServerAPI';

export async function loadArenaLeaderboard(
  config: string = competitiveConfig,
  isCompetitive: boolean
): Promise<Leaderboard> {
  console.log('CONFIG', config);
  const QUERY = `
query {
  arenas(first:1000, where: {configHash: "${config}"}) {
    id
    startTime
    winners(first :1) {
      address
      moves
   }
    gameOver
    endTime
    duration
  }
}
`;
  console.log('QUERY', QUERY);
  const rawData = await getGraphQLData(QUERY, apiUrl);
  const rawDataV1 = await getGraphQLData(QUERY, ARENA_V1_SUBGRAPH);

  if (rawData.error) {
    throw new Error(rawData.error);
  }
  if (rawDataV1.error) {
    throw new Error(rawDataV1.error);
  }

  // merge rawData.data.arenas and rawDataV1.data.arenas
  const merged = rawData.data.arenas.concat(rawDataV1.data.arenas);

  // const ret = await convertData(rawData.data.arenas, config == competitiveConfig);
  const ret = await convertData(merged, isCompetitive);

  return ret;
}

interface winners {
  address: string;
  moves: number;
}
export interface GraphArena {
  winners: winners[];
  creator: string;
  duration: number | null;
  endTime: number | null;
  gameOver: boolean;
  id: string;
  startTime: number;
  moves: number;
}

async function convertData(arenas: GraphArena[], isCompetitive: boolean): Promise<Leaderboard> {
  console.log('ARENAS', arenas);
  let entries: LeaderboardEntry[] = [];
  const twitters = await getAllTwitters();

  const roundStart = new Date(roundStartTimestamp).getTime() / 1000;

  const roundEnd = new Date(roundEndTimestamp).getTime() / 1000;
  for (const arena of arenas) {
    if (
      !arena.gameOver ||
      !arena.endTime ||
      !arena.duration ||
      arena.startTime == 0 ||
      arena.winners.length == 0 ||
      !arena.winners[0].address ||
      (isCompetitive && (roundEnd <= arena.endTime || roundStart >= arena.startTime))
    )
      continue;

    const winnerAddress = address(arena.winners[0].address);
    const entry = entries.find((p) => winnerAddress == p.ethAddress);

    if (!entry) {
      entries.push({
        ethAddress: winnerAddress,
        score: arena.duration,
        twitter: twitters[winnerAddress],
        moves: arena.winners[0].moves,
        startTime: arena.startTime,
        endTime: arena.endTime,
        time: arena.duration,
      });
    } else if (entry.score && entry.score > arena.duration) {
      entry.score = arena.duration;
    }
  }

  return { entries, length: arenas.length };
}
