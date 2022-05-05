import { CONTRACT_ADDRESS } from '@darkforest_eth/contracts';
import { address } from '@darkforest_eth/serde';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { EmSpacer, Link, Spacer, Title } from '../Components/CoreUI';
import { EmailCTA, EmailCTAMode } from '../Components/Email';
import { Modal } from '../Components/Modal';
import { Red, Sub, Text, White } from '../Components/Text';
import dfstyles from '../Styles/dfstyles';
import { ArenaLeaderboard } from '../Views/ArenaLeaderboard';
import { LandingPageRoundArt } from '../Views/LandingPageRoundArt';

export const enum LandingPageZIndex {
  Background = 0,
  Canvas = 1,
  BasePage = 2,
}

const links = {
  twitter: 'http://twitter.com/darkforest_eth',
  email: 'mailto:contact@zkga.me',
  blog: 'https://blog.zkga.me/',
  discord: 'https://discord.gg/2u2TN6v8r6',
  github: 'https://github.com/darkforest-eth',
};

const defaultAddress = address(CONTRACT_ADDRESS);

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  --df-button-color: ${dfstyles.colors.dfgreen};
  --df-button-border: 1px solid ${dfstyles.colors.dfgreen};
  --df-button-hover-background: ${dfstyles.colors.dfgreen};
  --df-button-hover-border: 1px solid ${dfstyles.colors.dfgreen};
`;

export default function LandingPage() {
  const history = useHistory();

  return (
    <>
      <PrettyOverlayGradient />
      {/* <Hiring /> */}

      <Page>
        <Spacer height={150} />

        <MainContentContainer>
          <Header>
            <LandingPageRoundArt />

            <p>
              <White>Dark Forest</White> <Text>zkSNARK space warfare</Text>
              <br />
              <Red>Battle Arena</Red>
            </p>

            <Spacer height={16} />

            <ButtonWrapper>
              <Btn size='large' onClick={() => history.push(`/lobby/${defaultAddress}`)}>
                Create Arena
              </Btn>
              <Btn
                size='large'
                onClick={() =>
                  window.open(
                    `https://docs.google.com/forms/d/e/1FAIpQLSeYZJtgrw_er3xVzrD3O8bFR2NrhryTfR-ypJKFiR0WaEy8Ww/viewform`
                  )
                }
              >
                Give Feedback
              </Btn>
            </ButtonWrapper>
          </Header>

          <EmSpacer height={3} />

          {/* <Spacer height={32} /> */}

          <EmailWrapper>
            <EmailCTA mode={EmailCTAMode.SUBSCRIBE} />
          </EmailWrapper>

          <Spacer height={16} />

          <VariousLinksContainer>
            <TextLinks>
              <a href={links.email}>email</a>
              <Spacer width={4} />
              <Sub>-</Sub>
              <Spacer width={8} />
              <a href={links.blog}>blog</a>
            </TextLinks>

            <Spacer width={8} />

            <IconLinks>
              <a className={'link-twitter'} href={links.twitter}>
                <span className={'icon-twitter'}></span>
              </a>
              <Spacer width={8} />
              <a className={'link-discord'} href={links.discord}>
                <span className={'icon-discord'}></span>
              </a>
              <Spacer width={8} />
              <a className={'link-github'} href={links.github}>
                <span className={'icon-github'}></span>
              </a>
            </IconLinks>
          </VariousLinksContainer>
        </MainContentContainer>

        <Spacer height={28} />

        {/* <LeadboardDisplay /> */}
        <ArenaLeaderboard/>

        <Spacer height={256} />
      </Page>
    </>
  );
}

const VariousLinksContainer = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PrettyOverlayGradient = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to right bottom, #511111, #5b0023, #5d003c, #510659, #262077);
  background-position: 50%, 50%;
  display: inline-block;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Header = styled.div`
  text-align: center;
`;

const EmailWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const TRow = styled.tr`
  & td:first-child {
    color: ${dfstyles.colors.subtext};
  }
  & td:nth-child(2) {
    padding-left: 12pt;
  }
  & td:nth-child(3) {
    text-align: right;
    padding-left: 16pt;
  }
`;

const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const TextLinks = styled.span`
  vertical-align: center;
  & a {
    transition: color 0.2s;

    &:hover {
      color: ${dfstyles.colors.dfblue};
    }
  }
`;

const IconLinks = styled.span`
  font-size: 18pt;

  & a {
    margin: 0 6pt;
    transition: color 0.2s;
    &:hover {
      cursor: pointer;
      &.link-twitter {
        color: ${dfstyles.colors.icons.twitter};
      }
      &.link-github {
        color: ${dfstyles.colors.icons.github};
      }
      &.link-discord {
        color: ${dfstyles.colors.icons.discord};
      }
      &.link-blog {
        color: ${dfstyles.colors.icons.blog};
      }
      &.link-email {
        color: ${dfstyles.colors.icons.email};
      }
    }
  }
`;

const Page = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
  font-size: ${dfstyles.fontSize};
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: ${LandingPageZIndex.BasePage};
`;

const HallOfFameTitle = styled.div`
  color: ${dfstyles.colors.subtext};
  display: inline-block;
  border-bottom: 1px solid ${dfstyles.colors.subtext};
  line-height: 1em;
`;

function Hiring() {
  return (
    <Modal contain={['top', 'left', 'right']} initialX={50} initialY={50}>
      <Title slot='title'>Dark Forest is Hiring!</Title>
      <div style={{ maxWidth: '300px', textAlign: 'justify' }}>
        We are looking for experienced full stack and solidity developers to join our team! If you
        like what you see,{' '}
        <Link to='https://docs.google.com/forms/d/e/1FAIpQLSdaWvjxX4TrDDLidPXtgk6UW3rC082rpvi3AIPkCPxAahg_rg/viewform?usp=sf_link'>
          consider applying
        </Link>
        . If you know someone who you think would be a great fit for our team,{' '}
        <Link to='https://docs.google.com/forms/d/e/1FAIpQLScku_bQDbkPqpHrwBzOBfQ4SV6Nw6Tgxi6zWQL8Bb0olyBE3w/viewform?usp=sf_link'>
          please refer them here
        </Link>
        .
        <br />
        <br />
        Learn more about the role{' '}
        <Link to='https://ivanchub.notion.site/Dark-Forest-is-Hiring-ad1f0cbe816640fb9b4c663dacaaca04'>
          here
        </Link>
        .
      </div>
    </Modal>
  );
}
