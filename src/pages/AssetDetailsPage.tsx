import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import AssetService from '@/services/assetService';
import { Asset } from '@/types/asset.types';

interface AssetVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  notes: string;
}

interface AssetActivity {
  id: string;
  action: 'view' | 'download' | 'share';
  timestamp: string;
  user: string;
}

// Mock versions
const mockVersions: AssetVersion[] = [
  {
    id: 'v1',
    versionNumber: 1,
    createdAt: '2025-03-01T10:30:00Z',
    createdBy: 'John Doe',
    notes: 'Initial upload'
  },
  {
    id: 'v2',
    versionNumber: 2,
    createdAt: '2025-03-15T14:20:00Z',
    createdBy: 'Jane Smith',
    notes: 'Updated with new branding colors'
  }
];

// Mock activity
const mockActivity: AssetActivity[] = [
  {
    id: 'a1',
    action: 'view',
    timestamp: '2025-04-02T09:15:00Z',
    user: 'Marketing Team'
  },
  {
    id: 'a2',
    action: 'download',
    timestamp: '2025-04-01T16:45:00Z',
    user: 'John Doe'
  },
  {
    id: 'a3',
    action: 'share',
    timestamp: '2025-03-28T11:30:00Z',
    user: 'Jane Smith'
  }
];

