import _ from 'lodash';
import React, { useMemo, useReducer, useState } from 'react';
import { LobbyAdminTools } from '../../Backend/Utils/LobbyAdminTools';
import { ConfigurationPane } from '../Panes/Lobbies/ConfigurationPane';
import { MinimapPane } from '../Panes/Lobbies/MinimapPane';
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
  lobbyAdminTools,
  lobbyTx
}: {
  startingConfig: LobbyInitializers;
  onCreate: (config: LobbyInitializers) => Promise<void>;
  lobbyAdminTools: LobbyAdminTools | undefined;
  lobbyTx: string | undefined;
}) {
  const [config, updateConfig] = useReducer(lobbyConfigReducer, startingConfig, lobbyConfigInit);
  const [minimapConfig, setMinimapConfig] = useState<MinimapConfig | undefined>();

  const onMapChange = useMemo(() => {
    return _.debounce((config: MinimapConfig) => setMinimapConfig(config), 500);
  }, [setMinimapConfig]);

  function onUpdate(action: LobbyConfigAction) {
    updateConfig(action);
  }

  
  
  let content = (
    <>
      <ConfigurationPane
        modalIndex={2}
        config={config}
        startingConfig = {startingConfig}
        updateConfig={updateConfig}
        onMapChange={onMapChange}
        onCreate={onCreate}
        lobbyAdminTools={lobbyAdminTools}
        onUpdate = {onUpdate}
        lobbyTx = {lobbyTx}
      />
      {/* Minimap uses modalIndex=1 so it is always underneath the configuration pane */}
      <MinimapPane modalIndex={1} minimapConfig={minimapConfig} onUpdate = {onUpdate} created = {!!lobbyAdminTools}/>
    </>
  );

  return content;
}
