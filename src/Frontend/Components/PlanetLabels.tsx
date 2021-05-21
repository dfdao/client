import React, { useMemo } from 'react';
import {
  Biome,
  BiomeNames,
  LocatablePlanet,
  Planet,
  PlanetType,
  PlanetTypeNames,
} from '@darkforest_eth/types';
import { formatNumber, getPlanetRank } from '../../Backend/Utils/Utils';
import { Colored, Sub, White } from './Text';
import styled from 'styled-components';
import { ProcgenUtils } from '../../Backend/Procedural/ProcgenUtils';
import { isLocatable } from '../../_types/global/GlobalTypes';
import { SpacetimeRipLabel } from './SpacetimeRipLabel';
import { EMPTY_ADDRESS } from '@darkforest_eth/constants';
import { useAccount, useUIManager } from '../Utils/AppHooks';
import { TextPreview } from './TextPreview';
import dfstyles from '../Styles/dfstyles';
import { BiomeTextColors } from '../Styles/PlanetStyles';
import { shakeAnim, burnAnim, icyAnim } from './BiomeAnims';
import { LavaLabel } from './LavaLabel';

/* note that we generally prefer `Planet | undefined` over `Planet` because it
   makes it easier to pass in selected / hovering planet from the emitters      */

/* stat stuff */

export function StatText({
  planet,
  getStat,
}: {
  planet: Planet | undefined;
  getStat: (p: Planet) => number;
}) {
  return <>{planet ? formatNumber(getStat(planet)) : 'n/a'}</>;
}

const getSilver = (p: Planet) => p.silver;
export const SilverText = ({ planet }: { planet: Planet | undefined }) => (
  <StatText planet={planet} getStat={getSilver} />
);

const getSilverCap = (p: Planet) => p.silverCap;
export const SilverCapText = ({ planet }: { planet: Planet | undefined }) => (
  <StatText planet={planet} getStat={getSilverCap} />
);

const getEnergy = (p: Planet) => p.energy;
export const EnergyText = ({ planet }: { planet: Planet | undefined }) => (
  <StatText planet={planet} getStat={getEnergy} />
);

const getEnergyCap = (p: Planet) => p.energyCap;
export const EnergyCapText = ({ planet }: { planet: Planet | undefined }) => (
  <StatText planet={planet} getStat={getEnergyCap} />
);

export function EnergyLabel({ planet }: { planet: Planet | undefined }) {
  return (
    <span>
      <EnergyText planet={planet} /> <Sub>/</Sub> <EnergyCapText planet={planet} />
    </span>
  );
}

export function SilverLabel({ planet }: { planet: Planet | undefined }) {
  return (
    <span>
      <SilverText planet={planet} /> <Sub>/</Sub> <SilverCapText planet={planet} />
    </span>
  );
}

const getDefense = (p: Planet) => p.defense;
export const DefenseText = ({ planet }: { planet: Planet | undefined }) => (
  <StatText planet={planet} getStat={getDefense} />
);

const getRange = (p: Planet) => p.range;
export const RangeText = ({ planet }: { planet: Planet | undefined }) => (
  <StatText planet={planet} getStat={getRange} />
);

const getSpeed = (p: Planet) => p.speed;
export const SpeedText = ({ planet }: { planet: Planet | undefined }) => (
  <StatText planet={planet} getStat={getSpeed} />
);

const getEnergyGrowth = (p: Planet) => p.energyGrowth;
export const EnergyGrowthText = ({ planet }: { planet: Planet | undefined }) => (
  <StatText planet={planet} getStat={getEnergyGrowth} />
);

const getSilverGrowth = (p: Planet) => p.silverGrowth;
export const SilverGrowthText = ({ planet }: { planet: Planet | undefined }) => (
  <StatText planet={planet} getStat={getSilverGrowth} />
);

// level and rank stuff
export const PlanetLevelText = ({ planet }: { planet: Planet | undefined }) =>
  planet ? <>Level {planet.planetLevel}</> : <></>;

export const PlanetRankText = ({ planet }: { planet: Planet | undefined }) =>
  planet ? <>Rank {getPlanetRank(planet)}</> : <></>;

export const LevelRankText = ({
  planet,
  delim,
}: {
  planet: Planet | undefined;
  delim?: string;
}) => (
  <>
    <PlanetLevelText planet={planet} />
    {delim || ', '}
    <PlanetRankText planet={planet} />
  </>
);

export const LevelRankTextEm = ({
  planet,
  delim,
}: {
  planet: Planet | undefined;
  delim?: string;
}) =>
  planet ? (
    <Sub>
      Level <White>{planet.planetLevel}</White>
      {delim || ', '}
      Rank <White>{getPlanetRank(planet)}</White>
    </Sub>
  ) : (
    <></>
  );

/* biome stuff */

const StyledBiomeLabel = styled.span<{ biome: Biome }>`
  ${({ biome }) => biome === Biome.CORRUPTED && shakeAnim};
  ${({ biome }) => biome === Biome.WASTELAND && burnAnim};
  ${({ biome }) => biome === Biome.ICE && icyAnim};

  color: ${({ biome }) => BiomeTextColors[biome]};
`;

export const BiomeLabel = ({ planet }: { planet: LocatablePlanet }) =>
  planet.biome === Biome.LAVA ? (
    <LavaLabel />
  ) : (
    <StyledBiomeLabel biome={planet.biome}>{BiomeNames[planet.biome]}</StyledBiomeLabel>
  );

export const OptionalBiomeLabel = ({ planet }: { planet: Planet | undefined }) => (
  <>{planet && isLocatable(planet) && <BiomeLabel planet={planet} />}</>
);

export const PlanetTypeLabel = ({ planet }: { planet: Planet | undefined }) => (
  <>
    {planet &&
      (planet.planetType === PlanetType.TRADING_POST ? (
        <SpacetimeRipLabel />
      ) : (
        PlanetTypeNames[planet.planetType]
      ))}
  </>
);

export const PlanetBiomeTypeLabel = ({ planet }: { planet: Planet | undefined }) => (
  <>
    {planet?.planetType !== PlanetType.TRADING_POST && (
      <>
        <OptionalBiomeLabel planet={planet} />{' '}
      </>
    )}
    <PlanetTypeLabel planet={planet} />
  </>
);

export function PlanetOwnerLabel({
  planet,
  showYours,
  color,
}: {
  planet: Planet | undefined;
  showYours?: boolean;
  color?: boolean;
}) {
  const uiManager = useUIManager();
  const account = useAccount(uiManager);
  const twitter = useMemo(() => planet && uiManager.getTwitter(planet.owner), [uiManager, planet]);

  let c = dfstyles.colors.subtext;

  let content;
  if (!planet) content = '';
  else {
    if (planet.owner === EMPTY_ADDRESS) content = 'Unclaimed';
    else if (showYours && planet.owner === account) {
      content = 'yours!';
      c = dfstyles.colors.dfgreen;
    } else {
      // has an owner, and it's not you (or we don't care if it is)
      if (twitter) content = '@' + twitter;
      else content = <TextPreview text={planet.owner} />;

      c = ProcgenUtils.getPlayerColor(planet.owner);
    }
  }

  return color ? <Colored color={c}>{content}</Colored> : <>{content}</>;
}
