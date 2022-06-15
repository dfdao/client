import { THEGRAPH_API_URL } from '@darkforest_eth/constants';
import { ArenaLeaderboard, ArenaLeaderboardEntry } from '@darkforest_eth/types';
import { apiUrl } from '../../Frontend/Utils/constants';
import { getGraphQLData } from './GraphApi';
import { getAllTwitters } from './UtilityServerAPI';

const QUERY = `
query {
  arenaPlayers(first: 1000) {
    address
    winner
  }
}
`;

const API_URL_GRAPH = 'https://graph-optimism.gnosischain.com/subgraphs/name/arena/test';

export async function loadArenaLeaderboard(): Promise<ArenaLeaderboard> {
  const rawData = await getGraphQLData(QUERY, apiUrl);

  if (rawData.error) {
    throw new Error(rawData.error);
  }

  const ret = await convertData(rawData.data.arenas);

  return ret;
}

interface graphPlayer {
  address: string;
  winner: boolean;
}

async function convertData(inputPlayers: graphPlayer[]): Promise<ArenaLeaderboard> {
  let players: ArenaLeaderboardEntry[] = [];
  const twitters = await getAllTwitters();

  for (const player of inputPlayers) {
    const entry = players.find((p) => player.address == p.address);
    if (!!entry) {
      entry.games++;
      if (player.winner) entry.wins++;
    } else {
      players.push({
        address: player.address,
        games: 1,
        wins: player.winner ? 1 : 0,
        twitter: twitters[player.address],
      });
    }
  }

  return { entries: players } as ArenaLeaderboard;
}
