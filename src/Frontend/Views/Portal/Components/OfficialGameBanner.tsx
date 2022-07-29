import { getConfigName } from '@darkforest_eth/procedural';
import { EthAddress, Leaderboard } from '@darkforest_eth/types';
import dfstyles from '@darkforest_eth/ui/dist/styles';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  GraphConfigPlayer,
  loadEloLeaderboard,
} from '../../../../Backend/Network/GraphApi/EloLeaderboardApi';
import { loadRecentMaps } from '../../../../Backend/Network/GraphApi/MapsApi';

export const OfficialGameBanner: React.FC<{
  title?: string;
  description?: string;
  disabled?: boolean;
  link: string;
  imageUrl: string;
  style?: React.CSSProperties;
}> = ({ title, description, disabled = false, link, imageUrl, style }) => {
  const history = useHistory();
  return (
    <Banner
      disabled={disabled}
      style={style}
      onClick={() => {
        history.push(link);
      }}
    >
      <PrettyOverlayGradient src={imageUrl} />
      {title && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <BannerTitleContainer>
            <Title>{title}</Title> <span>{description}</span>{' '}
          </BannerTitleContainer>
        </div>
      )}
    </Banner>
  );
};

const Banner = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  color: #fff;
  padding: 1rem;
  border-radius: 6px;
  border: solid 1px ${dfstyles.colors.border};
`;

const Title = styled.span`
  text-transform: uppercase;
  font-size: 1.5rem;
`;

const BannerTitleContainer = styled.span`
  display: flex;
  flex-direction: column;
  gap: 8px;
  letter-spacing: 0.06em;
  position: absolute;
  bottom: 0;
  background: black;
  border-radius: 0px 20px 0px 0px;
  padding: 20px;
  color: ${dfstyles.colors.text}
  font-weight: 700;

`;

const PrettyOverlayGradient = styled.img`
  width: 100%;
  height: 100%;
  display: inline-block;
  object-fit: cover;
  border-radius: 20px;
  filter: brightness(0.8) blur(2px);
`;
