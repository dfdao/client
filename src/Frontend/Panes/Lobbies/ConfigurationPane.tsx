import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { LobbyAdminTools } from '../../../Backend/Utils/LobbyAdminTools';
import { Btn } from '../../Components/Btn';
import { Link } from '../../Components/CoreUI';
import { MythicLabelText } from '../../Components/Labels/MythicLabel';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Modal } from '../../Components/Modal';
import { Row } from '../../Components/Row';
import { TextPreview } from '../../Components/TextPreview';
import { ExtrasNavPane } from './ExtrasNavPane';
import { ConfigDownload, ConfigUpload } from './LobbiesUtils';
import { MapSelectPane } from './MapSelectPane';
import { MinimapConfig } from './MinimapUtils';
import {
  InvalidConfigError,
  LobbyAction,
  LobbyConfigAction,
  lobbyConfigInit,
  LobbyConfigState,
  LobbyInitializers,
  toInitializers
} from './Reducer';
import { WorldSettingsPane } from './WorldSettingsPane';

const jcFlexEnd = { justifyContent: 'flex-end' } as CSSStyleDeclaration & React.CSSProperties;

const ButtonRow = styled(Row)`
  gap: 8px;

  .button {
    flex: 1 1 50%;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
`;

const buttonStyle = {
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  flex: '1 1 50%',
} as CSSStyleDeclaration & React.CSSProperties;

const activeStyle = {
  borderWidth: 'medium',
} as CSSStyleDeclaration & React.CSSProperties;

const noStyle = {} as CSSStyleDeclaration & React.CSSProperties;

type Status = 'creating' | 'created' | 'errored' | undefined;

const mapSize = '125px';
export function ConfigurationPane({
  modalIndex,
  startingConfig,
  config,
  updateConfig,
  onMapChange,
  onCreate,
  lobbyAdminTools,
  onUpdate,
  lobbyTx,
}: {
  modalIndex: number;
  config: LobbyConfigState;
  startingConfig: LobbyInitializers;
  updateConfig: React.Dispatch<LobbyAction>;
  onMapChange: (props: MinimapConfig) => void;
  onCreate: (config: LobbyInitializers) => Promise<void>;
  lobbyAdminTools: LobbyAdminTools | undefined;
  onUpdate: (action: LobbyConfigAction) => void;
  lobbyTx: string | undefined;
}) {
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>(undefined);
  const createDisabled = status === 'creating' || status === 'created';
  const creating = status === 'creating' || (status === 'created' && !lobbyAdminTools?.address);
  const created = status === 'created' && lobbyAdminTools?.address;
  // Separated IO Errors from Download/Upload so they show on any pane of the modal
  const { path: root } = useRouteMatch();

  function configUploadSuccess(initializers: LobbyInitializers) {
    updateConfig({ type: 'RESET', value: lobbyConfigInit(initializers) });
  }

  async function validateAndCreateLobby() {
    const confirmAlert = confirm(
      `Are you sure? After lobby creation, you cannot modify world settings, but you can create planets and add players to the whitelist.`
    );
    if (!confirmAlert) return;
    try {
      setStatus('creating');

      const initializers = toInitializers(config);
      await onCreate(initializers);
      setStatus('created');
    } catch (err) {
      setStatus('errored');
      console.error(err);
      if (err instanceof InvalidConfigError) {
        setError(`Invalid ${err.key} value ${err.value ?? ''} - ${err.message}`);
      } else {
        setError(err?.message || 'Something went wrong. Check your dev console.');
      }
    }
  }

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
      stagedPlanets: config.ADMIN_PLANETS.currentValue || [],
      createdPlanets: lobbyAdminTools?.planets || [],
      dot: 4,
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
    lobbyAdminTools,
  ]);

  const blockscoutURL = `https://blockscout.com/poa/xdai/optimism/tx/${lobbyTx}`;
  const url = `${window.location.origin}/play/${lobbyAdminTools?.address}`;

  const lobbyContent: JSX.Element | undefined = !created ? (
    <Btn size='stretch' disabled={createDisabled} onClick={validateAndCreateLobby}>
      {creating ? <LoadingSpinner initialText={'Creating...'} /> : 'Create Lobby'}
    </Btn>
  ) : (
    <>
      <Row style={{ justifyContent: 'center' } as CSSStyleDeclaration & React.CSSProperties}>
        <div>
          <MythicLabelText
            style={{ margin: 'auto' }}
            text='Your universe has been created! '
          ></MythicLabelText>
          {lobbyTx && (
            <Link to={blockscoutURL} style={{ margin: 'auto' }}>
              <u>view tx</u>
            </Link>
          )}
        </div>
      </Row>
      <Row>
        <span style={{ margin: 'auto' }}>You can also share the direct url with your friends:</span>
      </Row>
      {/* Didn't like the TextPreview jumping, so I'm setting the height */}
      <Row style={{ height: '30px' } as CSSStyleDeclaration & React.CSSProperties}>
        <TextPreview
          style={{ margin: 'auto' }}
          text={url}
          unFocusedWidth='50%'
          focusedWidth='100%'
        />
      </Row>
    </>
  );

  return (
    <Modal width='500px' initialX={100} initialY={100} index={modalIndex}>
      <Switch>
        <Route path={root} exact={true}>
          <MapSelectPane
            startingConfig={startingConfig}
            updateConfig={updateConfig}
            lobbyAdminTools={lobbyAdminTools}
          />
        </Route>
        <Route exact path={`${root}/settings`}>
          <WorldSettingsPane
            config={config}
            onUpdate={onUpdate}
            createDisabled={createDisabled}
          />
        </Route>
        <Route path={`${root}/settings/extras`}>
          <ExtrasNavPane
            lobbyAdminTools={lobbyAdminTools}
            config={config}
            onUpdate={onUpdate}
          />
        </Route>
      </Switch>
      {error && <Row>{error}</Row>}
      {lobbyContent}

      {/* Button this in the title slot but at the end moves it to the end of the title bar */}
      <ConfigDownload onError={setError} address={lobbyAdminTools?.address} config={config} />
      <ConfigUpload onError={setError} onUpload={configUploadSuccess} />
    </Modal>
  );
}
