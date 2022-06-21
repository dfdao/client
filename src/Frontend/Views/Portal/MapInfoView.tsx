import { getConfigName } from '@darkforest_eth/procedural';
import { address } from '@darkforest_eth/serde';
import { EthAddress } from '@darkforest_eth/types';
import _ from 'lodash';
import React, { useEffect, useState, useMemo } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { loadConfigFromHash } from '../../../Backend/Network/ConfigApi';
import { Btn } from '../../Components/Btn';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Minimap } from '../../Components/Minimap';
import { TextPreview } from '../../Components/TextPreview';
import { generateMinimapConfig, MinimapConfig } from '../../Panes/Lobbies/MinimapUtils';
import { LobbyInitializers } from '../../Panes/Lobbies/Reducer';
import { stockConfig } from '../../Utils/StockConfigs';

import { MapDetails } from './MapDetails';

const NONE = 'No map found';
function MapOverview({
  configHash,
  config,
  lobbyAddress,
}: {
  configHash: string | undefined;
  config: LobbyInitializers | undefined;
  lobbyAddress: EthAddress | undefined;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [minimapConfig, setMinimapConfig] = useState<MinimapConfig | undefined>();
  const [mapName, setMapName] = useState<string>(configHash ? getConfigName(configHash) : NONE);

  const onMapChange = useMemo(() => {
    return _.debounce((config: MinimapConfig) => configHash && setMinimapConfig(config), 500);
  }, [setMinimapConfig]);

  useEffect(() => {
    if (config) {
      const name = configHash ? getConfigName(configHash) : NONE;
      setMapName(name);
      onMapChange(generateMinimapConfig(config, 5));
    } else {
      setMinimapConfig(undefined);
      setMapName(NONE);
    }
  }, [config, onMapChange, setMapName]);

  return (
    <OverviewContainer>
      <div>
        <Title>{mapName}</Title>
        <TextPreview text={configHash} focusedWidth={'200px'} unFocusedWidth={'200px'} />
      </div>

      {!minimapConfig ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '300px',
            height: '300px',
          }}
        >
          <LoadingSpinner initialText='Loading...' />
        </div>
      ) : (
        <Minimap
          style={{ width: '300px', height: '300px' }}
          minimapConfig={minimapConfig}
          setRefreshing={setRefreshing}
        />
      )}
      <Link style={{ minWidth: '250px' }} target='blank' to={`/play/${lobbyAddress}?create=true`}>
        <Btn variant='portal' size='stretch'>
          New Game with this Map
        </Btn>
      </Link>
      <Link style={{ minWidth: '250px' }} target='blank' to={`/arena/${lobbyAddress}/settings`}>
        <Btn variant='portal' size='stretch' disabled={!lobbyAddress}>
          Remix this Map
        </Btn>
      </Link>
    </OverviewContainer>
  );
}

export function MapInfoView({ match }: RouteComponentProps<{ configHash: string }>) {
  const configHash = match.params.configHash || undefined;
  const [config, setConfig] = useState<LobbyInitializers | undefined>();
  const [lobbyAddress, setLobbyAddress] = useState<EthAddress | undefined>();
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    if (configHash) {
      loadConfigFromHash(configHash)
        .then((c) => {
          if (!c) {
            setConfig(undefined);
            return;
          }
          setConfig(c.config);
          setLobbyAddress(address(c.address));
        })
        .catch((e) => {
          setError(true);
          console.log(e);
        });
    }
  }, [configHash]);

  return (
    <MapInfoContainer>
      {error ? (
        <>Map Not Found</>
      ) : config && (
        <>
          <MapOverview configHash={configHash} config={config} lobbyAddress={lobbyAddress} />
          <MapDetails configHash={configHash} config={config} />
        </>
      )}
    </MapInfoContainer>
  );
}

const MapInfoContainer = styled.div`
  display: flex;
  flex: 1 1;
  flex-direction: row;
  height: 100%;
  width: 100%;
  justify-content: space-evenly;
  padding: 10px;
`;

const OverviewContainer = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.div`
  display: flex;
  text-align: center;
  font-size: 3em;
  white-space: nowrap;
  justify-content: center;
`;
const TimeContainer = styled.div`
  font-size: 1em;
  text-align: center;
`;
