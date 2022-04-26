import _ from 'lodash';
import React, { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Btn } from '../../Components/Btn';
import { Spacer, Title } from '../../Components/CoreUI';
import { Row } from '../../Components/Row';
import { AdminPermissionsPane } from './AdminPermissionsPane';
import { ArtifactSettingsPane } from './ArtifactSettingsPane';
import { CaptureZonesPane } from './CaptureZonesPane';
import { GameSettingsPane } from './GameSettingsPane';
import { ButtonRow, LinkButton, LobbiesPaneProps, NavigationTitle, Warning } from './LobbiesUtils';
import { PlanetPane } from './PlanetPane';
import { PlayerSpawnPane } from './PlayerSpawnPane';
import { LobbyConfigAction, LobbyConfigState } from './Reducer';
import { SnarkPane } from './SnarkPane';
import { SpaceJunkPane } from './SpaceJunkPane';
import { SpaceshipsPane } from './SpaceshipsPane';
import { SpaceTypeBiomePane } from './SpaceTypeBiomePane';
import { TargetPlanetPane } from './TargetPlanetPane';
import { WorldSizePane } from './WorldSizePane';

const jcSpaceBetween = { justifyContent: 'space-between' } as CSSStyleDeclaration &
  React.CSSProperties;

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
  onUpdate,
  createDisabled,
  lobbyContent,
  root,
}: {
  config: LobbyConfigState;
  onUpdate: (action: LobbyConfigAction) => void;
  createDisabled: boolean;
  lobbyContent: JSX.Element;
  root: string;
}) {
  const [error, setError] = useState<string | undefined>();

  const history = useHistory();

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

      <Route key={idx} path={`${root}/settings${path}`}>
        <NavigationTitle>{title}</NavigationTitle>
        <Pane config={config} onUpdate={onUpdate} />
      </Route>
    );
  });

  const content = () => {
    return (
      <>
        <Title slot='title'>World Settings</Title>
        <div>
          <Spacer height={12} />
          Here you can customize the configuration of your world. Once you have created your world,
          add custom planets and players on the next pane.
          <Spacer height={12} />
        </div>
        {buttons}
        <Spacer height={20} />
        <div>
          <Row style={jcSpaceBetween}>
            <Btn onClick={() => history.push(`${root}`)}>← Choose a map</Btn>
            <Btn onClick={() => history.push(`${root}/extras`)}>Add planets & players →</Btn>
          </Row>
          <Row>
            <Warning>{error}</Warning>
          </Row>
        </div>
        {lobbyContent}
      </>
    );
  };

  return (
    <Switch>
      <Route path={`${root}/settings`} exact>
        {content}
      </Route>
      {routes}
    </Switch>
  );
}
