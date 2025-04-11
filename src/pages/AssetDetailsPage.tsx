import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AssetDetailsPage = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const [shareUrl, setShareUrl] = useState('');
  
  // Placeholder for real implementation
  const handleShare = () => {
    const url = `${window.location.origin}/share/${assetId}?token=sample-token`;
    setShareUrl(url);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // Would add a toast notification here
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Container>
      <BackButton onClick={handleBack}>← Back to Assets</BackButton>
      
      <ContentContainer>
        <PreviewContainer>
          <EmptyPreview>
            <p>Asset preview not available</p>
          </EmptyPreview>
        </PreviewContainer>
        
        <MetadataContainer>
          <MetadataHeader>
            <h1>Sample Asset {assetId}</h1>
            <ActionButtons>
              <ActionButton onClick={handleShare}>Share</ActionButton>
              <ActionButton className="secondary">Download</ActionButton>
            </ActionButtons>
          </MetadataHeader>
          
          {shareUrl && (
            <ShareUrlContainer>
              <ShareUrl>{shareUrl}</ShareUrl>
              <CopyButton onClick={handleCopyLink}>Copy</CopyButton>
            </ShareUrlContainer>
          )}
          
          <MetadataSection>
            <h3>Asset Information</h3>
            <MetadataGrid>
              <MetadataItem>
                <MetadataLabel>Type</MetadataLabel>
                <MetadataValue>Image</MetadataValue>
              </MetadataItem>
              <MetadataItem>
                <MetadataLabel>Size</MetadataLabel>
                <MetadataValue>2.4 MB</MetadataValue>
              </MetadataItem>
              <MetadataItem>
                <MetadataLabel>Uploaded</MetadataLabel>
                <MetadataValue>April 1, 2025</MetadataValue>
              </MetadataItem>
              <MetadataItem>
                <MetadataLabel>Dimensions</MetadataLabel>
                <MetadataValue>1920 x 1080</MetadataValue>
              </MetadataItem>
            </MetadataGrid>
          </MetadataSection>
          
          <MetadataSection>
            <h3>Tags</h3>
            <TagContainer>
              <Tag>Sample</Tag>
              <Tag>Demo</Tag>
              <Tag>Example</Tag>
            </TagContainer>
          </MetadataSection>
          
          <MetadataSection>
            <h3>Description</h3>
            <p>This is a placeholder description for the sample asset. In a real implementation, this would display the actual asset description.</p>
          </MetadataSection>
        </MetadataContainer>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

const PreviewContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: 500px;
  overflow: hidden;
`;

const EmptyPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const MetadataContainer = styled.div`
  flex: 0 0 350px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex: auto;
  }
`;

const MetadataHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: ${({ theme, className }) => 
    className === 'secondary' ? 'transparent' : theme.colors.primary};
  color: ${({ theme, className }) => 
    className === 'secondary' ? theme.colors.primary : theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border: 1px solid ${({ theme, className }) => 
    className === 'secondary' ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme, className }) => 
      className === 'secondary' ? theme.colors.primaryLight + '20' : theme.colors.primaryDark};
  }
`;

const ShareUrlContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  overflow: hidden;
`;

const ShareUrl = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CopyButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

const MetadataSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  p {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetadataLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const MetadataValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export default AssetDetailsPage;