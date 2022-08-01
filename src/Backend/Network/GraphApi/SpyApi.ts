import { LiveMatch, LiveMatchEntry } from '@darkforest_eth/types';
import { apiUrl, competitiveConfig } from '../../../Frontend/Utils/constants';
import { getGraphQLData } from '../GraphApi';
import { getAllTwitters } from '../UtilityServerAPI';

export const loadAllLiveMatches = async (): Promise<LiveMatch> => {
  const twoDaysAgo = (Date.now() - 1000 * 60 * 60 * 24 * 2) / 1000;
  // where: {startTime_gt: ${twoDaysAgo}
  const query = ` 
    query {arenas(first: 1000, orderBy: startTime, orderDirection: desc, where: { gameOver: false}) {
      firstMover {
        address
      },  
      players {address}, 
      creator,
      id
      startTime,
      configHash,
      planets{spawnPlanet}  
    }
    }`;

  const response = await getGraphQLData(query, apiUrl);

  if ('errors' in response) {
    throw new Error(`error when fetching data, ${JSON.stringify(response)}`);
  }

  const { arenas } = response.data;
  if (arenas === null) {
    throw new Error(`error when fetching data, ${JSON.stringify(response)}`);
  }

  return { entries: arenas };
};

export const loadLiveMatches = async (
  config: string = competitiveConfig,
  multiplayer?: boolean
): Promise<LiveMatch> => {
  const multiplayerStats = multiplayer ? `players {address}` : '';

  const query = `
    query {
      arenas(first: 1000, orderBy: startTime, orderDirection: desc, where: {configHash: "${config}", gameOver: false}) {
      firstMover {
        address
      },  
      ${multiplayerStats}
      creator,
      id
      startTime,
      configHash
      }
    }`;

  const response = await getGraphQLData(query, apiUrl);

  if ('errors' in response) {
    throw new Error(`error when fetching data, ${JSON.stringify(response)}`);
  }

  const { arenas } = response.data;
  if (arenas === null) {
    throw new Error(`error when fetching data, ${JSON.stringify(response)}`);
  }

  return { entries: arenas };
};
