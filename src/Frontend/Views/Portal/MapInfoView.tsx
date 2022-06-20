import { getConfigName } from '@darkforest_eth/procedural';
import { address } from '@darkforest_eth/serde';
import { EthAddress } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { loadConfigFromHash } from '../../../Backend/Network/ConfigApi';
import { Btn } from '../../Components/Btn';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Minimap } from '../../Components/Minimap';
import { TextPreview } from '../../Components/TextPreview';
import { generateMinimapConfig } from '../../Panes/Lobbies/MinimapUtils';
import { LobbyInitializers } from '../../Panes/Lobbies/Reducer';
import { competitiveConfig } from '../../Utils/constants';
import { stockConfig } from '../../Utils/StockConfigs';

import { MapDetails } from './MapDetails';

function MapOverview({
  configHash,
  config,
  lobbyAddress
}: {
  configHash: string;
  config: LobbyInitializers | undefined;
  lobbyAddress : EthAddress | undefined;
}) {
  const [refreshing, setRefreshing] = useState(false);

  const mapName = getConfigName(configHash);

  return (
    <OverviewContainer>
      <div>
        <Title>{mapName}</Title>
        <TextPreview text={configHash} focusedWidth={'200px'} unFocusedWidth={'200px'} />
      </div>

      {!config ? (
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
          minimapConfig={generateMinimapConfig(config, 5)}
          setRefreshing={setRefreshing}
        />
      )}
      <Btn variant='portal' size='large'>
        <Link target='blank' to={`/play/${lobbyAddress}?create=true`}>
          New Game with this Map
        </Link>
      </Btn>
      <Btn variant='portal' size='large' disabled = {!lobbyAddress}>
        <Link target='blank' to={`arena/${lobbyAddress}`}>
          Remix this Map
        </Link>
      </Btn>
    </OverviewContainer>
  );
}

export function MapInfoView({match} :  RouteComponentProps<{ configHash: string }>) {
  console.log(`here`)
  const configHash = match.params.configHash || competitiveConfig;
  const [config, setConfig] = useState<LobbyInitializers | undefined>();
  const [lobbyAddress, setLobbyAddress] = useState<EthAddress | undefined>();

  useEffect(() => {
    loadConfigFromHash(competitiveConfig).then((c) => {
      if(!c) {
        setConfig(stockConfig.onePlayerRace)
        return;
      }
      setConfig(c.config);
      setLobbyAddress(address(c.address));
    }).catch(e => {
      console.log(e);
    });
  }, [configHash]);

  return (
    <MapInfoContainer>
      <MapOverview configHash={configHash} config={config} lobbyAddress={lobbyAddress} />
      <MapDetails configHash={configHash} config={config} />
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
`;
const TimeContainer = styled.div`
  font-size: 1em;
  text-align: center;
`;
