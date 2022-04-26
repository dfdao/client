import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { LobbyAdminTools } from '../../../Backend/Utils/LobbyAdminTools';
import { Btn } from '../../Components/Btn';
import { Spacer, Title } from '../../Components/CoreUI';
import { Row } from '../../Components/Row';
import { AdminPermissionsPane } from './AdminPermissionsPane';
import { ArtifactSettingsPane } from './ArtifactSettingsPane';
import { CaptureZonesPane } from './CaptureZonesPane';
import { ExtrasNavPane } from './ExtrasNavPane';
import { GameSettingsPane } from './GameSettingsPane';
import {
  ButtonRow, LinkButton,
  LobbiesPaneProps,
  NavigationTitle,
  Warning
} from './LobbiesUtils';
import { MinimapConfig } from './MinimapUtils';
import { PlanetPane } from './PlanetPane';
import { PlayerSpawnPane } from './PlayerSpawnPane';
import {
  LobbyConfigAction, LobbyConfigState
} from './Reducer';
import { SnarkPane } from './SnarkPane';
import { SpaceJunkPane } from './SpaceJunkPane';
import { SpaceshipsPane } from './SpaceshipsPane';
import { SpaceTypeBiomePane } from './SpaceTypeBiomePane';
import { TargetPlanetPane } from './TargetPlanetPane';
import { WorldSizePane } from './WorldSizePane';

const jcSpaceBetween = { justifyContent: 'space-between' } as CSSStyleDeclaration & React.CSSProperties;

interface PaneConfig {
  title: string;
  shortcut: string;
  path: string;
  Pane: (props: LobbiesPaneProps) => JSX.Element;
}

const panes: ReadonlyArray<PaneConfig> = [
  {
    title: 'Game settings',
    shortcut: `1`,
    path: '/game',
    Pane: (props: LobbiesPaneProps) => <GameSettingsPane {...props} />,
  },
  {
    title: 'World size',
    shortcut: `2`,
    path: '/world',
    Pane: (props: LobbiesPaneProps) => <WorldSizePane {...props} />,
  },
  {
    title: 'Space type & Biome',
    shortcut: `3`,
    path: '/space',
    Pane: (props: LobbiesPaneProps) => <SpaceTypeBiomePane {...props} />,
  },
  {
    title: 'Planet rarity',
    shortcut: `4`,
    path: '/planet',
    Pane: (props: LobbiesPaneProps) => <PlanetPane {...props} />,
  },
  {
    title: 'Player spawn',
    shortcut: `5`,
    path: '/spawn',
    Pane: (props: LobbiesPaneProps) => <PlayerSpawnPane {...props} />,
  },
  {
    title: 'Space junk',
    shortcut: `6`,
    path: '/junk',
    Pane: (props: LobbiesPaneProps) => <SpaceJunkPane {...props} />,
  },
  {
    title: 'Capture zones',
    shortcut: `7`,
    path: '/zones',
    Pane: (props: LobbiesPaneProps) => <CaptureZonesPane {...props} />,
  },
  {
    title: 'Artifacts',
    shortcut: `8`,
    path: '/artifact',
    Pane: (props: LobbiesPaneProps) => <ArtifactSettingsPane {...props} />,
  },
  {
    title: 'Admin permissions',
    shortcut: `9`,
    path: '/admin',
    Pane: (props: LobbiesPaneProps) => <AdminPermissionsPane {...props} />,
  },
  {
    title: 'Advanced: Snarks',
    shortcut: `0`,
    path: '/snark',
    Pane: (props: LobbiesPaneProps) => <SnarkPane {...props} />,
  },
  {
    title: 'Target planets',
    shortcut: `-`,
    path: '/arena',
    Pane: (props: LobbiesPaneProps) => <TargetPlanetPane {...props} />,
  },
  {
    title: 'Spaceships',
    shortcut: `+`,
    path: '/spaceships',
    Pane: (props: LobbiesPaneProps) => <SpaceshipsPane {...props} />,
  },
] as const;

type Status = 'creating' | 'created' | 'errored' | undefined;

export function WorldSettingsPane({
  config,
  onMapChange,
  lobbyAdminTools,
  onUpdate,
  createDisabled
}: {
  config: LobbyConfigState;
  onMapChange: (props: MinimapConfig) => void;
  lobbyAdminTools: LobbyAdminTools | undefined;
  onUpdate: (action: LobbyConfigAction) => void;
  createDisabled: boolean
}) {
  const [error, setError] = useState<string | undefined>();

  // Separated IO Errors from Download/Upload so they show on any pane of the modal
  const { path: root } = useRouteMatch();
  const history = useHistory();

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
      stagedPlanets: config.ADMIN_PLANETS.currentValue || [],
      createdPlanets: lobbyAdminTools?.planets || [],
      dot: 4
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

  const buttons = _.chunk(panes, 2).map(([fst, snd], idx) => {
    return (
      // Index key is fine here because the array is stable
      <ButtonRow key={idx}>
        {fst && (
          <LinkButton disabled={!!createDisabled} to={fst.path} shortcut={fst.shortcut}>
            {fst.title}
          </LinkButton>
        )}
        {snd && (
          <LinkButton disabled={!!createDisabled} to={snd.path} shortcut={snd.shortcut}>
            {snd.title}
          </LinkButton>
        )}
      </ButtonRow>
    );
  });

  const routes = panes.map(({ title, path, Pane }, idx) => {
    return (
      // Index key is fine here because the array is stable

      <Route key={idx} path={`${root}${path}`}>
        <NavigationTitle>{title}</NavigationTitle>
        <Pane config={config} onUpdate={onUpdate} />
      </Route>
    );
  });

  const content = () => {
    return (
      <>
        <Title slot='title'>Customize Lobby</Title>
        <div>
          Welcome Cadet! Here, you can configure and launch a custom Dark Forest universe. We call
          this a Lobby.
          <Spacer height={12} />
          First, customize the configuration of your world. Once you have created a lobby, add
          custom planets and allowlisted players on the next pane.
          <Spacer height={12} />
        </div>
        {buttons}
        <Spacer height={20} />
        <div>
          <Row style={jcSpaceBetween}>
          <Btn onClick={ () => history.goBack()}>← Choose a map</Btn>
            <LinkButton to={`/extras`}>Add players/planets →</LinkButton>
          </Row>
          <Row>
            <Warning>{error}</Warning>
          </Row>
        </div>
      </>
    );
  };

  return (
    <Switch>
      <Route path={root} exact={true}>
        {content}
      </Route>
      {routes}
      <Route path={`${root}/extras`}>
        <ExtrasNavPane
          lobbyAdminTools={lobbyAdminTools}
          config={config}
          onUpdate={onUpdate}
        />
      </Route>
    </Switch>
  );
}
