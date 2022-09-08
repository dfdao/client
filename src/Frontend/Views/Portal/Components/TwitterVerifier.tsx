import React, { useEffect, useMemo, useState } from 'react';
import {
  disconnectTwitter,
  getAllTwitters,
  verifyTwitterHandle,
} from '../../../../Backend/Network/UtilityServerAPI';
import { Twitter } from '../../../Components/Icons';
import styled from 'styled-components';
import { useEthConnection, useTwitters } from '../../../Utils/AppHooks';
import { theme } from '../styleUtils';
import { LoadingSpinner } from '../../../Components/LoadingSpinner';

type VerifyState = 'waiting' | 'loading' | 'success' | 'error';

export const TwitterVerifier: React.FC<{ twitter: string | undefined }> = ({ twitter }) => {
  const eth = useEthConnection();
  const [username, setUsername] = useState<string | undefined>();
  const [uiState, setUiState] = useState<VerifyState>('waiting');
  const [verifiedSuccess, setVerifiedSuccess] = useState<boolean>(false);
  const { twitters, setTwitters } = useTwitters();
  if (!eth) return <LoadingSpinner />;

  const onTweetClick = async () => {
    if (username) {
      const sanitizedUsername = username.replace(/[^a-zA-Z0-9_]/g, '');
      const tweetText = await eth.signMessage(sanitizedUsername);
      const str = `Verifying my @d_fdao arena account (https://arena.dfdao.xyz): ${tweetText}`;
      window.open(`https://twitter.com/intent/tweet?hashtags=dfdao&text=${encodeURI(str)}`);
    }
  };
  const onVerify = async () => {
    if (!username) return;
    try {
      setUiState('loading');
      const sig = await eth.signMessageObject({ twitter: username });
      const verified = await verifyTwitterHandle(sig);
      if (verified) {
        setVerifiedSuccess(true);
        const allTwitters = await getAllTwitters();
        setTwitters(allTwitters);
      }
    } catch (e) {
      setUiState('error');
    } finally {
      setUiState('waiting');
    }
  };

  const onDisconnect = async () => {
    if (!twitter) {
      console.log('no twitter to disconnect');
      return;
    }
    try {
      setUiState('loading');
      const sig = await eth.signMessageObject({ twitter });
      const disconnectSuccess = await disconnectTwitter(sig);
      if (disconnectSuccess) {
        const allTwitters = await getAllTwitters();
        setTwitters(allTwitters);
      }
    } catch (e) {
      setUiState('error');
    } finally {
      setUiState('waiting');
    }
  };

  if (twitter !== undefined) {
    return (
      <Row>
        <Button
          onClick={() => {
            window.open(`https://twitter.com/${twitter}`, '_blank');
          }}
        >
          <Twitter width='24px' height='24px' />
          Twitter
        </Button>
        <Button onClick={onDisconnect}>Disconnect Twitter</Button>
      </Row>
    );
  } else {
    return (
      <Container>
        {uiState === 'error' && <div>error</div>}
        <span>Connect Twitter account</span>
        <Input
          placeholder='Twitter username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          disabled={!username || username.length < 4 || verifiedSuccess}
          onClick={onTweetClick}
        >
          <Twitter width='16px' height='16px' /> <span>Tweet to connect</span>
        </Button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ marginBottom: theme.spacing.md }}>Verify ownership after tweeting</span>
          {uiState !== 'loading' ? (
            <Button
              disabled={!username || username.length < 4 || verifiedSuccess}
              onClick={onVerify}
            >
              Verify
            </Button>
          ) : (
            <LoadingSpinner />
          )}
          {verifiedSuccess && <span>Verified!</span>}
        </div>
      </Container>
    );
  }
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.bg2};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.md};
  width: 100%;
  gap: ${theme.spacing.md};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bg2};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.md};
  font-family: ${theme.fonts.mono};
  gap: ${theme.spacing.sm};
  transition: 0.2s all ease-in-out;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:hover:not([disabled]) {
    background: ${theme.colors.bg3};
  }
`;

const Input = styled.input`
  background: ${theme.colors.bg1};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius};
  color: ${theme.colors.fgPrimary};
  border: 1px solid ${theme.colors.bg2};
`;

const Row = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;
