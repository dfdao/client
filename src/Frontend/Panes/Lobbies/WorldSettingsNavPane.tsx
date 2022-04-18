import { EthAddress } from '@darkforest_eth/types';
import _ from 'lodash';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Btn } from '../../Components/Btn';
import { Spacer, Title } from '../../Components/CoreUI';
import { MythicLabelText } from '../../Components/Labels/MythicLabel';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Row } from '../../Components/Row';
import { TextPreview } from '../../Components/TextPreview';
//pane imports
import { AdminPermissionsPane } from './AdminPermissionsPane';
import { ArtifactSettingsPane } from './ArtifactSettingsPane';
import { CaptureZonesPane } from './CaptureZonesPane';
import { ExtrasNavPane } from './ExtrasNavPane';
import { GameSettingsPane } from './GameSettingsPane';
import { ButtonRow, LinkButton, LobbiesPaneProps, NavigationTitle, Warning } from './LobbiesUtils';
import { PlanetPane } from './PlanetPane';
import { PlayerSpawnPane } from './PlayerSpawnPane';
import { LobbyConfigAction, LobbyConfigState } from './Reducer';
import { SnarkPane } from './SnarkPane';
import { SpaceJunkPane } from './SpaceJunkPane';
import { SpaceTypeBiomePane } from './SpaceTypeBiomePane';
import { TargetPlanetPane } from './TargetPlanetPane';
import { WorldSizePane } from './WorldSizePane';

const jcFlexEnd = { justifyContent: 'flex-end' } as CSSStyleDeclaration & React.CSSProperties;

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
    title: 'Planets',
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
    title: 'Target & spawn planets',
    shortcut: `-`,
    path: '/arena',
    Pane: (props: LobbiesPaneProps) => <TargetPlanetPane {...props} />,
  },
] as const;

type Status = 'creating' | 'created' | 'errored' | undefined;

export function WorldSettingsNavPane({
  error,
  lobbyAddress,
  status,
  statusMessage,
  onCreate,
  createPlanets,
  config,
  onUpdate,
}: {
  error: string | undefined;
  lobbyAddress: EthAddress | undefined;
  status: Status;
  statusMessage: string;
  onCreate: () => Promise<void>;
  createPlanets: () => Promise<void>;
  config: LobbyConfigState;
  onUpdate: (lobbyConfigAction: LobbyConfigAction) => void;
}) {
  const { path: root } = useRouteMatch();

  const createDisabled = status === 'creating' || status === 'created';
  const creating = status === 'creating' || (status === 'created' && !lobbyAddress);
  const created = status === 'created' && lobbyAddress;

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

  const url = `${window.location.origin}/play/${lobbyAddress}`;

  let lobbyContent: JSX.Element | undefined;
  if (status === 'created' && lobbyAddress) {
    lobbyContent = (
      <>
        <Row>
          <MythicLabelText style={{ margin: 'auto' }} text='Your universe has been created!' />
        </Row>
        <Row>
          <span style={{ margin: 'auto' }}>
            You can also share the direct url with your friends:
          </span>
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
  }

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
          Welcome Cadet! You can launch a copy of Dark Forest from this UI. We call this a Lobby.
          <Spacer height={12} />
          All settings will be defaulted to the same configuration of the main contract you are
          copying. However, you can change any of those settings through the buttons below!
          <Spacer height={12} />
        </div>
        {buttons}
        <Spacer height={20} />
        <div>
        <Btn size='stretch' disabled={createDisabled} onClick={onCreate}>
          {created ? (
            'Universe created'
          ) : creating ? (
            <LoadingSpinner initialText={statusMessage} />
          ) : (
            'Create Lobby'
          )}
        </Btn>
        <Row style={jcFlexEnd}>
          <LinkButton to={`/extras`}>Planets & Whitelist →</LinkButton>
        </Row>
        <Row>
          <Warning>{error}</Warning>
        </Row>
        {lobbyContent}
        </div>
      </>
    );
  };

  return (
    <>
      <Switch>
        <Route path={root} exact={true}>
          {content}
        </Route>
        {routes}
        <Route path={`${root}/extras`}>
          <ExtrasNavPane
            error={error}
            lobbyAddress={lobbyAddress}
            status={status}
            statusMessage={statusMessage}
            onCreate={onCreate}
            createPlanets={createPlanets}
            config={config}
            onUpdate={onUpdate}
          />
        </Route>
      </Switch>
    </>
  );
}
