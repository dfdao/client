/** This file contains some common utilities used by the Lobbies UI */
import { Initializers } from '@darkforest_eth/settings';
import { EthAddress, LocationId, WorldCoords } from '@darkforest_eth/types';
import React, { ChangeEvent, MouseEventHandler, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { Btn, ShortcutBtn } from '../../Components/Btn';
import { Select, Title } from '../../Components/CoreUI';
import { Row } from '../../Components/Row';
import { Red } from '../../Components/Text';
import { LobbyConfigAction, LobbyConfigState, toInitializers } from './Reducer';

export declare type LobbyPlanet = {
  x: number;
  y: number;
  level: number;
  planetType: number;
  isTargetPlanet: boolean;
  isSpawnPlanet: boolean;
  blockedPlanetLocs: WorldCoords[];
};

export interface LobbiesPaneProps {
  config: LobbyConfigState;
  onUpdate: (change: LobbyConfigAction) => void;
}

export const ButtonRow = styled(Row)`
  gap: 8px;

  .button {
    flex: 1 1 50%;
  }
`;

export const mirrorX = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='20'
    style={{ fill: '#bbbbbb' }}
  >
    <g>
      <path d='M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z' />
    </g>
  </svg>
);

export const mirrorY = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='20'
    transform='rotate(90)'
    style={{ fill: '#bbbbbb' }}
  >
    <g>
      <path d='M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z' />
    </g>
  </svg>
);

export function LinkButton({
  to,
  shortcut,
  children,
  disabled = false,
}: React.PropsWithChildren<{ to: string; shortcut?: string; disabled?: boolean }>) {
  const { url } = useRouteMatch();
  const history = useHistory();

  function navigate() {
    history.push(`${url}${to}`);
  }

  // Adding className="button" so ButtonRow will add the flex stuff
  return (
    <ShortcutBtn
      className='button'
      size='stretch'
      onClick={navigate}
      onShortcutPressed={navigate}
      shortcutKey={shortcut}
      shortcutText={shortcut}
      disabled={disabled}
    >
      {children}
    </ShortcutBtn>
  );
}

export function NavigationTitle({ children }: React.PropsWithChildren<unknown>) {
  const history = useHistory();

  const shortcut = 't';

  function goBack() {
    history.goBack();
  }

  return (
    <>
      <ShortcutBtn
        slot='title'
        size='small'
        onClick={goBack}
        onShortcutPressed={goBack}
        shortcutKey={shortcut}
        shortcutText={shortcut}
      >
        back
      </ShortcutBtn>
      <Title slot='title'>{children}</Title>
    </>
  );
}

export function Warning({ children }: React.PropsWithChildren<unknown>) {
  if (!children) {
    return null;
  } else {
    return (
      <div style={{ margin: 'auto', maxWidth: '80%', textAlign: 'center' }}>
        <Red>Error:</Red> {children}
      </div>
    );
  }
}

export function ConfigDownload({
  onError,
  address,
  config,
  renderer: Renderer,
  disabled = false,
}: {
  onError: (msg: string) => void;
  address: EthAddress | undefined;
  config: LobbyConfigState;
  renderer?: () => JSX.Element;
  disabled?: boolean;
}) {
  function doDownload() {
    try {
      const initializers = toInitializers(config);
      const blob = new Blob([JSON.stringify(initializers, null, 2)], { type: 'application/json' });
      const name = address
        ? `${address.substring(0, 6)}-lobbies-config.json`
        : 'lobbies-config.json';
      const blobAsUrl = (window.webkitURL || window.URL).createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobAsUrl;
      anchor.download = name;
      anchor.click();
    } catch (err) {
      console.error(err);
      onError('Unable to download config file');
    }
  }

  if (Renderer) {
    return (
      <div onClick={doDownload}>
        <Renderer />
      </div>
    );
  } else {
    return (
      <Btn disabled={disabled} slot='title' size='small' onClick={doDownload}>
        Download map (JSON)
      </Btn>
    );
  }
}

export function ConfigUpload({
  onError,
  onUpload,
  disabled = false,
  renderer: Renderer,
}: {
  onError: (msg: string) => void;
  onUpload: (initializers: Initializers) => void;
  disabled?: boolean;
  renderer?: () => JSX.Element;
}) {
  function doUpload() {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        try {
          onUpload(JSON.parse(reader.result));
        } catch (err) {
          onError('Cannot process uploaded JSON');
        }
      } else {
        onError('Could not read uploaded file');
      }
    };
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = 'application/json'; // enforce only JSON file uploads in file picker
    inputFile.onchange = () => {
      try {
        const file = inputFile.files?.item(0);

        if (file) {
          reader.readAsText(file);
        } else {
          onError('Could not find a file to upload');
        }
      } catch (err) {
        console.error(err);
        onError('Upload failed');
      }
    };
    inputFile.click();
  }

  if (Renderer) {
    return (
      <div onClick={doUpload}>
        <Renderer />
      </div>
    );
  } else {
    return (
      <Btn disabled={disabled} slot='title' size='small' onClick={doUpload}>
        Upload custom map (JSON)
      </Btn>
    );
  }
}

export function SelectMultipleFrom({
  options,
  values,
  setValues,
  style,
  wide,
}: {
  options: WorldCoords[];
  values: WorldCoords[];
  setValues: (values: WorldCoords[]) => void;
  style?: React.CSSProperties;
  wide?: boolean;
}) {

  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log('e:', e);
    // else setValues([...values, elem]);
  };

  const optionStrings = options.map((option) => `x: ${option.x}, y: ${option.y}`);

  const v = `${values.length} selected`;

  return (
    <Select wide={wide} style={style} value={v} onChange={onSelect}>
      {[v, ...optionStrings].map((label, i) => {
        return (
          <option key={`label-${i}`} value={i}>
            {label}
            {values.find((v) => label == `x: ${v.x}, y: ${v.y}`) && ' f'}
          </option>
        );
      })}
    </Select>
  );
}

export const removeAlphabet = (str: string) => str.replace(/[^0-9]/g, '');

export const CloseButton: React.FC<{ onClick: (e?: any) => void }> = ({ onClick }) => {
  return (
    <CloseButtonStyle onClick={onClick}>
      <CloseIcon />
    </CloseButtonStyle>
  );
};

export const CloseIcon = () => {
  return (
    <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      ></path>
    </svg>
  );
};

export const CloseButtonStyle = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 4px;
  background-color: #3e3e3e;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: #505050;
  }
`;

export const DEFAULT_PLANET: LobbyPlanet = {
  x: 0,
  y: 0,
  level: 0,
  planetType: 0,
  isTargetPlanet: false,
  isSpawnPlanet: false,
  blockedPlanetLocs: [],
};

export const PLANET_TYPE_NAMES = ['Planet', 'Asteroid Field', 'Foundry', 'Spacetime Rip', 'Quasar'];
