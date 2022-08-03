import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TimeUntil } from '../../Components/TimeUntil';
import { competitiveConfig, tutorialConfig } from '../../Utils/constants';
import { OfficialGameBanner } from './Components/OfficialGameBanner';

const dummyData = [
  {
    description: 'fjkgdsahghdkflhkaasdfsdf',
    startTime: 1659383103265,
    endTime: 1659555903265,
    configHash: '0x55911a7c9a236e6cdc1f4e8b63362668eff237a9d0d3c242ff1f5c27901b079d',
    id: 2,
  },
  {
    description: 'A short description of the round ruleset. Blah blah blah. Rules rules rules.',
    startTime: 1659713036400,
    endTime: 1660577036400,
    configHash: '0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930',
    id: 3,
  },
];

export const PortalHomeView: React.FC<{}> = () => {
  const [rounds, setRounds] = useState<
    {
      description: string;
      startTime: number;
      endTime: number;
      configHash: string;
      id: number;
    }[]
  >();

  const [current, setCurrent] = useState<boolean>(false);
  const [finalTime, setFinalTime] = useState<number>();
  const [roundConfig, setRoundConfig] = useState<string>();
  useEffect(() => {
    const fetchRounds = async () => {
      // await fetch(`${process.env.DFDAO_WEBSERVER_URL}/rounds`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      const data = dummyData.sort((a, b) => a.startTime - b.endTime);

      setRounds(data);
      const now = Date.now();
      console.log(now);
      for (const round of data) {
        if (round.startTime > now) {
          setFinalTime(round.startTime);
          setRoundConfig(round.configHash);
          return;
        }

        if (round.startTime < now && round.endTime > now) {
          setFinalTime(round.endTime);
          setCurrent(true);
          setRoundConfig(round.configHash);
          return;
        }
      }
    };

    fetchRounds();
  }, []);

  const title = current ? 'Race the Grand Prix' : "Practice Last Week's Grand Prix";
  const description = !finalTime ? (
    <>No round scheduled</>
  ) : current ? (
    <>
      This round ends in <TimeUntil timestamp={finalTime} ifPassed='zero seconds!' />
    </>
  ) : (
    <>
      Next round starts in <TimeUntil timestamp={finalTime} ifPassed='zero seconds!' />
    </>
  );
  const link = `/portal/map/${roundConfig}`;

  return (
    <Container>
      <Content>
        <span style={{ fontSize: '3em', gridColumn: '1/7' }}>Welcome to Dark Forest Arena!</span>
        <OfficialGameBanner
          title={title}
          description={description}
          style={{ gridColumn: '1 / 5', gridRow: '2/4' }}
          link={link}
          imageUrl='/public/img/deathstar.png'
        />
        <OfficialGameBanner
          title='Previous Rounds'
          style={{ gridColumn: '5 / 7', gridRow: '2/3' }}
          link='/portal/history'
          imageUrl='/public/img/deathstar.png'
          disabled
        />
        <OfficialGameBanner
          title='Find a match'
          style={{ gridColumn: '5 / 7', gridRow: '3/4' }}
          link='/portal/matchmaking'
          imageUrl='/public/img/deathstar.png'
        />
        <OfficialGameBanner
          title='Tutorial (IP)'
          disabled
          style={{ gridColumn: '1 / 3', gridRow: '4/5' }}
          link={`/portal/map/${tutorialConfig}`}
          imageUrl='/public/img/tutorial-banner.png'
        />
        <OfficialGameBanner
          title='Create a map'
          style={{ gridColumn: '3 / 5', gridRow: '4/5' }}
          link={`/arena`}
          imageUrl='/public/img/deathstar.png'
        />
        <OfficialGameBanner
          title='Community Maps'
          style={{ gridColumn: '5 / 7', gridRow: '4/5' }}
          link={`/portal/community`}
          imageUrl='/public/img/deathstar.png'
        />
      </Content>
    </Container>
  );
};
const Content = styled.div`
  display: grid;
  height: 100%;
  overflow: hidden;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 50px repeat(2, calc(30% - 40px)) calc(40% - 40px);
  grid-gap: 16px;
  padding: 24px;
  height: 100%;
  width: 70%;
`;
const Container = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
  height: calc(100vh - 56px);
`;

// TODO: Replace this with LobbyButton when #68 is merged
export const ArenaPortalButton = styled.button<{ secondary?: boolean }>`
  padding: 8px 16px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: ${({ secondary }) => (!secondary ? '2px solid #2EE7BA' : '1px solid #5F5F5F')};
  color: ${({ secondary }) => (!secondary ? '#2EE7BA' : '#fff')};
  background: ${({ secondary }) => (!secondary ? '#09352B' : '#252525')};
  padding: 16px;
  border-radius: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 80ms ease 0s, border-color;
  &:hover {
    background: ${({ secondary }) => (!secondary ? '#0E5141' : '#3D3D3D')};
    border-color: ${({ secondary }) => (!secondary ? '#30FFCD' : '#797979')};
  }
`;

const MoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-gap: 10px;
  margin-top: 16px;
`;

const MoreMapsContainer = styled.div`
  overflow-y: auto;
`;
