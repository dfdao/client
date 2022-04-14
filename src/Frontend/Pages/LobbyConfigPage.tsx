import { EthAddress } from '@darkforest_eth/types';
import _ from 'lodash';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { PlanetCreator } from '../../Backend/Utils/PlanetCreator';
import { ConfigurationPane } from '../Panes/Lobbies/ConfigurationPane';
import { Minimap } from '../Panes/Lobbies/MinimapPane';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import { LobbyConfigAction, lobbyConfigInit, lobbyConfigReducer, LobbyInitializers } from '../Panes/Lobbies/Reducer';

type ErrorState =
  | { type: 'invalidAddress' }
  | { type: 'contractLoad' }
  | { type: 'invalidContract' }
  | { type: 'invalidCreate' };

type Status = 'creating' | 'created' | 'errored' | undefined;

export function LobbyConfigPage({
  startingConfig,
  onCreate,
  lobbyAddress,
  planetCreator
}: {
  startingConfig: LobbyInitializers;
  onCreate: (config: LobbyInitializers) => Promise<void>;
  lobbyAddress: EthAddress | undefined;
  planetCreator: PlanetCreator | undefined;
}) {
  const [config, updateConfig] = useReducer(lobbyConfigReducer, startingConfig, lobbyConfigInit);
  const [minimapConfig, setMinimapConfig] = useState<MinimapConfig | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>(undefined);

  const onMapChange = useMemo(() => {
    return _.debounce((config: MinimapConfig) => setMinimapConfig(config), 500);
  }, [setMinimapConfig]);

  function onUpdate(action: LobbyConfigAction) {
    setError(undefined);
    updateConfig(action);
  }
  
  useEffect(() => {
      if(lobbyAddress) {

      }
  })
  let content = (
    <>
      <ConfigurationPane
        modalIndex={2}
        lobbyAddress={lobbyAddress}
        config={config}
        updateConfig={updateConfig}
        onMapChange={onMapChange}
        onCreate={onCreate}
        planetCreator={planetCreator}
        onUpdate = {onUpdate}
      />
      {/* Minimap uses modalIndex=1 so it is always underneath the configuration pane */}
      <Minimap modalIndex={1} minimapConfig={minimapConfig} onUpdate = {onUpdate}/>
    </>
  );

  return content;
}
