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

const testData: { data: { configPlayers: GraphConfigPlayer[] }; error: undefined } = {
  data: {
    configPlayers: [
      {
        address: '0x9ceb592706faf42dc2299d9089fca49c8f35de60',
        elo: 1400,
        wins: 14,
        losses: 2
      },
      {
        address: '0x74f511484aC94B24b4d73C0089B7B782202EEA53',
        elo: 400,
        wins: 2,
        losses: 14
      },
    ],
  },
  error: undefined,
};

export async function loadEloLeaderboard(
  config: string = competitiveConfig,
  isCompetitive: boolean
): Promise<GraphConfigPlayer[]> {
  const QUERY = `
    query {
        configPlayers(first:1000, where: {configHash: "${config}"}) {
            address,
            elo,
        }
    }
    `;

  const rawData = await getGraphQLData(QUERY, apiUrl);
  // const rawData = testData;
  // console.log('data:', rawData.data);

  if (rawData.error) {
    throw new Error(rawData.error);
  }

  return rawData.data.configPlayers;
}

export interface GraphConfigPlayer {
  address: string;
  elo: number;
  wins: number;
  losses: number;
}