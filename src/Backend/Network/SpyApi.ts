import { LiveMatch, LiveMatchEntry } from '@darkforest_eth/types';
import { competitiveConfig } from '../../Frontend/Utils/constants';
import { getGraphQLData } from './GraphApi';
import { getAllTwitters } from './UtilityServerAPI';

export const loadLiveMatches = async (config: string = competitiveConfig): Promise<LiveMatch> => {
  const query = `
    query {
        arenas(first: 1000, where: {configHash: "${config}", gameOver: false, firstMover_not: null}) {
        firstMover {
        address
        },
        id
        startTime
    }
    }`;

  const response = await getGraphQLData(
    query,
    'https://graph-optimism.gnosischain.com/subgraphs/name/dfdao/arena-v1'
  );

  if ('errors' in response) {
    throw new Error(`error when fetching data, ${JSON.stringify(response)}`);
  }

  const { arenas } = response.data;

  if (arenas === null) {
    throw new Error(`error when fetching data, ${JSON.stringify(response)}`);
  }

  const twitters = await getAllTwitters();
  console.log('arenas:', arenas);
  arenas.map((a : LiveMatchEntry) => a.twitter = twitters[a.firstMover.address]);
  return {entries: arenas};
};