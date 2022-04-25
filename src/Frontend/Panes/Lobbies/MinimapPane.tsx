import React, { useState } from 'react';
import { Btn } from '../../Components/Btn';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import { Minimap } from '../../Components/Minimap';
import { Modal } from '../../Components/Modal';
import { MinimapConfig } from './MinimapUtils';
import { LobbyConfigAction } from './Reducer';


export function MinimapPane({
  modalIndex,
  minimapConfig,
  onUpdate,
  created,
}: {
  modalIndex: number;
  minimapConfig: MinimapConfig | undefined;
  onUpdate: (action: LobbyConfigAction) => void;
  created: boolean;
}) {
  const [refreshing, setRefreshing] = useState(false);

  const randomize = () => {
    console.log('randomizing!!!');
    const seed = Math.floor(Math.random() * 10000);
    onUpdate({ type: 'PLANETHASH_KEY', value: seed });
    onUpdate({ type: 'SPACETYPE_KEY', value: seed + 1 });
    onUpdate({ type: 'BIOMEBASE_KEY', value: seed + 2 });
  };

  return (
    <Modal width='416px' initialX={650} initialY={200} index={modalIndex}>
      <div slot='title'>World Minimap</div>
      <Minimap minimapConfig={minimapConfig} setRefreshing = {setRefreshing}/>
      <div style={{ textAlign: 'center', height: '24px' }}>
        {refreshing ? <LoadingSpinner initialText='Refreshing...' /> : null}
      </div>
      <Btn size='stretch' onClick={randomize} disabled={refreshing || created}>
        Randomize Map
      </Btn>
    </Modal>
  );
}
