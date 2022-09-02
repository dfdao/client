import { address } from '@darkforest_eth/serde';
import {
  BadgeSet,
  BadgeType,
  CleanConfigPlayer,
  ConfigBadge,
  ConfigPlayer,
  EthAddress,
  GrandPrixHistory,
  GrandPrixMetadata,
  GrandPrixPlayers,
  GrandPrixResult,
  Leaderboard,
  LeaderboardEntry,
  SeasonBadge,
  SeasonHistory,
  SeasonPlayers,
  SeasonScore,
  Wallbreaker,
  WallbreakerArena,
} from '@darkforest_eth/types';
import { UniquePlayerBadges } from '@darkforest_eth/types/src/grand_prix';
import {
  SEASON_GRAND_PRIXS,
  DAY_IN_SECONDS,
  START_ENGINE_BONUS,
  WALLBREAKER_BONUS,
  EGP,
  DUMMY,
  NICE_BONUS,
  TREE_BONUS,
  SLEEPY_BONUS,
} from '../../../Frontend/Utils/constants';
import { createDummySeasonData } from '../../../Frontend/Views/Portal/PortalUtils';
import { AddressTwitterMap } from '../../../_types/darkforest/api/UtilityServerAPITypes';
import { getGraphQLData } from '../GraphApi';
import { getAllTwitters } from '../UtilityServerAPI';
import { graphBadgeToGrandPrixBadge } from './BadgeApi';

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
      console.log(x);
      return x.data.arenas[0] as WallbreakerArena;
    }
  });

  // Filter undefined because graph returns [undefined] if query isn't found
  const wallBreakers = wallBreakersRaw
    .filter((wbr) => wbr !== undefined)
    .map((wbr) => {
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
export async function loadAllPlayerData(): Promise<CleanConfigPlayer[]> {
  console.log(`loading player data...`);
  if (DUMMY) return createDummySeasonData(200);
  if (!EGP) return [];
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
  if (!rawData.data) {
    throw new Error(`rawData.data undefined. Make sure query is correct`);
  }
  if (!rawData.data.configPlayers)
    throw new Error(`config players undefined. Make sure query is correct`);

  const configPlayersFinal = await addWallbreakersAndBadges(rawData.data.configPlayers);
  return configPlayersFinal;
}

// Grand Prixs for each player in the given season, grouped by player.
export function loadSeasonPlayers(
  configPlayers: CleanConfigPlayer[],
  seasonId: number
): SeasonPlayers {
  const seasonConfigHashes = SEASON_GRAND_PRIXS.filter((s) => s.seasonId == seasonId).map((s) =>
    s.configHash.toLowerCase()
  );
  const seasonConfigPlayers = configPlayers.filter((cp) =>
    seasonConfigHashes.includes(cp.configHash.toLowerCase())
  );
  const seasonPlayers = groupByPlayers(seasonConfigPlayers);
  return seasonPlayers;
}

export interface SeasonLeaderboardEntry {
  address: string;
  games: CleanConfigPlayer[];
  score: number;
  badges: number;
}

export interface SeasonLeaderboardProps {
  seasonId: number;
  entries: SeasonLeaderboardEntry[];
}

// Called after seasonPlayers are filtered for the given season.
export function loadSeasonLeaderboard(
  configPlayers: CleanConfigPlayer[],
  seasonId: number
): SeasonLeaderboardProps {
  const seasonPlayers = loadSeasonPlayers(configPlayers, seasonId);
  const leaderboardProps: SeasonLeaderboardProps = {
    seasonId,
    entries: [],
  };

  for (const [player, cleanConfigPlayers] of Object.entries(seasonPlayers)) {
    const { score, badges } = cleanConfigPlayers
      .map((ccp) => {
        return { score: ccp.score, badges: ccp.badges.length };
      })
      .reduce((a, b) => {
        return { score: a.score + b.score, badges: a.badges + b.badges };
      });
    const entry: SeasonLeaderboardEntry = {
      address: player,
      games: cleanConfigPlayers,
      score,
      badges,
    };
    leaderboardProps.entries.push(entry);
  }
  return leaderboardProps;
}

// Filter to get all Config Players for a single Grand Prix
// Can be used for badges
export function loadGrandPrixPlayers(configPlayers: CleanConfigPlayer[], configHash: string) {
  const grandPrixScores = configPlayers
    .filter((cp) => cp.configHash == configHash)
    .sort((a, b) => a.duration - b.duration);
  return grandPrixScores;
}

// Assumes configPlayers have same configHash
export function configPlayersToLeaderboard(
  configPlayers: CleanConfigPlayer[],
  twitters?: AddressTwitterMap
) {
  let entries: LeaderboardEntry[] = [];

  // Just show wallBreaker badge in client.
  let numMatches = 0;
  configPlayers.map((cp) => {
    numMatches += cp.gamesFinished;
    entries.push({
      ethAddress: address(cp.address),
      score: calcCleanGrandPrixScore(cp),
      twitter: twitters?.[cp.address],
      moves: cp.moves,
      startTime: cp.startTime,
      endTime: cp.endTime,
      time: cp.duration,
    });
  });

  return { entries, length: numMatches } as Leaderboard;
}

// Get a single player's Season data. Best Grand Prix results and badges.
export function loadSeasonPlayer(playerId: string, configPlayers: ConfigPlayer[]): ConfigPlayer[] {
  return configPlayers.filter((cp) => cp.address === playerId);
}

export function loadGrandPrixLeaderboard(
  configPlayers: CleanConfigPlayer[],
  configHash: string,
  twitters?: AddressTwitterMap
) {
  const players = loadGrandPrixPlayers(configPlayers, configHash);
  const leaderboard = configPlayersToLeaderboard(players, twitters);
  return leaderboard;
}

// Add wallbreaker badge to ConfigPlayers
async function addWallbreakersAndBadges(
  configPlayers: ConfigPlayer[]
): Promise<CleanConfigPlayer[]> {
  const wallBreakers = await loadWallbreakers();
  return configPlayers.map((cfp) => {
    const isWallBreaker =
      wallBreakers.length > 0 && wallBreakers.filter((e) => e.player === cfp.address).length > 0;
    if (isWallBreaker) cfp.badge.wallBreaker = true;
    const cleanConfig: CleanConfigPlayer = {
      id: cfp.id,
      address: cfp.address,
      duration: cfp.bestTime.duration,
      moves: cfp.bestTime.winners[0].moves,
      startTime: cfp.bestTime.startTime,
      endTime: cfp.bestTime.endTime,
      badges: graphBadgeToGrandPrixBadge(cfp.badge, cfp.configHash),
      configHash: cfp.configHash,
      gamesStarted: cfp.gamesStarted,
      gamesFinished: cfp.gamesFinished,
      score: calcGrandPrixScore(cfp),
    };
    return cleanConfig;
  });
}

// Group ConfigPlayers by address to calculate Season Score
export function groupByPlayers(configPlayers: CleanConfigPlayer[]): SeasonPlayers {
  const seasonPlayers: SeasonPlayers = {};
  configPlayers.map((cp) => {
    if (!seasonPlayers[cp.address]) seasonPlayers[cp.address] = [];
    seasonPlayers[cp.address].push(cp);
  });
  return seasonPlayers;
}

// Sum player dictionary to create list of {player, score}
export function getSeasonScore(seasonPlayers: SeasonPlayers): SeasonScore[] {
  const seasonScores: SeasonScore[] = [];
  for (const [player, cleanConfigPlayer] of Object.entries(seasonPlayers)) {
    const badges: ConfigBadge[] = [];
    const seasonScore: SeasonScore = {
      player,
      score: cleanConfigPlayer
        .map((result) => {
          badges.concat(result.badges);
          return calcCleanGrandPrixScore(result);
        })
        .reduce((prev, curr) => prev + curr),
    };
    seasonScore.score += calcBadgeTypeScore(badges.map((b) => b.type));
    seasonScores.push(seasonScore);
  }
  return seasonScores;
}
function groupByGrandPrix(configPlayers: CleanConfigPlayer[] | undefined): GrandPrixPlayers {
  if (!configPlayers) return {};

  const seasonPlayers: GrandPrixPlayers = {};
  configPlayers.map((cp) => {
    if (!seasonPlayers[cp.configHash]) seasonPlayers[cp.configHash] = [];
    seasonPlayers[cp.configHash].push(cp);
  });
  return seasonPlayers;
}

export interface Seasons {
  [id: number]: GrandPrixMetadata[];
}

function groupBySeason(grandPrixs: GrandPrixMetadata[]): Seasons {
  const seasons: Seasons = {};
  grandPrixs.map((gp) => {
    if (!seasons[gp.seasonId]) seasons[gp.seasonId] = [];
    seasons[gp.seasonId].push(gp);
  });
  return seasons;
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

export function calcBadgeTypeScore(badges: BadgeType[]): number {
  let badgeScore = 0;
  if (badges.includes(BadgeType.StartYourEngine)) badgeScore += START_ENGINE_BONUS;
  if (badges.includes(BadgeType.Nice)) badgeScore += NICE_BONUS;
  if (badges.includes(BadgeType.Tree)) badgeScore += TREE_BONUS;
  if (badges.includes(BadgeType.Sleepy)) badgeScore += SLEEPY_BONUS;

  return badgeScore;
}

// Doesn't include badges. Badges just add season points.
export function calcCleanGrandPrixScore(cleanConfigPlayer: CleanConfigPlayer): number {
  return DAY_IN_SECONDS - cleanConfigPlayer.duration;
}

export function calcGrandPrixScore(configPlayer: ConfigPlayer): number {
  const timeScore = DAY_IN_SECONDS - configPlayer.bestTime.duration;
  return timeScore + calcBadgeScore(configPlayer.badge);
}

/**
 * Big daddy score calculation
 */
export function loadPlayerSeasonHistoryView(
  player: EthAddress,
  configPlayers: CleanConfigPlayer[]
): SeasonHistory[] {
  const seasonHistories: SeasonHistory[] = [];

  const playerExists = configPlayers.find((cp) => cp.address == player);
  if (!playerExists) return [];

  // Get Season Rank and Score.
  // Need to handle multiple seasons.

  // Loops over all official Grand Prixs
  const seasons = groupBySeason(SEASON_GRAND_PRIXS);

  // For each Season, get required data.
  for (const [key, value] of Object.entries(seasons)) {
    const grandPrixs = value as GrandPrixMetadata[];

    // Calculate Player's Season Aggregate Statistics
    const seasonId = parseInt(key);
    let rank = 0;
    let score = 0;
    const seasonScores = getSeasonScore(loadSeasonPlayers(configPlayers, seasonId));
    seasonScores
      .sort((a, b) => b.score - a.score)
      .map((s, index) => {
        if (s.player == player) {
          rank = index + 1;
          score = s.score;
        }
      });

    const seasonHistory: SeasonHistory = {
      seasonId,
      rank,
      score,
      players: seasonScores.length,
      grandPrixs: [],
    };

    const grandPrixHistories: GrandPrixHistory[] = [];

    // Calculate Grand prix aggregate statistics
    grandPrixs.map((gp) => {
      const allGrandPrixs = groupByGrandPrix(configPlayers)[gp.configHash];
      let rank = 0;
      let score = 0;
      if (allGrandPrixs && allGrandPrixs.length > 0) {
        allGrandPrixs
          .sort((a, b) => b.score - a.score)
          .map((s, index) => {
            if (s.address == player) {
              rank = index + 1;
              score = s.score;
            }
          });
        const playerGrandPrixs = groupByPlayers(configPlayers)[player].filter(
          (cp) => cp.configHash == gp.configHash
        )[0];

        const grandPrixHistory: GrandPrixHistory = {
          configHash: gp.configHash,
          rank,
          score,
          players: allGrandPrixs.length,
          badges: playerGrandPrixs.badges,
        };

        grandPrixHistories.push(grandPrixHistory);
      }
    });

    seasonHistory.grandPrixs = grandPrixHistories;
    seasonHistories.push(seasonHistory);
  }
  return seasonHistories;
}

export function getBadges(configBadges: BadgeType[][]): BadgeType[] {
  return configBadges.map((configBadge) => configBadge).flat();
}

// Output: object of player address => unique season badges
export function loadUniquePlayerBadges(configPlayers: CleanConfigPlayer[], seasonId: number) {
  const seasonPlayers = loadSeasonPlayers(configPlayers, seasonId);
  const res: { [player: string]: ConfigBadge[] } = {};
  for (const [player, playerGrandPrixs] of Object.entries(seasonPlayers)) {
    const allBadges = playerGrandPrixs.map((pgp) => pgp.badges).flat();
    const uniqueBadgeSet: UniquePlayerBadges = {};
    allBadges.forEach((cb) => {
      uniqueBadgeSet[cb.type] = cb;
    });

    const uniques = Object.values(uniqueBadgeSet) as ConfigBadge[];
    res[player] = uniques;
  }
  return res;
}
