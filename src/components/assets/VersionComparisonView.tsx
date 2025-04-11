import React from 'react';
import styled from 'styled-components';
import { AssetVersion } from '@/types/asset.types';
import Button from '@/components/ui/Button';

interface VersionComparisonViewProps {
  currentVersion: AssetVersion;
  previousVersion: AssetVersion;
  onClose: () => void;
  onRestore: (version: AssetVersion) => void;
}

/**
 * Component for comparing two versions of an asset
 */
const VersionComparisonView: React.FC<VersionComparisonViewProps> = ({
  currentVersion,
  previousVersion,
  onClose,
  onRestore
}) => {
  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };
  
  // Calculate size difference
  const getSizeDifference = (): string => {
    const diff = currentVersion.fileSize - previousVersion.fileSize;
    const percentage = ((diff / previousVersion.fileSize) * 100).toFixed(1);
    
    if (diff > 0) {
      return `+${formatFileSize(diff)} (+${percentage}%)`;
    } else if (diff < 0) {
      return `${formatFileSize(diff)} (${percentage}%)`;
    } else {
      return 'No change';
    }
  };
  
  // Get correct preview based on file type
  const renderPreview = (version: AssetVersion) => {
    const fileUrl = version.fileUrl;
    const fileName = fileUrl.split('/').pop() || 'file';
    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
    
    const isImage = /jpg|jpeg|png|gif|webp|svg/i.test(fileExt);
    const isPdf = /pdf/i.test(fileExt);
    const isVideo = /mp4|webm|mov|avi/i.test(fileExt);
    const isAudio = /mp3|wav|ogg/i.test(fileExt);
    
    if (isImage) {
      return <ImagePreview src={fileUrl} alt={`Version ${version.versionNumber}`} />;
    } else if (isPdf) {
      return <PDFPreview src={fileUrl} title={`Version ${version.versionNumber}`} />;
    } else if (isVideo) {
      return (
        <VideoPreview controls>
          <source src={fileUrl} />
          Your browser does not support the video tag.
        </VideoPreview>
      );
    } else if (isAudio) {
      return (
        <AudioPreview controls>
          <source src={fileUrl} />
          Your browser does not support the audio tag.
        </AudioPreview>
      );
    } else {
      return (
        <GenericPreview>
          <FileIcon>📄</FileIcon>
          <div>{fileExt.toUpperCase()}</div>
        </GenericPreview>
      );
    }
  };
  
  // Handle restore
  const handleRestore = () => {
    onRestore(previousVersion);
  };
  
  return (
    <Container>
      <Header>
        <Title>Version Comparison</Title>
        <CloseButton onClick={onClose}>×</CloseButton>
      </Header>
      
      <ComparisonContainer>
        <VersionColumn>
          <VersionHeader>
            <VersionNumber>Version {previousVersion.versionNumber}</VersionNumber>
            <VersionDate>{formatDate(previousVersion.createdAt)}</VersionDate>
          </VersionHeader>
          
          <PreviewContainer>
            {renderPreview(previousVersion)}
          </PreviewContainer>
          
          <MetadataList>
            <MetadataItem>
              <MetadataLabel>Size</MetadataLabel>
              <MetadataValue>{formatFileSize(previousVersion.fileSize)}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Uploaded By</MetadataLabel>
              <MetadataValue>{previousVersion.createdBy}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Notes</MetadataLabel>
              <MetadataValue>
                {previousVersion.notes || <EmptyValue>No notes</EmptyValue>}
              </MetadataValue>
            </MetadataItem>
          </MetadataList>
          
          <ActionButton 
            variant="primary" 
            onClick={handleRestore}
            disabled={previousVersion.isCurrentVersion}
          >
            {previousVersion.isCurrentVersion ? 'Current Version' : 'Restore This Version'}
          </ActionButton>
        </VersionColumn>
        
        <ComparisonDivider>
          <ComparisonIcon>⟷</ComparisonIcon>
          <DifferenceIndicator>
            <DifferenceLabel>Size Difference</DifferenceLabel>
            <DifferenceValue>{getSizeDifference()}</DifferenceValue>
          </DifferenceIndicator>
        </ComparisonDivider>
        
        <VersionColumn>
          <VersionHeader>
            <VersionNumber>Version {currentVersion.versionNumber}</VersionNumber>
            <VersionDate>{formatDate(currentVersion.createdAt)}</VersionDate>
          </VersionHeader>
          
          <PreviewContainer>
            {renderPreview(currentVersion)}
          </PreviewContainer>
          
          <MetadataList>
            <MetadataItem>
              <MetadataLabel>Size</MetadataLabel>
              <MetadataValue>{formatFileSize(currentVersion.fileSize)}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Uploaded By</MetadataLabel>
              <MetadataValue>{currentVersion.createdBy}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Notes</MetadataLabel>
              <MetadataValue>
                {currentVersion.notes || <EmptyValue>No notes</EmptyValue>}
              </MetadataValue>
            </MetadataItem>
          </MetadataList>
          
          <CurrentVersionBadge>Current Version</CurrentVersionBadge>
        </VersionColumn>
      </ComparisonContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const ComparisonContainer = styled.div`
  display: flex;
  align-items: stretch;
  padding: ${({ theme }) => theme.spacing[6]};
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column-reverse;
  }
`;

const VersionColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const VersionHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

const VersionNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const VersionDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PreviewContainer = styled.div`
  height: 300px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const PDFPreview = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const VideoPreview = styled.video`
  max-width: 100%;
  max-height: 100%;
`;

const AudioPreview = styled.audio`
  width: 80%;
`;

const GenericPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FileIcon = styled.div`
  font-size: 3rem;
`;

const MetadataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetadataLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const MetadataValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const EmptyValue = styled.span`
  font-style: italic;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionButton = styled(Button)`
  width: 100%;
`;

const CurrentVersionBadge = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: ${({ theme }) => theme.colors.success + '20'};
  color: ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-top: auto;
`;

const ComparisonDivider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    padding: ${({ theme }) => theme.spacing[4]};
    justify-content: space-between;
  }
`;

const ComparisonIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-bottom: 0;
  }
`;

const DifferenceIndicator = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
`;

const DifferenceLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const DifferenceValue = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

export default VersionComparisonView;