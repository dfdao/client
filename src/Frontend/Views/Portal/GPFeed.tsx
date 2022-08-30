import { getConfigName } from '@darkforest_eth/procedural';
import { EthAddress, ExtendedMatchEntry } from '@darkforest_eth/types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LobbyInitializers } from '../../Panes/Lobby/Reducer';
import { useEthConnection, useLiveMatches } from '../../Utils/AppHooks';
import { formatStartTime } from '../../Utils/TimeUtils';
import { Orb } from './Components/FlashingOrb';
import { PaddedRow } from './Components/PaddedRow';
import { RoundResponse } from './PortalHomeView';
import { truncateAddress } from './PortalUtils';

export interface MapDetailsProps {
  round: RoundResponse;
  config: LobbyInitializers;
}

export const GPFeed: React.FC<MapDetailsProps> = ({ round, config }) => {
  const { liveMatches } = useLiveMatches(round.configHash);
  const conn = useEthConnection();

  return (
    <div>
      <div
        style={{
          marginBottom: '1rem',
        }}
      >
        <>
          {liveMatches && liveMatches.entries.length > 0 ? (
            <div>
              {liveMatches.entries.map((entry: ExtendedMatchEntry, i: number) => (
                <PaddedRow>
                  <Orb />
                  <span>
                    {entry.creator} scored {5000} on {getConfigName(entry.configHash)}
                  </span>
                  <span>{formatStartTime(entry.startTime)}</span>
                </PaddedRow>
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
              <PaddedRow>
                <Orb />
                <span>Waiting for players...</span>
              </PaddedRow>
              <PaddedRow>
                <Orb />
                <span>Waiting for players...</span>
              </PaddedRow>
              <PaddedRow>
                <Orb />
                <span>Waiting for players...</span>
              </PaddedRow>
            </div>
          )}
        </>
      </div>
    </div>
  );
};
