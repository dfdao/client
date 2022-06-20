/** This file contains some common utilities used by the Lobbies UI */
import { Initializers } from '@darkforest_eth/settings';
import { EthAddress } from '@darkforest_eth/types';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { Btn, ShortcutBtn } from '../../Components/Btn';
import { Title } from '../../Components/CoreUI';
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

export const removeAlphabet = (str: string) => str.replace(/[^0-9]/g, '');

export const PlanetIcon = () => {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='10' cy='10' r='10' fill='white' />
    </svg>
  );
};

export const FoundryIcon = () => {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M4.21683 18.1581C2.85497 17.1927 1.75646 15.9017 1.02146 14.4029C0.286466 12.9041 -0.0616225 11.2452 0.00893698 9.57732L10 10L4.21683 18.1581Z'
        fill='white'
      />
      <path
        d='M13.6698 0.697707C15.8162 1.54449 17.6038 3.10751 18.7294 5.12178C19.8551 7.13605 20.2495 9.47761 19.8458 11.7495L10 10L13.6698 0.697707Z'
        fill='white'
      />
    </svg>
  );
};

export const QuasarIcon = () => {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M5 1.33975C5.90921 0.814812 6.89542 0.43633 7.92237 0.218207L10 10L5 1.33975Z'
        fill='white'
      />
      <ellipse
        cx='10.5001'
        cy='10'
        rx='7.5'
        ry='1'
        transform='rotate(-15 10.5001 10)'
        fill='white'
      />
      <path
        d='M15 18.6603C14.0908 19.1852 13.1046 19.5637 12.0776 19.7818L10 10L15 18.6603Z'
        fill='white'
      />
    </svg>
  );
};

export const SpacetimeIcon = () => {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M6.23882 2.38178C1.86224 4.27066 4.05053 4.27066 3.61287 6.63176C2.59164 7.891 0.461656 10.6928 0.11153 11.8261C-0.326128 13.2428 0.549188 16.5484 2.29982 15.6039C4.05045 14.6595 3.61287 17.0206 6.23882 18.9095C8.86477 20.7983 10.1777 19.8539 16.7425 18.9095C23.3074 17.965 17.6178 17.4928 19.3685 12.7706C21.1191 8.04838 17.6178 9.93727 14.9919 8.5206C12.366 7.10394 14.5542 6.63176 13.2413 2.38178C11.9283 -1.86821 10.6154 0.492894 6.23882 2.38178Z'
        fill='white'
      />
    </svg>
  );
};

export const AsteroidIcon = () => {
  return (
    <svg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M18.5769 7.71191C18.8882 9.36008 18.3049 11.2272 17.0268 12.9365C15.7492 14.6453 13.7994 16.1591 11.4743 17.0429C9.14919 17.9267 6.92705 17.9987 5.21827 17.4251C3.50895 16.8514 2.34576 15.6481 2.03445 13.9999C1.72314 12.3518 2.3064 10.4847 3.58448 8.77534C4.86217 7.06655 6.81197 5.55271 9.13705 4.66891C11.4621 3.78511 13.6843 3.71314 15.3931 4.28672C17.1024 4.86047 18.2656 6.06374 18.5769 7.71191Z'
        stroke='white'
      />
      <circle cx='16.2664' cy='12.6306' r='3.5' fill='white' />
      <circle cx='5.54175' cy='6.75842' r='2.5' fill='white' />
    </svg>
  );
};
