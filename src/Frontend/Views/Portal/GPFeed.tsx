import { getConfigName } from '@darkforest_eth/procedural';
import { EthAddress, ExtendedMatchEntry } from '@darkforest_eth/types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LobbyInitializers } from '../../Panes/Lobby/Reducer';
import { useEthConnection, useLiveMatches } from '../../Utils/AppHooks';
import { formatStartTime } from '../../Utils/TimeUtils';
import { FeedRow } from './Components/FeedRow';
import { GrandPrixHistoryItem } from './PortalHistoryView';
import { RoundResponse } from './PortalHomeView';
import { truncateAddress } from './PortalUtils';

export interface MapDetailsProps {
  round: RoundResponse;
  config: LobbyInitializers;
}

export const GPFeed: React.FC<MapDetailsProps> = ({ round, config }) => {
  const numSpawnPlanets = config?.ADMIN_PLANETS.filter((p) => p.isSpawnPlanet).length ?? 0;

  const hasWhitelist = config?.WHITELIST_ENABLED;

  const { liveMatches } = useLiveMatches(round.configHash);
  const conn = useEthConnection();
  const address = conn.getAddress();

  return (
    <div lf-map-details-container=''>
      <div
        lf-map-details-tab-view=''
        className='lf-stack'
        style={{
          marginBottom: '1rem',
        }}
      >
        <>
          {liveMatches && liveMatches.entries.length > 0 ? (
            <div>
              {liveMatches.entries.map((entry: ExtendedMatchEntry, i: number) => (
                <MatchDetail
                  key={i}
                  configHash={entry.configHash}
                  creator={entry.creator}
                  startTime={entry.startTime}
                  score={5000}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <FeedRow>
                <span>Waiting for players...</span>
              </FeedRow>
              <FeedRow>
                <span>Waiting for players...</span>
              </FeedRow>
              <FeedRow>
                <span>Waiting for players...</span>
              </FeedRow>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export interface MatchDetailProps {
  configHash: string;
  creator: EthAddress;
  startTime: number;
  score: number;
}

export const MatchDetail: React.FC<MatchDetailProps> = ({
  configHash,
  creator,
  startTime,
  score,
}) => {
  return (
    <FeedRow>
      <span>
        {creator} scored {score} on {getConfigName(configHash)}
      </span>
      <span>{formatStartTime(startTime)}</span>
    </FeedRow>
    // <div lf-match-detail-container=''>
    //   <div lf-match-detail-header=''>
    //     <div lf-match-detail-icon=''>{`${numSpots}p`}</div>
    //     <div className='lf-stack'>
    //       <span lf-match-detail-title=''>{getConfigName(configHash)}</span>
    //       <span lf-match-detail-description=''>{`${
    //         numSpots - players.length
    //       } of ${numSpots} spots available`}</span>
    //     </div>
    //   </div>
    //   <div className='lf-stack'>
    //     <div lf-match-detail-info=''>
    //       <ClockIcon />
    //       <span>{formatStartTime(startTime)}</span>
    //     </div>
    //     <div lf-match-detail-info=''>
    //       <PersonIcon />
    //       <span>{truncateAddress(creator)}</span>
    //     </div>
    //   </div>
    //   <Link to={`/play/${id}`} target='_blank'>
    //     <button lf-match-detail-button=''>
    //       {players.includes(playerAddress)
    //         ? 'Resume'
    //         : players.length < numSpots && !hasWhitelist
    //         ? 'Join'
    //         : 'View'}
    //     </button>
    //   </Link>
    // </div>
  );
};
