import { address } from '@darkforest_eth/serde';
import { Leaderboard, LeaderboardEntry } from '@darkforest_eth/types';
import {
  roundEndTimestamp,
  roundStartTimestamp,
  competitiveConfig,
} from '../../../Frontend/Utils/constants';
import { getGraphQLData } from '../GraphApi';
import { getAllTwitters } from '../UtilityServerAPI';

const HASHES = [
  '0xe8c09c646e1c9228918754437a7130a30e4837b21689b51dfd67a8ecf55ebd6e',
  '0x88f6a4430a1723523d420e1320599408c4627e573debe7dd96897c9736d739d0',
];

const DAY_IN_SECONDS = 24*60*60;

export async function loadSeasonLeaderboard(): Promise<void> {
  const stringHashes = HASHES.map((h) => `"${h}"`);
  const QUERY = `
query
  {
    configPlayers(
      where: {
        configHash_in: [${stringHashes}],
        bestTime_:{gameOver: true}
      }
    ) {
      id
      address
      gamesStarted
      bestTime {
        winners(first:1) {
          moves
        }
        duration
      }
      configHash
      badge {
        based
        ouch
        startYourEngine
        nice
      }
    }
  }
`;
  console.log(`season query`, QUERY);
  const rawData = await getGraphQLData(QUERY, process.env.GRAPH_URL || 'localhost:8000');
  console.log(rawData);
  if (rawData.error) {
    throw new Error(rawData.error);
  }
  const seasonPlayers = groupPlayers(rawData.data.configPlayers);
  const seasonScores = getSeasonScore(seasonPlayers);

  // console.log(ret);
  //return ret;
}
export interface BadgeSet {
  startYourEngine: boolean;
  nice: boolean;
  based: boolean;
  ouch: boolean;
}

export interface GrandPrixResult {
  bestTime: number;
  moves: number;
  badges: BadgeSet;
}

export interface ConfigPlayer {
  id: string;
  address: string;
  bestTime: {
    duration: number;
    winners: {
      moves: number;
    }[];
  };
  badge: BadgeSet;
  configHash: string;
  gamesStarted: number;
}

export interface SeasonPlayers {
  [address: string]: GrandPrixResult[];
}

export interface SeasonScore {
  player: string;
  score: number;
}

function groupPlayers(configPlayers: ConfigPlayer[]): SeasonPlayers {
  console.log(configPlayers);
  const seasonPlayers: SeasonPlayers = {};
  configPlayers.map((cp) => {
    if (!seasonPlayers[cp.address]) seasonPlayers[cp.address] = [];

    const grandPrixResult: GrandPrixResult = {
      bestTime: cp.bestTime.duration,
      moves: cp.bestTime.winners[0].moves,
      badges: cp.badge,
    };
    seasonPlayers[cp.address].push(grandPrixResult);
  });
  return seasonPlayers;
}

function calcSeasonScore(grandPrixResult: GrandPrixResult): number {
  const timeScore = DAY_IN_SECONDS - grandPrixResult.bestTime;
  const badgeScore = grandPrixResult.badges.startYourEngine ? 100 : 0
  return timeScore + badgeScore;
}

function getSeasonScore(seasonPlayers: SeasonPlayers): SeasonScore[] {
  const seasonScores: SeasonScore[] = [];
  for (const [player, grandPrixResults] of Object.entries(seasonPlayers)) {
    const seasonScore: SeasonScore = {
      player,
      score: grandPrixResults.map(result => calcSeasonScore(result)).reduce((prev,curr) => prev + curr)
    };
    seasonScores.push(seasonScore)
  }
  console.log(`season Scores`, seasonScores);
  return seasonScores;
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
        score: undefined,
        twitter: twitters[winnerAddress],
        moves: arena.winners[0].moves,
        startTime: arena.startTime,
        endTime: arena.endTime,
        time: arena.duration,
      });
    } else if (entry.time && entry.time > arena.duration) {
      entry.time = arena.duration;
    }
  }

  return { entries, length: arenas.length };
}
