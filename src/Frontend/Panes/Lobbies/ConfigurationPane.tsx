import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { LobbyAdminTools } from '../../../Backend/Utils/LobbyAdminTools';
import { Btn } from '../../Components/Btn';
import { Spacer, Title } from '../../Components/CoreUI';
import { Minimap } from '../../Components/Minimap';
import { Modal } from '../../Components/Modal';
import { Row } from '../../Components/Row';
import { Smaller, Sub } from '../../Components/Text';
import { stockConfig } from '../../Utils/StockConfigs';
import { ConfigDownload, ConfigUpload, LinkButton, Warning } from './LobbiesUtils';
import { MinimapConfig } from './MinimapUtils';
import {
  LobbyAction,
  LobbyConfigAction,
  lobbyConfigInit,
  LobbyConfigState,
  LobbyInitializers
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
  startingConfig: LobbyInitializers
  updateConfig: React.Dispatch<LobbyAction>;
  onMapChange: (props: MinimapConfig) => void;
  onCreate: (config: LobbyInitializers) => Promise<void>;
  lobbyAdminTools: LobbyAdminTools | undefined;
  onUpdate: (action: LobbyConfigAction) => void;
  lobbyTx: string | undefined;
}) {
  const [error, setError] = useState<string | undefined>();
  const [active, setActive] = useState<number | undefined>();
  // Separated IO Errors from Download/Upload so they show on any pane of the modal
  const { path: root } = useRouteMatch();

  function configUploadSuccess(initializers: LobbyInitializers) {
    updateConfig({ type: 'RESET', value: lobbyConfigInit(initializers) });
  }

  function pickMap(initializers: LobbyInitializers, active: number) {
    updateConfig({ type: 'RESET', value: lobbyConfigInit(initializers) });
    setActive(active)
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

  function generateMinimapConfig(config: LobbyInitializers): MinimapConfig {
    return {
      worldRadius: config.WORLD_RADIUS_MIN,
      key: config.SPACETYPE_KEY,
      scale: config.PERLIN_LENGTH_SCALE,
      mirrorX: config.PERLIN_MIRROR_X,
      mirrorY: config.PERLIN_MIRROR_Y,
      perlinThreshold1: config.PERLIN_THRESHOLD_1,
      perlinThreshold2: config.PERLIN_THRESHOLD_2,
      perlinThreshold3: config.PERLIN_THRESHOLD_3,
      stagedPlanets: config.ADMIN_PLANETS || [],
      createdPlanets: lobbyAdminTools?.planets || [],
      dot: 10,
    } as MinimapConfig;
  }

  interface map {
    title: string;
    initializers: LobbyInitializers;
    description: string;
  }

  const maps: map[] = [
    {
      title: '(2P) Battle for the Center',
      initializers: stockConfig.twoPlayerBattle,
      description: 'Win the planet in the center!',
    },
    {
      title: '(4P) Battle for the Center',
      initializers: stockConfig.fourPlayerBattle,
      description: 'Win the planet in the center!',
    },
    {
      title: 'Race Across the Map',
      initializers: stockConfig.sprint,
      description: 'Win the planet across the map!',
    },
    {
      title: 'Custom',
      initializers: startingConfig,
      description: 'Design your own game',
    },
  ];

  const Maps = _.chunk(maps, 2).map((items, idx) => (
    <ButtonRow key={`map-row-${idx}`}>
      {items.map((item, j) => (
        <Btn key={`map-item-${j}`} className='button' size={'stretch'} onClick={() => pickMap(item.initializers, idx + j)}>
          <div style={{ flexDirection: 'column' }}>
            <Minimap
              style={{ height: mapSize, width: mapSize }}
              minimapConfig={generateMinimapConfig(item.initializers)}
            />
            <div>{item.title}</div>
            <Smaller>{item.description}</Smaller>
            <br />
            <Smaller>
              <Sub>size: {item.initializers.WORLD_RADIUS_MIN}</Sub>
            </Smaller>
          </div>
        </Btn>
      ))}
    </ButtonRow>
  ));

  const content = () => {
    return (
      <>
        <Title slot='title'>Customize Lobby</Title>
        <div>
          First, customize the configuration of your world. Once you have created a lobby, add
          custom planets and allowlisted players on the next pane.
        </div>
        <Spacer height={20} />

        {Maps}
        <Row style={jcFlexEnd}>
          <LinkButton to={`/settings`}>Customize World →</LinkButton>
        </Row>
        <Row>
          <Warning>{error}</Warning>
        </Row>
      </>
    );
  };

  return (
    <Modal width='500px' initialX={100} initialY={100} index={modalIndex}>
      <Switch>
        <Route path={root} exact={true}>
          {content}
        </Route>
        <Route path={`${root}/settings`}>
          <WorldSettingsPane
            config={config}
            updateConfig={updateConfig}
            onMapChange={onMapChange}
            onCreate={onCreate}
            lobbyAdminTools={lobbyAdminTools}
            onUpdate={onUpdate}
            lobbyTx={lobbyTx}
          />
        </Route>
      </Switch>

      {/* Button this in the title slot but at the end moves it to the end of the title bar */}
      <ConfigDownload onError={setError} address={lobbyAdminTools?.address} config={config} />
      <ConfigUpload onError={setError} onUpload={configUploadSuccess} />
    </Modal>
  );
}
