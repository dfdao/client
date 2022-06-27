import { apiUrl } from '../../Frontend/Utils/constants';
import { getGraphQLData } from './GraphApi';

export async function loadMaps(nMaps: number): Promise<{ configHash: string }[] | undefined> {
  const query = `
	query {
		arenas(first:${nMaps}, orderBy:creationTime, orderDirection:desc) {
			configHash
		}
	}
	`;
  return (await getGraphQLData(query, apiUrl)).data.arenas;
}
