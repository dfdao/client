import { WorldCoords } from '@darkforest_eth/types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { removeAlphabet } from '../Panes/Lobbies/LobbiesUtils';
import { MinimapConfig } from '../Panes/Lobbies/MinimapUtils';
import { CANVAS_SIZE } from './Minimap';

export const MinimapEditor: React.FC<{
  style?: { width: string; height: string };
  onError: (msg: string) => void;
  onClick: (clickedCoords: WorldCoords) => void;
  minimapConfig: MinimapConfig | undefined;
  disabled: boolean;
}> = ({
  style = { width: '400px', height: '400px' },
  onError,
  onClick,
  minimapConfig,
  disabled,
}) => {
  const [minimapCoords, setMinimapCoords] = useState<WorldCoords[]>([]);
  const canvasPlanetLayer = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!minimapConfig) return;
    const x = generateMinimapCoords(minimapConfig);
    const y = normalizeGenerated(x, minimapConfig.worldRadius);
    setMinimapCoords(y);
  }, [minimapConfig]);

  if (!minimapConfig) return <div>Loading...</div>;

  const scaleFactor = minimapConfig.worldRadius / (parseInt(CANVAS_SIZE.height) / 2);

  const checkBounds = (a: number, b: number, x: number, y: number, r: number) => {
    const dist = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    if (dist < r) {
      return true;
    }
    return false;
  };

  const generateMinimapCoords = (config: MinimapConfig) => {
    let data: WorldCoords[] = [];
    let step = (config.worldRadius * config.dot) / 100;
    const radius = config.worldRadius;

    for (let i = radius * -1; i < radius; i += step) {
      for (let j = radius * -1; j < radius; j += step) {
        if (!checkBounds(0, 0, i, j, radius)) {
          continue;
        }
        data.push({
          x: i,
          y: j,
        });
      }
    }
    return data;
  };

  const normalizeGenerated = (data: WorldCoords[], radius: number) => {
    const sizeFactor = 380;
    const normalize = (val: number) => {
      return Math.floor(((val + radius) * sizeFactor) / (radius * 2));
    };
    const normalized: WorldCoords[] = data.map((coord) => {
      return {
        x: normalize(coord.x) + 10,
        y: normalize(coord.y * -1) + 10,
      };
    });
    return normalized;
  };

  const getAdjustedPointer = (
    canvas: React.MutableRefObject<HTMLCanvasElement | null>,
    pointerX: number,
    pointerY: number
  ): WorldCoords | undefined => {
    if (!canvas.current) return;
    const canvasRef = canvas.current;
    const canvasBounds = canvasRef.getBoundingClientRect();
    const scaleX = canvasRef.width / canvasBounds.width;
    const scaleY = canvasRef.height / canvasBounds.height;
    const adjustedX = Math.floor((pointerX - canvasBounds.left) * scaleX);
    const adjustedY = Math.floor((pointerY - canvasBounds.top) * scaleY);
    return {
      x: adjustedX,
      y: adjustedY,
    };
  };

  const handleMouseClick = (
    canvas: React.MutableRefObject<HTMLCanvasElement | null>,
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const ctx = canvasPlanetLayer.current!.getContext('2d');
    if (!ctx) return;
    const adjustedPointer = getAdjustedPointer(canvas!, e.clientX, e.clientY);
    console.log('adjustedPointer', adjustedPointer);
    if (!adjustedPointer) return;
    // check if the click overlaps with anything in minimapCoords
    const dot = minimapConfig.dot * 1.2;
    minimapCoords.forEach((coord, idx) => {
      if (
        adjustedPointer.x > coord.x - dot &&
        adjustedPointer.x < coord.x + dot &&
        adjustedPointer.y > coord.y - dot &&
        adjustedPointer.y < coord.y + dot
      ) {
        ctx.fillStyle = 'aquamarine';
        let nearest: WorldCoords | undefined;
        let nearestDist = Infinity;
        minimapCoords.forEach((coord) => {
          const dist =
            (coord.x - adjustedPointer.x) * (coord.x - adjustedPointer.x) +
            (coord.y - adjustedPointer.y) * (coord.y - adjustedPointer.y);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = coord;
          }
        });
        if (nearest) {
          ctx.fillRect(nearest.x, nearest.y, dot, dot);
          const normalizedPlanetCoords: WorldCoords = {
            x: (nearest.x - parseInt(CANVAS_SIZE.width) / 2) * scaleFactor,
            y: (nearest.y - parseInt(CANVAS_SIZE.height) / 2) * -scaleFactor,
          };
          onClick(normalizedPlanetCoords);
        }
      }
    });
  };

  return (
    <CanvasLayer
      index={2}
      ref={canvasPlanetLayer}
      width={parseInt(CANVAS_SIZE.height)}
      height={parseInt(CANVAS_SIZE.height)}
      showCrosshair={!disabled}
      onMouseDown={(e) => {
        if (disabled) return;
        handleMouseClick(canvasPlanetLayer!, e);
      }}
    />
  );
};

const CanvasLayer = styled.canvas<{ index: number; showCrosshair: boolean }>`
  z-index: ${(props) => props.index};
  border: 3px solid red;
  cursor: ${(props) => (props.showCrosshair ? 'crosshair' : 'default')};
  grid-area: 1/1;
  z-index: 2;
  position: relative;
`;
