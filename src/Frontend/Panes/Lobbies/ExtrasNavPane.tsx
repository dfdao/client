import _ from 'lodash';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { LobbyAdminTools } from '../../../Backend/Utils/LobbyAdminTools';
import { Btn } from '../../Components/Btn';
import { Spacer, Title } from '../../Components/CoreUI';
import { Row } from '../../Components/Row';
import { CreatePlanetPane } from './CreatePlanetPane';
import { ButtonRow, LinkButton, LobbiesPaneProps, NavigationTitle } from './LobbiesUtils';
import { LobbyConfigAction, LobbyConfigState } from './Reducer';
import { WhitelistPane } from './WhitelistPane';

interface PaneConfig {
  title: string;
  shortcut: string;
  path: string;
  Pane: (props: LobbiesPaneProps, lobbyAdminTools: LobbyAdminTools) => JSX.Element;
}

const panes: ReadonlyArray<PaneConfig> = [
  {
    title: 'Create planets',
    shortcut: `+`,
    path: '/create',
    Pane: (props: LobbiesPaneProps, lobbyAdminTools: LobbyAdminTools) => (
      <CreatePlanetPane
        config={props.config}
        onUpdate={props.onUpdate}
        lobbyAdminTools={lobbyAdminTools}
      />
    ),
  },
  {
    title: 'Add players',
    shortcut: `+`,
    path: '/allowlist',
    Pane: (props: LobbiesPaneProps, lobbyAdminTools: LobbyAdminTools) => (
      <WhitelistPane
        config={props.config}
        onUpdate={props.onUpdate}
        lobbyAdminTools={lobbyAdminTools}
      />
    ),
  },
] as const;

export function ExtrasNavPane({
  lobbyAdminTools,
  config,
  onUpdate,
}: {
  lobbyAdminTools: LobbyAdminTools | undefined;
  config: LobbyConfigState;
  onUpdate: (lobbyConfigAction: LobbyConfigAction) => void;
}) {
  const history = useHistory();

  const { path: root } = useRouteMatch();

  const handleEnter = () => {
    const warnings = [];
    if (config.ADMIN_PLANETS.displayValue && config.ADMIN_PLANETS.displayValue.length > 0) {
      warnings.push('Some planets are still staged for creation');
    }
    if (config.WHITELIST.displayValue && config.WHITELIST.displayValue.length > 0) {
      warnings.push('Some addresses are still staged for allowlist');
    }
    if (
      config.MANUAL_SPAWN.displayValue &&
      !lobbyAdminTools?.planets.find((p) => p.isSpawnPlanet)
    ) {
      warnings.push('Manual spawn is active but no spawn planets have been created');
    }
    if (
      config.TARGET_PLANETS.displayValue &&
      !lobbyAdminTools?.planets.find((p) => p.isTargetPlanet)
    ) {
      warnings.push('Target planets are active but no target planets have been created');
    }
    if (warnings.length > 0) {
      const confirmed = confirm(
        `WARNING: \n${warnings.reduce(
          (prev, curr, idx) => prev.concat(`${idx + 1}: ${curr}\n`),
          ''
        )} Do you want to continue?`
      );
      if (!confirmed) return;
    }
    window.open(url);
  };

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

  const url = `${window.location.origin}/play/${lobbyAdminTools?.address}`;

  const toGameSettings = () => {
    history.goBack();
  };

  const content = () => {
    console.log(root);
    return (
      <>
        <Title slot='title'>Customize Lobby</Title>
        <div>
          Now add planets and players to your universe!
          <Spacer height={12} />
          Remember, if you want to play with manual spawning, you must create at least one spawn
          planet.
          <Spacer height={12} />
        </div>
        {buttons}
        <Spacer height={50} />
        <Row>
          <Btn onClick={toGameSettings}>← World Settings</Btn>
        </Row>
        {lobbyAdminTools?.address && (
          <Btn size='stretch' onClick={handleEnter}>
            Enter Universe
          </Btn>
        )}
      </>
    );
  };

  return (
    <>
      <Switch>
        <Route path={root} exact={true}>
          {content}
        </Route>
        <Route path={`${root}/create`}>
          <NavigationTitle>Create planets</NavigationTitle>

          <CreatePlanetPane config={config} onUpdate={onUpdate} lobbyAdminTools={lobbyAdminTools} />
        </Route>
        <Route path={`${root}/allowlist`}>
          <NavigationTitle>Add players</NavigationTitle>
          <WhitelistPane config={config} onUpdate={onUpdate} lobbyAdminTools={lobbyAdminTools} />
        </Route>
      </Switch>
    </>
  );
}
