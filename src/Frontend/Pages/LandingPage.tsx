import { CONTRACT_ADDRESS } from '@darkforest_eth/contracts';
import { address } from '@darkforest_eth/serde';
import { IconType } from '@darkforest_eth/ui';
import React, { CSSProperties, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { isRoundOngoing } from '../../Backend/Utils/Utils';
import { Btn } from '../Components/Btn';
import { EmSpacer, Link, Spacer, Title } from '../Components/CoreUI';
import { EmailCTA, EmailCTAMode } from '../Components/Email';
import { Icon } from '../Components/Icons';
import { Modal } from '../Components/Modal';
import { Red, White, Text, HideSmall } from '../Components/Text';
import dfstyles from '../Styles/dfstyles';
import { ArenaLeaderboardDisplay } from '../Views/ArenaLeaderboard';
import { LandingPageRoundArt } from '../Views/LandingPageRoundArt';

export const enum LandingPageZIndex {
  Background = 0,
  Canvas = 1,
  BasePage = 2,
}

const links = {
  twitter: 'http://twitter.com/d_fdao',
  email: 'mailto:zeroxhank@gmail.com',
  blog: 'https://blog.zkga.me/',
  discord: 'https://discord.gg/XxveJpwJ',
  github: 'https://github.com/dfdao',
  wiki: 'https://dfwiki.net/wiki/Main_Page',
  plugins: 'https://plugins.zkga.me/',
};

const defaultAddress = address(CONTRACT_ADDRESS);

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;

  @media only screen and (max-device-width: 1000px) {
    grid-template-columns: auto;
    flex-direction: column;
  }

  --df-button-color: ${dfstyles.colors.dfgreen};
  --df-button-border: 1px solid ${dfstyles.colors.dfgreen};
  --df-button-hover-background: ${dfstyles.colors.dfgreen};
  --df-button-hover-border: 1px solid ${dfstyles.colors.dfgreen};
`;

export default function LandingPage() {
  const history = useHistory();
  const [wallbreakers, setWallbreakers] = useState<boolean>(false);
  return (
    <>
      <BackgroundImage src={'/public/img/epicbattle.jpg'} />
      <TopBar>
        <Icon
          style={{ width: '80px', height: '80px' } as CSSStyleDeclaration & CSSProperties}
          type={IconType.Dfdao}
        />
        <div
          style={{ fontSize: '1.5em' }}
          onMouseEnter={() => setWallbreakers(true)}
          onMouseLeave={() => setWallbreakers(false)}
        >
          Wallbreakers
          
            <WallbreakersContainer >
              {' '}
              <table style={{ width: '100%', display: wallbreakers ? 'block' : 'none'}}>
                <tbody style={{ width: '100%' }}>
                  <TRow>
                    <td>
                      <HideSmall>Week </HideSmall>1
                    </td>
                    <td>
                      <Link to='https://twitter.com/TheVelorum'>Velorum</Link>
                    </td>
                  </TRow>
                  <TRow>
                    <td>
                      <HideSmall>Week </HideSmall>2
                    </td>
                    <td>
                      {' '}
                      <Link to='https://twitter.com/Ner0nzz'>Ner0nzz</Link>
                    </td>
                  </TRow>
                  <TRow>
                    <td>
                      <HideSmall>Week </HideSmall>3
                    </td>
                    <td>
                      {' '}
                      <Link to='https://twitter.com/Ner0nzz'>Ner0nzz</Link>
                    </td>
                  </TRow>
                  <TRow>
                    <td>
                      <HideSmall>Week </HideSmall>4
                    </td>
                    <td>
                      {' '}
                      <Link to='https://twitter.com/ClassicJordon'>ClassicJordon</Link>
                    </td>
                  </TRow>
                  <TRow>
                    <td>
                      <HideSmall>Week </HideSmall>5
                    </td>
                    <td>
                      {' '}
                      <Link to='https://twitter.com/Yuri_v9v'>Yuri_v9v</Link>
                    </td>
                  </TRow>
                </tbody>
              </table>
            </WallbreakersContainer>
          
        </div>
      </TopBar>
      <Main>
        {/* <OnlyMobile>
          <Spacer height={8} />
        </OnlyMobile>
        <HideOnMobile>
          <Spacer height={50} />
        </HideOnMobile> */}

        <MainContentContainer>
          <Header>
            <PageTitle>Dark Forest Arena</PageTitle>
            <Subtitle>
              Play dfdao's fast-paced, free version of the premier on-chain game.{' '}
            </Subtitle>
            <EnterButton onClick={() => history.push('/portal/home')}>Enter</EnterButton>
            <LinkContainer>
              <Link color='#00ff00' to={links.email}>
                email
              </Link>
              <Spacer width={4} />
              <Link color='#00ff00' to={links.blog}>
                blog
              </Link>
              <Spacer width={4} />

              <a className={'link-twitter'} href={links.twitter}>
                <span className={'icon-twitter'}></span>
              </a>
              <Spacer width={4} />
              <a className={'link-discord'} href={links.discord}>
                <span className={'icon-discord'}></span>
              </a>
              <Spacer width={4} />
              <a className={'link-github'} href={links.github}>
                <span className={'icon-github'}></span>
              </a>

              <Spacer width={4} />
              <Link color='#00ff00' to={links.plugins}>
                plugins
              </Link>
              <Spacer width={4} />
              <Link color='#00ff00' to={links.wiki}>
                wiki
              </Link>
            </LinkContainer>

            <OnlyMobile>
              <Spacer height={4} />
            </OnlyMobile>
            <HideOnMobile>
              <Spacer height={16} />
            </HideOnMobile>

            {/* <LandingPageRoundArt /> */}

            <Spacer height={16} />
          </Header>

          {/* <Spacer height={32} /> */}

          {/* <HallOfFame style={{ color: dfstyles.colors.text }}>
            <HallOfFameTitle>Wallbreakers</HallOfFameTitle>
            <Spacer height={8} />
            <table style={{ width: '100%' }}>
              <tbody style={{ width: '100%' }}>
                <TRow>
                  <td>
                    <HideSmall>Week </HideSmall>1
                  </td>
                  <td>
                    06/05/<HideSmall>20</HideSmall>22
                  </td>
                  <td>
                    <Link to='https://twitter.com/TheVelorum'>Velorum</Link>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>Week </HideSmall>2
                  </td>
                  <td>
                    06/11/<HideSmall>20</HideSmall>22
                  </td>
                  <td>
                    {' '}
                    <Link to='https://twitter.com/Ner0nzz'>Ner0nzz</Link>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>Week </HideSmall>3
                  </td>
                  <td>
                    06/18/<HideSmall>20</HideSmall>22
                  </td>
                  <td>
                    {' '}
                    <Link to='https://twitter.com/Ner0nzz'>Ner0nzz</Link>
                  </td>
                </TRow>
                <TRow>
                  <td>
                    <HideSmall>Week </HideSmall>4
                  </td>
                  <td>
                    06/25/<HideSmall>20</HideSmall>22
                  </td>
                  <td>
                    {' '}
                    <Link to='https://twitter.com/ClassicJordon'>ClassicJordon</Link>
                  </td>
                </TRow>
              </tbody>
            </table>
          </HallOfFame> */}
          {/* <Link to='https://medium.com/dfdao/dark-forest-arena-grand-prix-f761896a752e'>
            🏎 Grand Prix Info 🏎
          </Link> */}
          {/* <Spacer height={32} /> */}
          {/* <EmailWrapper>
            <EmailCTA mode={EmailCTAMode.SUBSCRIBE} />
          </EmailWrapper> */}
        </MainContentContainer>
      </Main>
    </>
  );
}

const EnterButton = styled.button`
  font-size: 20pt;
  border-radius: 4px;
  padding: 10px 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #00dc82;
  color: black;
  width: 50%;
`;

const PageTitle = styled.div`
  font-size: 5em;
  3px 3px 13px black;
  font-weight: bold;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;`;

const Subtitle = styled.div`
  font-size: 2em;
  font-weight: bold;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`;
export const BackgroundImage = styled.img`
  width: 100vw;
  height: 100vh;
  // background-image: url(/img/epicbattle.jpg);
  background-size: cover;
  filter: blur(3px) brightness(0.7) saturate(1.5);
  background-position: 50%, 50%;
  display: inline-block;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const TopBar = styled.div`
  // position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100px;
  background: rgba(0, 0, 0, 0.4);
  padding: 64px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-box-pack: end;
  justify-content: flex-end;
  will-change: transform;
  align-items: flex-start;
  width: 80%;
  // height: calc(100vh - 100px);
  height: 100%;
  // padding-bottom: 100px;
  gap: 10px;
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

const button = { minWidth: '200px' } as CSSStyleDeclaration & CSSProperties;

const MainContentContainer = styled.div`
  width: 95%;
  // max-width: 1340px;
  // padding: 64px 0px;
  min-height: 80vh;
  // margin-bottom: 60px;
  // height: calc(100vh - 100px);
  height: 100%;
`;

const Main = styled.div`
  position: absolute;
  width: 100vw;
  max-width: 100vw;
  height: calc(100vh - 180px);
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

export const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    margin: 0 6pt;
    transition: color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;

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

function GrandPrix() {
  return (
    <HideOnMobile>
      <Modal contain={['top', 'left', 'right']} initialX={50} initialY={50}>
        <Title slot='title'>🏎 Grand Prix Info 🏎</Title>
        <div style={{ maxWidth: '300px', textAlign: 'justify' }}>
          Race in the Grand Prix for a $300 prize and NFT trophies! Here is more{' '}
          <Link to='https://medium.com/dfdao/grand-prix-week-4-6b0d9c0174bf'>rules and info</Link>
          .
          <br />
          <br />
          If you are new to Dark Forest, check out our{' '}
          <Link to='https://www.youtube.com/watch?v=3a4i9IyfmBI&list=PLn4H2Bj-iklclFZW_YpKCQaTnBVaECLDK'>
            video tutorials
          </Link>
          , courtesy of <Link to='https://twitter.com/moongate_io'>Moongate Guild</Link>.
          <br />
          <br />
          Or read community member ClassicJordon's{' '}
          <Link to='https://medium.com/@classicjdf/classicjs-dark-forest-101-strategy-guide-part-1-energy-1b80923fee69'>
            beginners strategy guide!
          </Link>
          <br />
          <br />
          Happy racing!
        </div>
      </Modal>
    </HideOnMobile>
  );
}

const HideOnMobile = styled.div`
  @media only screen and (max-device-width: 1000px) {
    display: none;
  }
`;

const OnlyMobile = styled.div`
  @media only screen and (min-device-width: 1000px) {
    display: none;
  }
`;

const Involved = styled.div`
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  grid-auto-rows: minmax(100px, auto);

  @media only screen and (max-device-width: 1000px) {
    grid-template-columns: auto;
  }
`;

const InvolvedItem = styled.a`
  height: 150px;
  display: inline-block;
  margin: 4px;
  padding: 4px 8px;

  background-color: ${dfstyles.colors.backgroundlighter};
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;

  cursor: pointer;
  transition: transform 200ms;
  &:hover {
    transform: scale(1.03);
  }
  &:hover:active {
    transform: scale(1.05);
  }
`;

const HallOfFame = styled.div`
  @media only screen and (max-device-width: 1000px) {
    font-size: 70%;
  }
`;

const WallbreakersContainer = styled.div`
  right: 0;
  padding: 10px;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: space-between;
  background: rgba(0, 0, 0, 0.2);
`;
