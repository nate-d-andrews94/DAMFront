import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Asset } from '@/types/asset.types';
import AssetCard from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
  className?: string;
  emptyState?: React.ReactNode;
  loading?: boolean;
}

const AssetGrid: React.FC<AssetGridProps> = ({ 
  assets, 
  className,
  emptyState,
  loading = false,
}) => {
  const navigate = useNavigate();
  
  const handleAssetClick = (assetId: string) => {
    navigate(`/assets/${assetId}`);
  };
  
  if (loading) {
    return (
      <GridContainer className={className}>
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </GridContainer>
    );
  }
  
  if (assets.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }
  
  return (
    <GridContainer className={className}>
      {assets.map((asset) => (
        <AssetCard 
          key={asset.id}
          asset={asset}
          onClick={() => handleAssetClick(asset.id)}
        />
      ))}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const SkeletonCard = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  height: 280px;
  
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.surface} 25%,
      ${({ theme }) => theme.colors.border} 50%,
      ${({ theme }) => theme.colors.surface} 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default AssetGrid;