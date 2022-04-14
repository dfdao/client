import { EthAddress } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { PlanetCreator } from '../../../Backend/Utils/PlanetCreator';
import { Modal } from '../../Components/Modal';
import { ConfigDownload, ConfigUpload } from './LobbiesUtils';
import { MinimapConfig } from './MinimapUtils';
import {
  InvalidConfigError,
  LobbyAction,
  LobbyConfigAction,
  lobbyConfigInit, LobbyConfigState,
  LobbyInitializers,
  toInitializers
} from './Reducer';
import { ConfigurationNavigation } from './WorldSettingsNavPane';
type Status = 'creating' | 'created' | 'errored' | undefined;

export function ConfigurationPane({
  modalIndex,
  lobbyAddress,
  config,
  updateConfig,
  onMapChange,
  onCreate,
  planetCreator,
  onUpdate
}: {
  modalIndex: number;
  lobbyAddress: EthAddress | undefined;
  config: LobbyConfigState;
  updateConfig: React.Dispatch<LobbyAction>;
  onMapChange: (props: MinimapConfig) => void;
  onCreate: (config: LobbyInitializers) => Promise<void>;
  planetCreator: PlanetCreator | undefined;
  onUpdate : (action: LobbyConfigAction) => void;
}) {
  const { path: root } = useRouteMatch();
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>(undefined);
  const [statusMessage, setStatusMessage] = useState<string>('');
  // Separated IO Errors from Download/Upload so they show on any pane of the modal


  // Minimap only changes on a subset of properties, so we only trigger when one of them changes value (and still debounce it)
  useEffect(() => {
    onMapChange({
      worldRadius: config.WORLD_RADIUS_MIN.currentValue,
      key: config.SPACETYPE_KEY.currentValue,
      scale: config.PERLIN_LENGTH_SCALE.currentValue,
      mirrorX: config.PERLIN_MIRROR_X.currentValue,
      mirrorY: config.PERLIN_MIRROR_Y.currentValue,
      perlinThreshold1: config.PERLIN_THRESHOLD_1.currentValue,
      perlinThreshold2: config.PERLIN_THRESHOLD_2.currentValue,
      perlinThreshold3: config.PERLIN_THRESHOLD_3.currentValue,
      planets: config.ADMIN_PLANETS.currentValue || [],
    });
  }, [
    onMapChange,
    config.WORLD_RADIUS_MIN.currentValue,
    config.SPACETYPE_KEY.currentValue,
    config.PERLIN_LENGTH_SCALE.currentValue,
    config.PERLIN_MIRROR_X.currentValue,
    config.PERLIN_MIRROR_Y.currentValue,
    config.PERLIN_THRESHOLD_1.currentValue,
    config.PERLIN_THRESHOLD_2.currentValue,
    config.PERLIN_THRESHOLD_3.currentValue,
    config.ADMIN_PLANETS.currentValue,
  ]);

  async function validateAndCreateLobby() {
    try {
      setStatus('creating');
      setStatusMessage('Creating...');

      const initializers = toInitializers(config);
      await onCreate(initializers);
      setStatus('created');
    } catch (err) {
      setStatus('errored');
      setStatusMessage('Error');
      console.error(err);
      if (err instanceof InvalidConfigError) {
        setError(`Invalid ${err.key} value ${err.value ?? ''} - ${err.message}`);
      } else {
        setError(err?.message || 'Something went wrong. Check your dev console.');
      }
    }
  }

  async function createAndRevealPlanets() {
    try {
      setStatus('creating');
      setStatusMessage('Creating...');
      const initializers = toInitializers(config);
      if (!planetCreator) {
        setError("You haven't created a lobby.");
        return;
      }
      for (const planet of initializers.ADMIN_PLANETS) {
        setStatusMessage(`Creating planet at (${planet.x}, ${planet.y})...`);

        await planetCreator.createPlanet(planet, initializers);
        if (planet.revealLocation) {
          setStatusMessage(`Revealing planet at (${planet.x}, ${planet.y})...`);
          await planetCreator.revealPlanet(planet, initializers);
        }
      }
      setStatus('created');
      setStatusMessage('Created');
    } catch (err) {
      setStatus('errored');
      setStatusMessage('Errored');
      console.error(err);
      if (err instanceof InvalidConfigError) {
        setError(`Invalid ${err.key} value ${err.value ?? ''} - ${err.message}`);
      } else {
        setError(err?.message || 'Something went wrong. Check your dev console.');
      }
    }
  }

  function configUploadSuccess(initializers: LobbyInitializers) {
    updateConfig({ type: 'RESET', value: lobbyConfigInit(initializers) });
  }

  return (
    <Modal width='500px' initialX={100} initialY={100} index={modalIndex}>
      <Switch>
        <Route path={`${root}`}>
          <ConfigurationNavigation
            error={error}
            lobbyAddress={lobbyAddress}
            status={status}
            statusMessage={statusMessage}
            onCreate={validateAndCreateLobby}
            createPlanets={createAndRevealPlanets}
            config={config}
            onUpdate={onUpdate}
          />
        </Route>
      </Switch>
      {/* Button this in the title slot but at the end moves it to the end of the title bar */}
      <ConfigDownload onError={setError} address={lobbyAddress} config={config} />
      <ConfigUpload onError={setError} onUpload={configUploadSuccess} />
    </Modal>
  );
}
