import { CONTRACT_ADDRESS } from '@darkforest_eth/contracts';
import { address } from '@darkforest_eth/serde';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Btn } from '../Components/Btn';
import { EmSpacer, Link, Spacer, Title } from '../Components/CoreUI';
import { EmailCTA, EmailCTAMode } from '../Components/Email';
import { Modal } from '../Components/Modal';
import { HideSmall, Red, Sub, Text, White } from '../Components/Text';
import dfstyles from '../Styles/dfstyles';
import { LandingPageRoundArt } from '../Views/LandingPageRoundArt';
import { LeadboardDisplay } from '../Views/Leaderboard';

export const enum LandingPageZIndex {
  Background = 0,
  Canvas = 1,
  BasePage = 2,
}

const links = {
  twitter: 'http://twitter.com/d_fdao',
  email: 'mailto:contact@zkga.me',
  blog: 'https://medium.com/dfdao',
  discord: 'https://discord.gg/5NJ72xmE',
  github: 'https://github.com/dfdao',
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
      <WhatsNew/>

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
              {/* <Btn size='large' onClick={() => history.push(`/play/${defaultAddress}`)}>
                Join Lobby
              </Btn> */}
            </ButtonWrapper>
          </Header>

          <EmSpacer height={3} />

          <div style={{ color: dfstyles.colors.text }}>
            <HallOfFameTitle>Space Masters</HallOfFameTitle>
            <Spacer height={8} />
            <table>
              <tbody>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.1
                  </td>
                  <td>
                    02/22/<HideSmall>20</HideSmall>20
                  </td>
                  <td>
                    <a href='https://twitter.com/zoink'>Dylan Field</a>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.2
                  </td>
                  <td>
                    06/24/<HideSmall>20</HideSmall>20
                  </td>
                  <td>Nate Foss</td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.3
                  </td>
                  <td>
                    08/07/<HideSmall>20</HideSmall>20
                  </td>
                  <td>
                    <Link to='https://twitter.com/hideandcleanse'>@hideandcleanse</Link>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.4
                  </td>
                  <td>
                    10/02/<HideSmall>20</HideSmall>20
                  </td>
                  <td>
                    <Link to='https://twitter.com/jacobrosenthal'>Jacob Rosenthal</Link>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.5
                  </td>
                  <td>
                    12/25/<HideSmall>20</HideSmall>20
                  </td>
                  <td>0xb05d9542...</td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.6 round 1
                  </td>
                  <td>
                    05/22/<HideSmall>20</HideSmall>21
                  </td>
                  <td>
                    <Link to='https://twitter.com/adietrichs'>Ansgar Dietrichs</Link>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.6 round 2
                  </td>
                  <td>
                    07/07/<HideSmall>20</HideSmall>21
                  </td>
                  <td>
                    <Link to='https://twitter.com/orden_gg'>@orden_gg</Link>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.6 round 3
                  </td>
                  <td>
                    08/22/<HideSmall>20</HideSmall>21
                  </td>
                  <td>
                    <Link to='https://twitter.com/dropswap_gg'>@dropswap_gg</Link>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.6 round 4
                  </td>
                  <td>
                    10/01/<HideSmall>20</HideSmall>21
                  </td>
                  <td>
                    <Link to='https://twitter.com/orden_gg'>@orden_gg</Link>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>v</HideSmall>0.6 round 5
                  </td>
                  <td>
                    02/18/<HideSmall>20</HideSmall>22
                  </td>
                  <td>
                    <Link to='https://twitter.com/d_fdao'>@d_fdao</Link>
                    {' + '}
                    <Link to='https://twitter.com/orden_gg'>@orden_gg</Link>
                  </td>
                </TRow>
              </tbody>
            </table>
          </div>

          <Spacer height={32} />

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

        <Spacer height={128} />

        {/* <LeadboardDisplay /> */}

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
  background-image: linear-gradient(to right bottom, #511111, #5b0023, #5d003c, #510659, #262077);  background-position: 50%, 50%;
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
        <ul>
          <li><i>Spawn Planets</i>, which players automatically spawn on</li>
          <li><i>Target Planets</i>, which players must invade and capture to win</li>
          <li>A <i>move cap</i></li>
          <li>More control over game constants like planet regen and move speed</li>
        </ul>
      </div>
    </Modal>
  );
}

function WhatsNew() {
  return (
    <Modal contain={['top', 'left', 'right']} initialX={50} initialY={50}>
      <Title slot='title'>What's new:</Title>
      <div style={{ maxWidth: '300px', textAlign: 'justify' }}>
        <ul>
          <li> (V0.1) <i>Spawn Planets</i>, which players automatically spawn on</li>
          <li> (V0.1) <i>Target Planets</i>, which players must invade and capture to win</li>
        </ul>
      </div>
    </Modal>
  );
}
