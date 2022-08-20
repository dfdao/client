import { address } from '@darkforest_eth/serde';
import {
  BadgeSet,
  BadgeType,
  ConfigPlayer,
  GrandPrixResult,
  Leaderboard,
  LeaderboardEntry,
  SeasonPlayers,
  SeasonScore,
  Wallbreaker,
  WallbreakerArena,
} from '@darkforest_eth/types';
import {
  roundEndTimestamp,
  roundStartTimestamp,
  competitiveConfig,
  SEASON_GRAND_PRIXS,
  DAY_IN_SECONDS,
  START_ENGINE_BONUS,
  WALLBREAKER_BONUS,
  GrandPrixMetadata,
} from '../../../Frontend/Utils/constants';
import { getGraphQLData } from '../GraphApi';
import { getAllTwitters } from '../UtilityServerAPI';

export async function loadWallbreakers(): Promise<Wallbreaker[]> {
  const wallbreakerQuery = SEASON_GRAND_PRIXS.map((grandPrix) => {
    const QUERY = `
    query
    {
      arenas(
        where: {
          configHash: "${grandPrix.configHash}", 
          duration_not:null,
          startTime_gte: ${grandPrix.startTime}
          endTime_lte: ${grandPrix.endTime}
        }
        orderBy: duration
        orderDirection: asc
        first: 1
      ) {
        configHash
        lobbyAddress
        winners {
          address
        }
        duration
      }
    }
    `;
    return getGraphQLData(QUERY, process.env.GRAPH_URL || 'localhost:8000');
  });

  const wallBreakersRaw = (await Promise.all(wallbreakerQuery)).map((x) => {
    if (x.error) {
      throw new Error(x.error);
    } else {
      return x.data.arenas[0] as WallbreakerArena;
    }
  });

  const wallBreakers = wallBreakersRaw.map((wbr) => {
    return {
      configHash: wbr.configHash,
      player: wbr.winners[0].address,
      duration: wbr.duration,
      arenaAddress: wbr.lobbyAddress,
    } as Wallbreaker;
  });

  return wallBreakers;
}

// Returns all the ConfigPlayers for each Grand Prix, including the Wallbreaker.
// It calls loadWallbreakers() internally.
export async function loadAllPlayerData(): Promise<ConfigPlayer[]> {
  const stringHashes = SEASON_GRAND_PRIXS.map((season) => `"${season.configHash}"`);
  // Query size is number of unique players on each Grand Prix in a season. (6 GPs * 100 players = 100 results).
  // If > 1000, graph won't return.
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
      gamesFinished
      bestTime {
        winners(first:1) {
          moves
        }
        duration
        startTime
        endTime
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
  const rawData = await getGraphQLData(QUERY, process.env.GRAPH_URL || 'localhost:8000');
  if (rawData.error) {
    throw new Error(rawData.error);
  }
  console.log(`configPlayers`, rawData.data.configPlayers);
  if (!rawData.data.configPlayers)
    throw new Error(`config players undefined. Make sure query is correct`);

  const configPlayersFinal = await addWallbreakers(rawData.data.configPlayers);
  console.log(configPlayersFinal);
  return configPlayersFinal;
}

// Map reduce to get the season score for each player
export function loadSeasonLeaderboard(configPlayers: ConfigPlayer[]): SeasonScore[] {
  const seasonPlayers = groupPlayers(configPlayers);
  const seasonScores = getSeasonScore(seasonPlayers);
  return seasonScores;
}

// Filter to get all Config Players for a single Grand Prix
// Can be used for badges
export function loadGrandPrixPlayers(configPlayers: ConfigPlayer[], configHash: string) {
  const grandPrixScores = configPlayers
    .filter((cp) => cp.configHash == configHash)
    .sort((a, b) => a.bestTime.duration - b.bestTime.duration);
  return grandPrixScores;
}

// Assumes configPlayers have same configHash
export async function configPlayersToLeaderboard(
  configPlayers: ConfigPlayer[]
) {
  let entries: LeaderboardEntry[] = [];
  const twitters = await getAllTwitters();

  // Just show wallBreaker badge in client.
  let numMatches = 0;
  configPlayers.map((cp) => {
    numMatches += cp.gamesFinished;
    entries.push({
      ethAddress: address(cp.address),
      score: undefined,
      twitter: twitters[cp.address],
      moves: cp.bestTime.winners[0].moves,
      startTime: cp.bestTime.startTime,
      endTime: cp.bestTime.endTime,
      time: cp.bestTime.duration,
    });
  });

  return { entries, length: numMatches } as Leaderboard;
}

// Get a single player's Season data. Best Grand Prix results and badges.
export function loadSeasonPlayer(playerId: string, configPlayers: ConfigPlayer[]): ConfigPlayer[] {
  return configPlayers.filter(cp => cp.address === playerId);
}

export async function loadGrandPrixLeaderboard(configPlayers: ConfigPlayer[], configHash: string) {
  const players = await loadGrandPrixPlayers(configPlayers, configHash);
  const leaderboard = await configPlayersToLeaderboard(players);
  return leaderboard
}

// Add wallbreaker badge to ConfigPlayers
async function addWallbreakers(configPlayers: ConfigPlayer[]): Promise<ConfigPlayer[]> {
  const wallBreakers = await loadWallbreakers();
  return configPlayers.map((cfp) => {
    const isWallBreaker = wallBreakers.filter((e) => e.player === cfp.address).length > 0;
    if (isWallBreaker) cfp.badge.wallBreaker = true;
    return cfp;
  });
}

// Group ConfigPlayers by address to calculate Season Score
function groupPlayers(configPlayers: ConfigPlayer[]): SeasonPlayers {
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
// Sum player dictionary to create list of {player, score}
function getSeasonScore(seasonPlayers: SeasonPlayers): SeasonScore[] {
  const seasonScores: SeasonScore[] = [];
  for (const [player, grandPrixResults] of Object.entries(seasonPlayers)) {
    const seasonScore: SeasonScore = {
      player,
      score: grandPrixResults
        .map((result) => calcGrandPrixScore(result))
        .reduce((prev, curr) => prev + curr),
    };
    seasonScores.push(seasonScore);
  }
  return seasonScores;
}

/**
 * Utils to calculate scores
 */
export function calcBadgeScore(badges: BadgeSet): number {
  let badgeScore = 0;
  badgeScore += badges.startYourEngine ? START_ENGINE_BONUS : 0;
  badgeScore += badges.wallBreaker ? WALLBREAKER_BONUS : 0;
  return badgeScore;
}

export function calcGrandPrixScore(grandPrixResult: GrandPrixResult): number {
  const timeScore = DAY_IN_SECONDS - grandPrixResult.bestTime;
  return timeScore + calcBadgeScore(grandPrixResult.badges);
}



