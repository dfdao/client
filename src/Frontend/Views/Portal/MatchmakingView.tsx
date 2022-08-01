import { LiveMatch } from '@darkforest_eth/types';
import React, { useEffect, useState } from 'react';
import { loadAllLiveMatches, loadLiveMatches } from '../../../Backend/Network/GraphApi/SpyApi';
import { FindMatch } from './FindMatch';

export function MatchmakingView() {
  const [liveMatches, setLiveMatches] = useState<LiveMatch | undefined>();
  const [liveMatchError, setLiveMatchError] = useState<Error | undefined>();

  useEffect(() => {
    loadAllLiveMatches()
      .then((matches) => {
        setLiveMatchError(undefined);
        setLiveMatches(matches);
      })
      .catch((e) => {
        console.log(e);
        setLiveMatchError(e);
      });
  }, []);

  return <FindMatch game={liveMatches} error={liveMatchError} nPlayers={4} />;
}