const AssetDetailsPage = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'versions' | 'activity'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  
  // Fetch asset data
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setIsLoading(true);
        if (!assetId) return;
        
        const assetData = await AssetService.getAssetById(assetId);
        setAsset(assetData);
        setEditedDescription(assetData.metadata.description || '');
      } catch (err) {
        console.error('Error fetching asset:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAsset();
  }, [assetId]);
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Generate and display share URL
  const handleShare = () => {
    const url = `${window.location.origin}/share/${assetId}?token=${Date.now()}`;
    setShareUrl(url);
  };
  
  // Copy URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // Would add a toast notification here in a real implementation
    alert('Link copied to clipboard');
  };
  
  // Download asset
  const handleDownload = () => {
    if (!asset) return;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = asset.fileUrl;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Navigate back
  const handleBack = () => {
    navigate(-1);
  };
  
  // Save edited description
  const handleSaveDescription = async () => {
    if (!asset) return;
    
    // In a real implementation, this would call an API to update the description
    // For now, just update the local state
    setAsset(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        metadata: {
          ...prev.metadata,
          description: editedDescription
        }
      };
    });
    
    setIsEditing(false);
  };
  
  // Render asset preview based on file type
  const renderPreview = () => {
    if (!asset) return (
      <EmptyPreview>
        <p>Asset not found</p>
      </EmptyPreview>
    );
    
    const isImage = /jpg|jpeg|png|gif|webp|svg/i.test(asset.fileType);
    const isDocument = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt/i.test(asset.fileType);
    const isVideo = /mp4|webm|mov|avi/i.test(asset.fileType);
    const isAudio = /mp3|wav|ogg/i.test(asset.fileType);
    
    if (isImage) {
      return (
        <ImagePreview src={asset.fileUrl} alt={asset.name} />
      );
    } else if (isVideo) {
      return (
        <VideoPreview controls>
          <source src={asset.fileUrl} type={asset.mimeType} />
          Your browser does not support the video tag.
        </VideoPreview>
      );
    } else if (isAudio) {
      return (
        <AudioPreviewContainer>
          <AudioIcon>🎵</AudioIcon>
          <AudioPreview controls>
            <source src={asset.fileUrl} type={asset.mimeType} />
            Your browser does not support the audio tag.
          </AudioPreview>
        </AudioPreviewContainer>
      );
    } else if (isDocument && asset.fileType === 'pdf') {
      return (
        <PDFPreview src={asset.fileUrl} title={asset.name} />
      );
    } else {
      // Generic file preview
      return (
        <GenericPreview>
          <FileIcon>
            {isDocument ? '📄' : '📁'}
          </FileIcon>
          <FileTypeName>{asset.fileType.toUpperCase()}</FileTypeName>
          <FileDescription>{asset.name}</FileDescription>
        </GenericPreview>
      );
    }
  };
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    if (!asset) return null;
    
    switch (activeTab) {
      case 'info':
        return (
          <>
            <MetadataSection>
              <SectionHeader>
                <h3>Asset Information</h3>
              </SectionHeader>
              <MetadataGrid>
                <MetadataItem>
                  <MetadataLabel>Type</MetadataLabel>
                  <MetadataValue>{asset.fileType.toUpperCase()}</MetadataValue>
                </MetadataItem>
                <MetadataItem>
                  <MetadataLabel>Size</MetadataLabel>
                  <MetadataValue>{formatFileSize(asset.size)}</MetadataValue>
                </MetadataItem>
                <MetadataItem>
                  <MetadataLabel>Uploaded</MetadataLabel>
                  <MetadataValue>{formatDate(asset.uploadedAt)}</MetadataValue>
                </MetadataItem>
                <MetadataItem>
                  <MetadataLabel>By</MetadataLabel>
                  <MetadataValue>{asset.uploadedBy}</MetadataValue>
                </MetadataItem>
                {asset.metadata.width && asset.metadata.height && (
                  <MetadataItem>
                    <MetadataLabel>Dimensions</MetadataLabel>
                    <MetadataValue>{asset.metadata.width} × {asset.metadata.height}</MetadataValue>
                  </MetadataItem>
                )}
                {asset.metadata.duration && (
                  <MetadataItem>
                    <MetadataLabel>Duration</MetadataLabel>
                    <MetadataValue>{asset.metadata.duration}s</MetadataValue>
                  </MetadataItem>
                )}
                <MetadataItem>
                  <MetadataLabel>Folder</MetadataLabel>
                  <MetadataValue>
                    <FolderPath>{asset.folder || '/'}</FolderPath>
                  </MetadataValue>
                </MetadataItem>
                <MetadataItem>
                  <MetadataLabel>Version</MetadataLabel>
                  <MetadataValue>v{asset.version}</MetadataValue>
                </MetadataItem>
              </MetadataGrid>
            </MetadataSection>
            
            <MetadataSection>
              <SectionHeader>
                <h3>Tags</h3>
                <Button variant="text" size="small">Add Tags</Button>
              </SectionHeader>
              <TagContainer>
                {asset.tags.length > 0 ? (
                  asset.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))
                ) : (
                  <EmptyMessage>No tags assigned</EmptyMessage>
                )}
              </TagContainer>
            </MetadataSection>
            
            <MetadataSection>
              <SectionHeader>
                <h3>Description</h3>
                {!isEditing && (
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </SectionHeader>
              
              {isEditing ? (
                <DescriptionEditor>
                  <StyledTextarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={4}
                  />
                  <EditorActions>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditedDescription(asset.metadata.description || '');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      size="small" 
                      onClick={handleSaveDescription}
                    >
                      Save
                    </Button>
                  </EditorActions>
                </DescriptionEditor>
              ) : (
                <Description>
                  {asset.metadata.description || <EmptyMessage>No description available</EmptyMessage>}
                </Description>
              )}
            </MetadataSection>
          </>
        );
        
      case 'versions':
        return (
          <VersionsContainer>
            <SectionHeader>
              <h3>Version History</h3>
              <Button variant="outlined" size="small">Upload New Version</Button>
            </SectionHeader>
            
            {mockVersions.map(version => (
              <VersionItem key={version.id}>
                <VersionHeader>
                  <VersionNumber>v{version.versionNumber}</VersionNumber>
                  <VersionDate>{formatDate(version.createdAt)}</VersionDate>
                </VersionHeader>
                <VersionMeta>Uploaded by {version.createdBy}</VersionMeta>
                <VersionNotes>{version.notes}</VersionNotes>
                <VersionActions>
                  <Button 
                    variant="text" 
                    size="small"
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                  {version.versionNumber !== asset.version && (
                    <Button variant="text" size="small">
                      Restore
                    </Button>
                  )}
                </VersionActions>
              </VersionItem>
            ))}
          </VersionsContainer>
        );
        
      case 'activity':
        return (
          <ActivityContainer>
            <SectionHeader>
              <h3>Recent Activity</h3>
            </SectionHeader>
            
            {mockActivity.map(activity => (
              <ActivityItem key={activity.id}>
                <ActivityIcon>
                  {activity.action === 'view' ? '👁️' : 
                   activity.action === 'download' ? '⬇️' : '🔗'}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>
                    <strong>{activity.user}</strong> {activity.action === 'view' ? 'viewed' : 
                                                   activity.action === 'download' ? 'downloaded' : 'shared'} this asset
                  </ActivityText>
                  <ActivityTime>
                    {formatDate(activity.timestamp)}
                  </ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityContainer>
        );
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading asset details...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }
  
  // Error state
  if (error || !asset) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>
            {error?.message || 'Asset not found'}
          </ErrorMessage>
          <Button variant="primary" onClick={handleBack}>
            Back to Assets
          </Button>
        </ErrorContainer>
      </Container>
    );
  }
  
  return (
    <Container>
      <BackButton onClick={handleBack}>← Back to Assets</BackButton>
      
      <ContentContainer>
        <PreviewContainer>
          {renderPreview()}
        </PreviewContainer>
        
        <MetadataContainer>
          <MetadataHeader>
            <h1>{asset.name}</h1>
            <ActionButtons>
              <ActionButton onClick={handleShare}>Share</ActionButton>
              <ActionButton className="secondary" onClick={handleDownload}>
                Download
              </ActionButton>
            </ActionButtons>
          </MetadataHeader>
          
          {shareUrl && (
            <ShareUrlContainer>
              <ShareUrl>{shareUrl}</ShareUrl>
              <CopyButton onClick={handleCopyLink}>Copy</CopyButton>
            </ShareUrlContainer>
          )}
          
          <TabsContainer>
            <Tab 
              className={activeTab === 'info' ? 'active' : ''} 
              onClick={() => setActiveTab('info')}
            >
              Information
            </Tab>
            <Tab 
              className={activeTab === 'versions' ? 'active' : ''} 
              onClick={() => setActiveTab('versions')}
            >
              Versions ({mockVersions.length})
            </Tab>
            <Tab 
              className={activeTab === 'activity' ? 'active' : ''} 
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </Tab>
          </TabsContainer>
          
          <TabContent>
            {renderTabContent()}
          </TabContent>
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

// Preview components
const EmptyPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: ${({ theme }) => theme.colors.background};
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
`;

const AudioPreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const AudioIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const AudioPreview = styled.audio`
  width: 100%;
  max-width: 400px;
`;

const PDFPreview = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const GenericPreview = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const FileIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FileTypeName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FileDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 80%;
`;

// Metadata container components
const MetadataContainer = styled.div`
  flex: 0 0 400px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex: auto;
  }
`;

const MetadataHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    word-break: break-word;
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
  margin-bottom: ${({ theme }) => theme.spacing[4]};
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

// Tabs
const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Tab = styled.button`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: -1px;
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:hover:not(.active) {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const TabContent = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

// Metadata section components
const MetadataSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
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

const FolderPath = styled.span`
  font-family: monospace;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

// Tag components
const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.primaryLight + '20'};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Description components
const Description = styled.div`
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyMessage = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const DescriptionEditor = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StyledTextarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EditorActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[2]};
`;

// Version history components
const VersionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const VersionItem = styled(Card)`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const VersionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const VersionNumber = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const VersionDate = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const VersionMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const VersionNotes = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const VersionActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[2]};
`;

// Activity components
const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActivityIcon = styled.div`
  margin-right: ${({ theme }) => theme.spacing[3]};
  font-size: 1.25rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Loading and error components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: spin 1s ease-in-out infinite;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export default AssetDetailsPage;