import { EthAddress } from '@darkforest_eth/types';
import _ from 'lodash';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Btn } from '../../Components/Btn';
import { Spacer, Title } from '../../Components/CoreUI';
import { MythicLabelText } from '../../Components/Labels/MythicLabel';
import { Row } from '../../Components/Row';
import { TextPreview } from '../../Components/TextPreview';
import { CreatePlanetPane } from './CreatePlanetPane';
import { ButtonRow, LinkButton, LobbiesPaneProps, NavigationTitle, Warning } from './LobbiesUtils';
import { LobbyConfigAction, LobbyConfigState } from './Reducer';
import { WhitelistPane } from './WhitelistPane';

interface PaneConfig {
  title: string;
  shortcut: string;
  path: string;
  Pane: (props: LobbiesPaneProps) => JSX.Element;
}

const panes: ReadonlyArray<PaneConfig> = [
  {
    title: 'Create planets',
    shortcut: `+`,
    path: '/create',
    Pane: (props: LobbiesPaneProps) => <CreatePlanetPane {...props} />,
  },
  {
    title: 'Whitelist players',
    shortcut: `+`,
    path: '/whitelist',
    Pane: (props: LobbiesPaneProps) => <WhitelistPane {...props} />,
  },
] as const;

type Status = 'creating' | 'created' | 'errored' | undefined;

export function ExtrasNavPane({
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
  const history = useHistory();

  const { path: root } = useRouteMatch();

  const handleEnter = () => {
    () => window.open(url)
  }

  const buttons = _.chunk(panes, 2).map(([fst, snd], idx) => {
    return (
      // Index key is fine here because the array is stable
      <ButtonRow key={idx}>
        {fst && (
          <LinkButton to={fst.path} shortcut={fst.shortcut}>
            {fst.title}
          </LinkButton>
        )}
        {snd && (
          <LinkButton to={snd.path} shortcut={snd.shortcut}>
            {snd.title}
          </LinkButton>
        )}
      </ButtonRow>
    );
  });

  const url = `${window.location.origin}/play/${lobbyAddress}`;

  const toGameSettings = () => {
    history.goBack();
  }
  let lobbyContent: JSX.Element | undefined;
  if (status === 'created' && lobbyAddress) {
    lobbyContent = (
      <>
        {config.ADMIN_PLANETS.currentValue.length > 0 && (
          <>
            <Btn size='stretch' onClick={createPlanets}>
              Create Planets
            </Btn>
            <Row />
          </>
        )}
      
        <Btn size='stretch' onClick={handleEnter}>
          Enter Universe
        </Btn>
        
        <Row>
          {/* Stealing MythicLabelText because it accepts variable text input */}
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
    console.log(root);
    return (
      <>
        <Title slot='title'>Customize Lobby</Title>
        <div>
          Now add planets and players to your universe!
          <Spacer height={12} />
          Remember, if you want to play with manual spawning, you must create at least one 
          spawn planet to enter the world.
          <Spacer height={12} />
        </div>
        {buttons}
        <Spacer height={50} />
        <Row>
          <Btn onClick = {toGameSettings}>← World Settings</Btn>
        </Row>
        <Row>
          <Warning>{error}</Warning>
        </Row>
        {lobbyContent}
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
      </Switch>
    </>
  );
}
