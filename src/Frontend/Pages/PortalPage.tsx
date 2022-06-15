import React from 'react';
import styled from 'styled-components';
import { SpyArenaDisplay } from '../Views/SpyArenas';
import { TabbedView } from '../Views/TabbedView';
import { PrettyOverlayGradient } from './LandingPage';


export function PortalPage() {
  return (
    <>
      <PrettyOverlayGradient />
      <TabContainer><SpyArenaDisplay/></TabContainer>
      {/* <TabbedView
        style={{ padding: '5em', height: '100vh', display: 'flex', flexDirection: 'column'}}
        buttonStyle={buttonStyle}
        tabTitles={['Live Races', 'Find a Battle', 'View Battle']}
        tabContents={(i) => <TabContainer>{i === 0 ? <SpyArenaDisplay/> : <>yo daddy</>}</TabContainer>}
      /> */}
    </>
  );
}

const buttonStyle = {
  fontSize: '3em',
  padding: '.5em',
//   margin: '.5em',
};

const TabContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    font-size: 1.5em;
`
// const lobbiesTable = (lobbies: Arena[], twitters: { [key: string]: string }) => {
//     const sortedLobbies = lobbies.sort((a, b) => a.startTime - b.startTime).reverse();
  
//     const table = createTable(
//       ['player', 'lobby', 'start'],
//       [
//         sortedLobbies.map((l) => {
//           const address = l.firstMover.id.split('-')[1];
//           let formatted = '';
  
//           if (address in twitters) {
//             formatted = `${address} (@${twitters[address]})`;
//           } else {
//             formatted = `${address}`;
//           }
  
//           return formatted;
//         }),
//         sortedLobbies.map((l) => {
//           const link = document.createElement('a');
//           link.innerText = l.id;
//           link.href = `https://arena.dfdao.xyz/play/${l.id}`;
//           link.target = '_blank';
//           link.rel = 'noopener noreferrer';
  
//           return link;
//         }),
//         sortedLobbies.map((l) => {
//           const creationDate = new Date(l.startTime * 1000);
  
//           const spanContainer = document.createElement('span');
  
//           const update = () => {
//             const sDifference = (new Date().getTime() - creationDate.getTime()) / 1000;
  
//             let formatted = '';
//             if (sDifference <= 3600) {
//               const minutes = Math.floor(sDifference / 60);
//               const seconds = Math.floor(sDifference % 60);
//               formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
//             } else {
//               const hours = Math.floor(sDifference / 3600);
//               const minutes = Math.floor((sDifference % 3600) / 60);
//               const seconds = Math.floor(sDifference % 60);
//               formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
//                 .toString()
//                 .padStart(2, '0')}`;
//             }
  
//             spanContainer.innerText = formatted;
//           };
  
//           window.setInterval(update, 1000);
  
//           update();
  
//           return spanContainer;
//         }),
//       ]
//     );
  
//     return table;
//   };
  