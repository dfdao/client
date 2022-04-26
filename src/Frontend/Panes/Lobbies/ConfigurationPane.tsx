import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LobbyAdminTools } from '../../../Backend/Utils/LobbyAdminTools';
import { Btn } from '../../Components/Btn';
import { Link } from '../../Components/CoreUI';
import { MythicLabelText } from '../../Components/Labels/MythicLabel';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Modal } from '../../Components/Modal';
import { Row } from '../../Components/Row';
import { ExtrasNavPane } from './ExtrasNavPane';
import { ConfigDownload, ConfigUpload } from './LobbiesUtils';
import { MapSelectPane } from './MapSelectPane';
import {
  InvalidConfigError,
  LobbyAction,
  lobbyConfigInit,
  LobbyConfigState,
  LobbyInitializers,
  toInitializers
} from './Reducer';
import { WorldSettingsPane } from './WorldSettingsPane';

type Status = 'creating' | 'created' | 'errored' | undefined;

const jcCenter = { justifyContent: 'center' } as CSSStyleDeclaration & React.CSSProperties;
export function ConfigurationPane({
  modalIndex,
  startingConfig,
  config,
  updateConfig,
  onCreate,
  lobbyAdminTools,
  lobbyTx,
  ownerAddress,
  root,
}: {
  modalIndex: number;
  config: LobbyConfigState;
  startingConfig: LobbyInitializers;
  updateConfig: React.Dispatch<LobbyAction>;
  onCreate: (config: LobbyInitializers) => Promise<void>;
  lobbyAdminTools: LobbyAdminTools | undefined;
  lobbyTx: string | undefined;
  ownerAddress: string | undefined;
  root: string;
}) {
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>(undefined);
  const [copied, setCopied] = useState<boolean>(false);

  const createDisabled = status === 'creating' || status === 'created';
  const creating = status === 'creating' || (status === 'created' && !lobbyAdminTools?.address);
  const created = status === 'created' && lobbyAdminTools?.address;
  // Separated IO Errors from Download/Upload so they show on any pane of the modal

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

  const blockscoutURL = `https://blockscout.com/poa/xdai/optimism/tx/${lobbyTx}`;
  const url = `${window.location.origin}/play/${lobbyAdminTools?.address}`;

  const copy = () => {
    if (!navigator.clipboard) {
      setError('Link copy failed.');
      return;
    }
    const text = `👋 ${ownerAddress?.slice(
      0,
      6
    )} has challenged you to a Dark Forest Arena battle! ☄️😤\n\nClick the link to play:\n⚔️ ${url} ⚔️`;
    navigator.clipboard.writeText(text).then(
      function () {
        console.log('Async: Copying to clipboard was successful!');
      },
      function (err) {
        console.error('Async: Could not copy text: ', err);
      }
    );
    setCopied(true);
  };
  const lobbyContent: JSX.Element | undefined = !created ? (
    <Btn size='stretch' disabled={createDisabled} onClick={validateAndCreateLobby}>
      {creating ? <LoadingSpinner initialText={'Creating...'} /> : 'Create World'}
    </Btn>
  ) : (
    <>
      <Row style={jcCenter}>
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
      <Row style={jcCenter}>
        <div>
          <span style={{ margin: 'auto' }}>Share with your friends:</span>
          <Btn size='small' onClick={copy}>
            {!copied ? 'copy link' : 'copied!'}
          </Btn>
        </div>
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
            createDisabled={createDisabled}
          />
        </Route>
        <Route path={`${root}/settings`}>
          <WorldSettingsPane
            config={config}
            onUpdate={updateConfig}
            createDisabled={createDisabled}
            root={root}
          />
        </Route>
        <Route path={`${root}/extras`}>
          <ExtrasNavPane
            lobbyAdminTools={lobbyAdminTools}
            config={config}
            onUpdate={updateConfig}
          />
        </Route>
      </Switch>
      <Row>{error}</Row>
      {lobbyContent}

      {/* Button this in the title slot but at the end moves it to the end of the title bar */}
      <ConfigDownload onError={setError} address={lobbyAdminTools?.address} config={config} />
      <ConfigUpload onError={setError} onUpload={configUploadSuccess} />
    </Modal>
  );
}
