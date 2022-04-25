import React, { useEffect, useMemo, useRef } from 'react';
import { DrawMessage, MinimapConfig } from '../Panes/Lobbies/MinimapUtils';

function getWorker() {
  return new Worker(new URL('./minimap.worker.ts', import.meta.url));
}

function drawOnCanvas(canvas: HTMLCanvasElement | null, msg: DrawMessage) {
  if (!canvas) {
    console.error(`No canvas to draw to`);
    return;
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error(`Couldn't get the planet context`);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sizeFactor = 380;
  const { radius, data } = msg;

  const normalize = (val: number) => {
    return Math.floor(((val + radius) * sizeFactor) / (radius * 2));
  };

  // draw mini-map
  const dot = msg.dot * 1.2;

  for (let i = 0; i < data.length; i++) {
    if (data[i].planet == 'staged') {
      ctx.fillStyle = '#FF0000'; // staged planet
    } else if (data[i].planet == 'created') {
      ctx.fillStyle = '#00FFFF'; // created planet
    } else if (data[i].type === 0) {
      ctx.fillStyle = '#186469'; // inner nebula
    } else if (data[i].type === 1) {
      ctx.fillStyle = '#0606C7'; // outer nebula
    } else if (data[i].type === 2) {
      ctx.fillStyle = '#000000'; // deep space
    } else if (data[i].type === 3) {
      ctx.fillStyle = '#038700'; // dead space
    }
    ctx.fillRect(normalize(data[i].x) + 10, normalize(data[i].y * -1) + 10, dot, dot);
  }

  // draw extents of map

  const radiusNormalized = normalize(radius) / 2;

  ctx.beginPath();
  ctx.arc(radiusNormalized + 12, radiusNormalized + 12, radiusNormalized, 0, 2 * Math.PI);
  ctx.strokeStyle = '#DDDDDD';
  ctx.lineWidth = 5;
  ctx.stroke();
}

export function Minimap({
  style = {width: "400px", height: "400px"},
  minimapConfig,
  setRefreshing = (b: boolean) => {}
}: {
  style?: { width: string; height: string };
  minimapConfig: MinimapConfig | undefined;
  setRefreshing? : (refreshing : boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worker = useMemo(getWorker, []);

  useEffect(() => {
    if (minimapConfig) {
      setRefreshing(true);
      worker.postMessage(JSON.stringify(minimapConfig));
    }
  }, [worker, minimapConfig, setRefreshing]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data) {
        drawOnCanvas(canvasRef.current, JSON.parse(e.data));
        setRefreshing(false);
      }
    }

    worker.addEventListener('message', onMessage);

    return () => worker.removeEventListener('message', onMessage);
  }, [worker, setRefreshing]);

  return <canvas ref={canvasRef} style={{...style, margin: 'auto'}} width='400' height='400' />;
}
