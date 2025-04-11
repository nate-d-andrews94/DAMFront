import React from 'react';
import styled from 'styled-components';
import { Asset } from '@/types/asset.types';
import AssetCard from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
  onAssetClick?: (asset: Asset) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  onAssetClick,
  isLoading = false,
  emptyMessage = 'No assets found'
}) => {
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading assets...</LoadingText>
      </LoadingContainer>
    );
  }

  if (assets.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📁</EmptyIcon>
        <EmptyText>{emptyMessage}</EmptyText>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onClick={() => onAssetClick && onAssetClick(asset)}
        />
      ))}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3B82F6;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #6B7280;
  font-size: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #F9FAFB;
  border-radius: 0.5rem;
  padding: 3rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #9CA3AF;
`;

const EmptyText = styled.p`
  color: #6B7280;
  font-size: 1rem;
`;

export default AssetGrid;