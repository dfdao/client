import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { CloseButton, CloseIcon } from '../Panes/Lobbies/LobbiesUtils';

export interface ToastProps {
  open: boolean;
  title: string;
  onClose: () => void;
  description?: string;
  viewportPadding?: [number, number];
  direction?: 'left' | 'right';
}

export const Toast: React.FC<ToastProps> = ({
  open,
  title,
  onClose,
  description,
  viewportPadding = [8, 8],
  direction = 'right',
}) => {
  const [hovering, setHovering] = useState<boolean>(false);
  return (
    <ToastPrimitive.Provider>
      <Container
        open={open}
        forceMount
        asChild
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div>
          <CloseButtonStyle onClick={onClose} hovering={hovering}>
            <CloseIcon />
          </CloseButtonStyle>
          <TextContent>
            <ToastText>{title}</ToastText>
            {description && <ToastDescription>{description}</ToastDescription>}
          </TextContent>
        </div>
      </Container>
      <ToastViewport viewportPadding={viewportPadding} direction={direction} />
    </ToastPrimitive.Provider>
  );
};

const ToastText = styled(ToastPrimitive.Title)`
  font-weight: 510;
`;
const ToastDescription = styled(ToastPrimitive.Description)`
  opacity: 0.6;
`;

const ToastViewport = styled(ToastPrimitive.Viewport)<{
  viewportPadding?: [number, number];
  direction?: 'left' | 'right';
}>`
  position: fixed;
  bottom: 0;
  ${({ direction }) => (direction ? (direction === 'left' ? 'left: 0;' : 'right: 0;') : 'right: 0')}
  display: flex;
  padding: ${({ viewportPadding }) =>
    viewportPadding ? viewportPadding[0] + 'px ' + viewportPadding[1] + 'px' : 0};
  gap: 10px;
  width: 360px;
  max-width: 100vw;
  margin: 0;
  list-style: none;
  z-index: 123456789;
`;

const Container = styled(ToastPrimitive.Root)<{ open: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-family: SF Pro, sans-serif;
  width: 100%;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0px -1px 10px rgba(0, 0, 0, 0.04), 0px 3px 10px rgba(0, 0, 0, 0.05),
    0px 12px 16px rgba(0, 0, 0, 0.14);
  background: #434343;
  position: relative;
  color: rgba(255, 255, 255, 1);
  ${({ open }) =>
    open
      ? css`
          opacity: 1;
          animation: fadeIn 0.2s ease-in-out;
        `
      : css`
          opacity: 0;
          animation: fadeOut 0.2s ease-in-out;
        `}
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(100px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(100px);
    }
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 4px;
`;
export const CloseButtonStyle = styled.div<{ hovering: boolean }>`
  position: absolute;
  left: 0px;
  top: 0px;
  opacity: ${({ hovering }) => (hovering ? 1 : 0)};
  transform: translate(-35%, -35%);
  width: 24px;
  height: 24px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  background: #777777;
  box-shadow: 0px 0px 1px #2f2f2f, 0px 4px 8px rgba(66, 71, 76, 0.06),
    0px 8px 48px rgba(87, 87, 87, 0.08);
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: #505050;
  }
`;
