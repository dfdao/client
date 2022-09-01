import { BadgeType, EthAddress, SeasonScore } from '@darkforest_eth/types';
import { SeasonLeaderboardEntry } from '../../../Backend/Network/GraphApi/SeasonLeaderboardApi';
import { SEASON_GRAND_PRIXS } from '../../Utils/constants';
import { SeasonHistoryItem } from './PortalHistoryView';

export function truncateAddress(address: EthAddress) {
  return address.substring(0, 6) + '...' + address.substring(36, 42);
}

export function truncateString(str: string, maxLength: number) {
  return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
}

export const mockBadges: BadgeType[] = [
  BadgeType.Tree,
  BadgeType.Wallbreaker,
  BadgeType.Nice,
  BadgeType.Sleepy,
  BadgeType.StartYourEngine,
];

export function createDummySeasonLeaderboardData(nEntries: number): SeasonLeaderboardEntry[] {
  let dummy: SeasonLeaderboardEntry[] = [];
  for (let i = 0; i < nEntries; i++) {
    const address = '0x' + Math.floor(Math.random() * Math.pow(10, 40)).toString(16);
    const entry: SeasonLeaderboardEntry = {
      address,
      games: [
        {
          id: '123',
          address: address,
          duration: Math.floor(Math.random() * 1000),
          moves: Math.floor(Math.random() * 1000),
          startTime: SEASON_GRAND_PRIXS[0].startTime,
          endTime: SEASON_GRAND_PRIXS[0].endTime,
          badges: [BadgeType.StartYourEngine, BadgeType.Wallbreaker],
          gamesStarted: Math.floor(Math.random() * 100),
          gamesFinished: Math.floor(Math.random() * 100),
          configHash: '0x' + Math.floor(Math.random() * 10000000000000000).toString(16),
          score: Math.floor(i * Math.random() * 1000),
        },
        {
          id: '123',
          address: address,
          duration: Math.floor(Math.random() * 1000),
          moves: Math.floor(Math.random() * 1000),
          startTime: SEASON_GRAND_PRIXS[0].startTime,
          endTime: SEASON_GRAND_PRIXS[0].endTime,
          badges: [BadgeType.StartYourEngine, BadgeType.Wallbreaker],
          gamesStarted: Math.floor(Math.random() * 100),
          gamesFinished: Math.floor(Math.random() * 100),
          configHash: '0x' + Math.floor(Math.random() * 10000000000000000).toString(16),
          score: Math.floor(i * Math.random() * 1000),
        },
        {
          id: '123',
          address: address,
          duration: Math.floor(Math.random() * 1000),
          moves: Math.floor(Math.random() * 1000),
          startTime: SEASON_GRAND_PRIXS[0].startTime,
          endTime: SEASON_GRAND_PRIXS[0].endTime,
          badges: [BadgeType.StartYourEngine, BadgeType.Wallbreaker],
          gamesStarted: Math.floor(Math.random() * 100),
          gamesFinished: Math.floor(Math.random() * 100),
          configHash: '0x' + Math.floor(Math.random() * 10000000000000000).toString(16),
          score: Math.floor(i * Math.random() * 1000),
        },
      ],
      score: Math.floor(i * Math.random() * 1000),
      badges: Math.floor(Math.random() * 1000),
    };
    dummy.push(entry);
  }
  return dummy;
}

export const DummySeasons: SeasonHistoryItem[] = [
  {
    seasonId: 1,
    rank: 5,
    players: 1000,
    grandPrixHistoryItems: [
      {
        configHash: '0xd08bbeb0785370a68369f0a042e33ef2688da6da5e79acbb5688ddbb8ca4a862',
        startTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        endTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.StartYourEngine, BadgeType.Tree],
      },
      {
        configHash: '0xd08bbeb0785370a68369f0a042e33ef2688da6da5e79acbb5688ddbb8ca4a862',
        startTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        endTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Nice, BadgeType.Wallbreaker],
      },
      {
        configHash: '0xd08bbeb0785370a68369f0a042e33ef2688da6da5e79acbb5688ddbb8ca4a862',
        startTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        endTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Nice, BadgeType.Wallbreaker],
      },
    ],
  },
  {
    seasonId: 2,
    rank: 5,
    players: 1000,
    grandPrixHistoryItems: [
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        endTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Tree, BadgeType.Nice],
      },
      {
        configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
        startTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        endTime: new Date('2022-07-13T00:00:00.000Z').getTime() / 1000,
        players: 1000,
        rank: 5,
        score: 10000,
        badges: [BadgeType.Nice, BadgeType.Nice],
      },
    ],
  },
];

// For now, just for season one.
// But later, you probably need this.
export function seasonScoreToSeasonHistoryItem(account: EthAddress, seasonScores: SeasonScore[]) {
  // Sort descending
  let rank = 0;

  seasonScores
    .sort((a, b) => b.score - a.score)
    .map((s, index) => {
      if (account && s.player == account) rank = index;
    });
  const history: SeasonHistoryItem = {
    seasonId: 1,
    grandPrixHistoryItems: [],
    rank,
    players: seasonScores.length,
  };
  return history;
}
