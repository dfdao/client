import { SpaceType } from '@darkforest_eth/types';
import { CreatedPlanet } from '../../../Backend/Utils/LobbyAdminTools';
import { LobbyPlanet } from './LobbiesUtils';

export type MinimapConfig = {
  worldRadius: number;
  // perlin
  key: number;
  scale: number;
  mirrorX: boolean;
  mirrorY: boolean;
  perlinThreshold1: number;
  perlinThreshold2: number;
  perlinThreshold3: number;
  stagedPlanets: LobbyPlanet[];
  createdPlanets: CreatedPlanet[];
};

export type PlanetType = 'staged' | 'created' | undefined
export type DrawMessage = {
  radius: number;
  data: { x: number; y: number; type: SpaceType; planet: PlanetType}[];
};
