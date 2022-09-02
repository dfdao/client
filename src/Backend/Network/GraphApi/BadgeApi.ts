import { address } from '@darkforest_eth/serde';
import {
  BadgeSet,
  BadgeType,
  ConfigBadge,
  GrandPrixBadge,
} from '@darkforest_eth/types';
import { SEASON_GRAND_PRIXS } from '../../../Frontend/Utils/constants';
import { getGraphQLData } from '../GraphApi';

// Given a season, get all badges won by all Players
export function graphBadgeToGrandPrixBadge(
  graphBadge: BadgeSet,
  configHash: string
): ConfigBadge[] {
  const badges: BadgeType[] = [];

  if (graphBadge.startYourEngine) badges.push(BadgeType.StartYourEngine);
  if (graphBadge.nice) badges.push(BadgeType.Nice);
  if (graphBadge.ouch) badges.push(BadgeType.Sleepy);
  if (graphBadge.based) badges.push(BadgeType.Tree);
  if (graphBadge.wallBreaker) badges.push(BadgeType.Wallbreaker);

  return badges.map((badge) => {
    return {
      type: badge,
      configHash,
    };
  });
}

export function getBadges(configHash: string, configBadges: BadgeSet[]): ConfigBadge[] {
  return configBadges.map((configBadge) => graphBadgeToGrandPrixBadge(configBadge,configHash)).flat();
}
