import React, { useState } from 'react';
import styled from 'styled-components';
import { DEFAULT_PLANET, LobbyPlanet } from '../Panes/Lobbies/LobbiesUtils';

export interface LobbyPlanetPropEditorProps {
  selectedPlanet: LobbyPlanet;
  onUpdatePlanet: (planet: LobbyPlanet) => void;
  root: string;
}

export const LobbyPlanetPropEditor: React.FC<LobbyPlanetPropEditorProps> = ({
  selectedPlanet = DEFAULT_PLANET,
  onUpdatePlanet,
}) => {
  const [mutablePlanet, setMutablePlanet] = useState<LobbyPlanet>(selectedPlanet);
  return <div></div>;
};

const LabeledInput = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const InspectorInput = styled.input`
  border-radius: 2px;
  cursor: default;
  box-sizing: border-box;
  background-clip: padding-box;
  background-color: transparent;
  width: 100%;
  padding: 0 0 0 7px;
  height: 28px;
  border: 1px solid transparent;
  transition: 0.2s ease-in-out;
  min-width: 0;
  &:hover {
    border-color: gray;
  }
`;
