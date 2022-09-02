import { LiveMatch } from '@darkforest_eth/types';
import { getGraphQLData } from '../GraphApi';

export const loadLiveMatches = async (configHash?: string): Promise<LiveMatch> => {
  const startTime = Math.round((Date.now() - 1000 * 60 * 60 * 24 * 7) / 1000);

  const hash = configHash ? `configHash: "${configHash}",` : '';
  const query = `
    query {
      arenas(first: 1000, orderBy: startTime, orderDirection: desc, where: {startTime_gt: ${startTime}, ${hash}}) {
      lobbyAddress
      firstMover {
        address
      },  
      players {address}
      creator,
      id
      startTime,
      endTime,
      configHash
      planets {
        spawnPlanet
      }
      gameOver
      duration  
      }
    }`;

    const response = await getGraphQLData(query, process.env.GRAPH_URL || 'localhost:8000');

  if ('errors' in response) {
    throw new Error(`error when fetching data, ${JSON.stringify(response)}`);
  }

  const { arenas } = response.data;
  if (arenas === null) {
    throw new Error(`error when fetching data, ${JSON.stringify(response)}`);
  }

  return { entries: arenas };
};
