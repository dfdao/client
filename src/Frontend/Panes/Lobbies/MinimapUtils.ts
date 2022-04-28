import { AdminPlanet, SpaceType } from '@darkforest_eth/types';
import { hsl } from 'color';
import { CreatedPlanet } from '../../../Backend/Utils/LobbyAdminTools';

export type MinimapConfig = {
  worldRadius: number;
  // perlin
  key: number;
  scale: number;
  dot: number;
  mirrorX: boolean;
  mirrorY: boolean;
  perlinThreshold1: number;
  perlinThreshold2: number;
  perlinThreshold3: number;
  stagedPlanets: AdminPlanet[];
  createdPlanets: CreatedPlanet[];
};

export type PlanetType = 'staged' | 'target' | 'spawn' | 'created' | undefined
export type DrawMessage = {
  radius: number;
  dot : number;
  data: { x: number; y: number; type: SpaceType; planet: PlanetType}[];
};

export const MinimapColors = {
    stagedPlanet : `${hsl(285, 100, 60)}`,
    spawnPlanet : `${hsl(51, 100, 55)}`,
    targetPlanet: `${hsl(0, 100, 55)}`,
    createdPlanet:`${hsl(123, 100, 55)}`,
    innerNebula : `${hsl(184, 63, 15)}`,
    outerNebula : `${hsl(240, 94, 20)}`,
    deepSpace : `${hsl(245, 60, 4)}`, // deep space
    deadSpace : `${hsl(119, 60, 15)}`, // dead space
}