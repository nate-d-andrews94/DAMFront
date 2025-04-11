import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Asset } from '@/types/asset.types';
import Card from '@/components/ui/Card';

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
  isSelected?: boolean;
  onSelect?: (asset: Asset) => void;
  selectionMode?: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({ 
  asset, 
  onClick, 
  isSelected = false, 
  onSelect, 
  selectionMode = false 
}) => {
  const handleClick = () => {
    if (selectionMode && onSelect) {
      onSelect(asset);
    } else if (onClick) {
      onClick();
    }
  };
  
  const handleSelectClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(asset);
    }
  };
  
  const isImage = asset.fileType.match(/jpg|jpeg|png|gif|webp|svg/i);
  const isDocument = asset.fileType.match(/pdf|doc|docx|xls|xlsx|ppt|pptx|txt/i);
  const isVideo = asset.fileType.match(/mp4|webm|mov|avi/i);
  
  const getFileIcon = () => {
    if (isImage) return '🖼️';
    if (isDocument) return '📄';
    if (isVideo) return '🎬';
    return '📁';
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <CardContainer interactive onClick={handleClick} isSelected={isSelected}>
      {selectionMode && (
        <SelectionCheckbox onClick={(e) => e.stopPropagation()}>
          <SelectionInput 
            type="checkbox" 
            checked={isSelected} 
            onChange={handleSelectClick} 
          />
        </SelectionCheckbox>
      )}
      <ThumbnailContainer>
        {asset.thumbnailUrl ? (
          <Thumbnail src={asset.thumbnailUrl} alt={asset.name} />
        ) : (
          <PlaceholderThumbnail>
            <FileIcon>{getFileIcon()}</FileIcon>
            <FileType>{asset.fileType.toUpperCase()}</FileType>
          </PlaceholderThumbnail>
        )}
      </ThumbnailContainer>
      
      <ContentContainer>
        <AssetName to={`/assets/${asset.id}`}>{asset.name}</AssetName>
        
        <MetadataContainer>
          <MetadataItem>
            <MetadataLabel>Size:</MetadataLabel>
            <MetadataValue>{formatFileSize(asset.size)}</MetadataValue>
          </MetadataItem>
          
          <MetadataItem>
            <MetadataLabel>Uploaded:</MetadataLabel>
            <MetadataValue>{formatDate(asset.uploadedAt)}</MetadataValue>
          </MetadataItem>
        </MetadataContainer>
        
        {asset.tags.length > 0 && (
          <TagsContainer>
            {asset.tags.slice(0, 3).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
            {asset.tags.length > 3 && <TagCount>+{asset.tags.length - 3}</TagCount>}
          </TagsContainer>
        )}
      </ContentContainer>
    </CardContainer>
  );
};

const CardContainer = styled(Card)<{ isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  height: 100%;
  position: relative;
  ${({ isSelected, theme }) => isSelected && `
    border: 2px solid ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primaryLight};
  `}
`;

const SelectionCheckbox = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SelectionInput = styled.input`
  cursor: pointer;
  margin: 0;
  height: 16px;
  width: 16px;
`;

const ThumbnailContainer = styled.div`
  height: 160px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.normal};
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const PlaceholderThumbnail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FileIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FileType = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const ContentContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AssetName = styled(Link)`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const MetadataItem = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const MetadataLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.spacing[1]};
`;

const MetadataValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-top: auto;
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.primaryLight + '20'};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const TagCount = styled.span`
  background-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

export default AssetCard;