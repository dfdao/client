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
} from '../../Frontend/Utils/constants';
import { getGraphQLData } from './GraphApi';
import { getAllTwitters } from './UtilityServerAPI';

export async function loadCompetitiveLeaderboard(
  config: string = competitiveConfig,
  isCompetitive: boolean
): Promise<Leaderboard> {
  const QUERY = `
query {
  arenas(first:1000, where: {configHash: "${config}", , gameOver: true}) {
    startTime
    winners(first :1) {
      address
      moves
   }
    endTime
    duration
  }
}
`;

  const rawData = await getGraphQLData(QUERY, apiUrl);

  if (rawData.error) {
    throw new Error(rawData.error);
  }

  const ret = await convertData(rawData.data.arenas, isCompetitive);

  return ret;
}

interface winners {
  address: string;
  moves: number;
}
interface graphArena {
  winners: winners[];
  creator: string;
  duration: number | null;
  endTime: number | null;
  startTime: number;
}

async function convertData(arenas: graphArena[], isCompetitive: boolean): Promise<Leaderboard> {
  let entries: LeaderboardEntry[] = [];
  const twitters = await getAllTwitters();

  const roundStart = new Date(roundStartTimestamp).getTime() / 1000;

  const roundEnd = new Date(roundEndTimestamp).getTime() / 1000;
  for (const arena of arenas) {
    if (
      !arena.endTime ||
      !arena.duration ||
      arena.startTime == 0 ||
      arena.winners.length == 0 ||
      !arena.winners[0].address || 
      isCompetitive && (roundEnd <= arena.endTime || roundStart >= arena.startTime) 
    )
      continue;

    const winnerAddress = address(arena.winners[0].address);
    const entry = entries.find((p) => winnerAddress == p.ethAddress);

    const score = Math.round(arena.duration * (1 + (arena.winners[0].moves / 1000))  * 100) / 100; // round to hundredths place
    console.log(`${winnerAddress}: ${arena.winners[0].moves} moves in ${arena.duration} seconds, score: ${score}`)

    if (!entry) {
      entries.push({
        ethAddress: winnerAddress,
        score: score,
        time: arena.duration,
        moves: arena.winners[0].moves,
        twitter: twitters[winnerAddress],
      });
    } else if (entry.score && entry.score > score) {
      entry.score = score;
      entry.moves = arena.winners[0].moves;
      entry.time = arena.duration;
    }
  }

  return { entries, length: arenas.length };
}
