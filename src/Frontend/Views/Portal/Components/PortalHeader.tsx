import React from 'react';
import { Account } from '../Account';
import { theme } from '../styleUtils';
import { TabNav } from './TabNav';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useConfigFromHash, useEthConnection } from '../../../Utils/AppHooks';
import { tutorialConfig } from '../../../Utils/constants';
import { MinimalButton } from '../PortalMainView';
import { populate, populateBulk } from '../../../../Backend/Utils/Populate';
import { address } from '@darkforest_eth/serde';
import { Logo } from '../../../Panes/Lobby/LobbiesUtils';
import { loadRegistry } from '../../../../Backend/Network/GraphApi/GrandPrixApi';
import { CONTRACT_ADDRESS } from '@darkforest_eth/contracts';

export const PortalHeader = () => {
  const history = useHistory();
  const connection = useEthConnection();
  const playerAddress = connection.getAddress();

  const { lobbyAddress: tutorialLobbyAddress } = useConfigFromHash(tutorialConfig);
  return (
    <Container>
      <TitleContainer>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxHeight: '56px',
            padding: '8px',
            cursor: 'pointer',
          }}
          onClick={() => history.push('/portal/home')}
        >
          <Logo width={56} />
        </div>
        {process.env.NODE_ENV !== 'production' ? (
          <MinimalButton
            onClick={async () => {
              await populateBulk(connection, address(CONTRACT_ADDRESS), 5);
              //await populate(connection, address(CONTRACT_ADDRESS));
            }}
          >
            Populate
          </MinimalButton>
        ) : null}
      </TitleContainer>

      <TabNav
        tabs={[
          {
            label: 'Play',
            to: '/portal/home',
          },
          {
            label: 'History',
            to: `/portal/history/${playerAddress}`,
            wildcard: playerAddress,
          },
          {
            label: 'Create',
            to: '/arena',
          },
          {
            label: 'Community',
            to: `/portal/community`,
          },
          {
            label: 'Learn',
            dropdown: [
              {
                label: 'Tutorial',
                to: `/play/${tutorialLobbyAddress}?create=true`,
                secondary: 'Play a guided tutorial game.',
              },
              {
                label: 'Strategy Guide',
                to: 'https://www.notion.so/cha0sg0d/Dark-Forest-Player-Guide-59e123fb6cbb43f785d24be035cf95cb',
                secondary: 'Learn strategies for playing Dark Forest.',
              },
            ],
            to: '',
          },
        ]}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.lg,
        }}
      >
        <Btn>
          <QuestionMark />
        </Btn>
        <Account />
      </div>
    </Container>
  );
};

const Container = styled.header`
  display: grid;
  grid-template-columns: min-content auto max-content;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${theme.spacing.lg};
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const Btn = styled.button`
  background: ${theme.colors.bg2};
  color: ${theme.colors.fgMuted};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.bg3};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    background: ${theme.colors.bg3};
    color: ${theme.colors.fgPrimary};
  }
`;

const QuestionMark = () => (
  <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M5.07505 4.10001C5.07505 2.91103 6.25727 1.92502 7.50005 1.92502C8.74283 1.92502 9.92505 2.91103 9.92505 4.10001C9.92505 5.19861 9.36782 5.71436 8.61854 6.37884L8.58757 6.4063C7.84481 7.06467 6.92505 7.87995 6.92505 9.5C6.92505 9.81757 7.18248 10.075 7.50005 10.075C7.81761 10.075 8.07505 9.81757 8.07505 9.5C8.07505 8.41517 8.62945 7.90623 9.38156 7.23925L9.40238 7.22079C10.1496 6.55829 11.075 5.73775 11.075 4.10001C11.075 2.12757 9.21869 0.775024 7.50005 0.775024C5.7814 0.775024 3.92505 2.12757 3.92505 4.10001C3.92505 4.41758 4.18249 4.67501 4.50005 4.67501C4.81761 4.67501 5.07505 4.41758 5.07505 4.10001ZM7.50005 13.3575C7.9833 13.3575 8.37505 12.9657 8.37505 12.4825C8.37505 11.9992 7.9833 11.6075 7.50005 11.6075C7.0168 11.6075 6.62505 11.9992 6.62505 12.4825C6.62505 12.9657 7.0168 13.3575 7.50005 13.3575Z'
      fill='currentColor'
      fillRule='evenodd'
      clipRule='evenodd'
    ></path>
  </svg>
);
