import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import AssetService from '@/services/assetService';
import VersionService from '@/services/VersionService';
import { Asset, AssetVersion, AssetActivity } from '@/types/asset.types';
import VersionUploadModal from '@/components/assets/VersionUploadModal';
import VersionComparisonView from '@/components/assets/VersionComparisonView';
import ActivityLogList from '@/components/assets/ActivityLogList';

const AssetDetailsPage = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [versions, setVersions] = useState<AssetVersion[]>([]);
  const [activities, setActivities] = useState<AssetActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVersionsLoading, setIsVersionsLoading] = useState(true);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'versions' | 'activity'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  
  // Version and activity management states
  const [isVersionUploadModalOpen, setIsVersionUploadModalOpen] = useState(false);
  const [selectedVersionForComparison, setSelectedVersionForComparison] = useState<AssetVersion | null>(null);
  const [isComparisonViewOpen, setIsComparisonViewOpen] = useState(false);
  
  // Fetch asset data
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setIsLoading(true);
        if (!assetId) return;
        
        const assetData = await AssetService.getAssetById(assetId);
        setAsset(assetData);
        setEditedDescription(assetData.metadata.description || '');
        
        // Log view activity
        await VersionService.logView(assetId, assetData.version);
      } catch (err) {
        console.error('Error fetching asset:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAsset();
  }, [assetId]);
  
  // Fetch version history
  useEffect(() => {
    const fetchVersionHistory = async () => {
      if (!assetId) return;
      
      try {
        setIsVersionsLoading(true);
        const versionData = await VersionService.getVersions(assetId);
        setVersions(versionData);
      } catch (err) {
        console.error('Error fetching version history:', err);
      } finally {
        setIsVersionsLoading(false);
      }
    };
    
    fetchVersionHistory();
  }, [assetId]);
  
  // Fetch activity history
  useEffect(() => {
    const fetchActivityHistory = async () => {
      if (!assetId) return;
      
      try {
        setIsActivitiesLoading(true);
        const activityData = await VersionService.getActivities(assetId);
        setActivities(activityData);
      } catch (err) {
        console.error('Error fetching activity history:', err);
      } finally {
        setIsActivitiesLoading(false);
      }
    };
    
    fetchActivityHistory();
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
  const handleShare = async () => {
    if (!asset || !assetId) return;
    
    const token = Date.now().toString();
    const url = `${window.location.origin}/share/${assetId}?token=${token}`;
    setShareUrl(url);
    
    // Log share activity
    await VersionService.logShare(assetId, token);
  };
  
  // Copy URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // Would add a toast notification here in a real implementation
    alert('Link copied to clipboard');
  };
  
  // Download asset
  const handleDownload = async () => {
    if (!asset || !assetId) return;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = asset.fileUrl;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log download activity
    await VersionService.logDownload(assetId, asset.version);
  };
  
  // Download a specific version
  const handleDownloadVersion = async (version: AssetVersion) => {
    if (!assetId) return;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = version.fileUrl;
    link.download = `${asset?.name || 'asset'}_v${version.versionNumber}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log download activity
    await VersionService.logDownload(assetId, version.versionNumber);
  };
  
  // Navigate back
  const handleBack = () => {
    navigate(-1);
  };
  
  // Save edited description
  const handleSaveDescription = async () => {
    if (!asset || !assetId) return;
    
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
    
    // Log edit activity
    await VersionService.logEdit(assetId, 'metadata.description', editedDescription);
    setIsEditing(false);
  };
  
  // Open version upload modal
  const handleUploadVersionClick = () => {
    setIsVersionUploadModalOpen(true);
  };
  
  // Handle version upload
  const handleVersionUpload = async (file: File, notes: string) => {
    if (!assetId) return;
    
    // Upload new version
    const newVersion = await VersionService.uploadVersion(assetId, file, notes);
    
    // Update versions list
    setVersions(prev => [...prev, newVersion].sort((a, b) => b.versionNumber - a.versionNumber));
    
    // Update asset with new version number
    if (asset) {
      setAsset({
        ...asset,
        version: newVersion.versionNumber,
        fileUrl: newVersion.fileUrl,
        thumbnailUrl: newVersion.thumbnailUrl || asset.thumbnailUrl
      });
    }
    
    // Refresh activity history
    const updatedActivities = await VersionService.getActivities(assetId);
    setActivities(updatedActivities);
    
    setIsVersionUploadModalOpen(false);
  };
  
  // Handle version restore
  const handleRestoreVersion = async (version: AssetVersion) => {
    if (!assetId || !asset) return;
    
    // Restore version
    await VersionService.restoreVersion(assetId, version.versionNumber);
    
    // Update asset with restored version info
    setAsset({
      ...asset,
      version: version.versionNumber,
      fileUrl: version.fileUrl,
      thumbnailUrl: version.thumbnailUrl || asset.thumbnailUrl
    });
    
    // Refresh version history
    const updatedVersions = await VersionService.getVersions(assetId);
    setVersions(updatedVersions);
    
    // Refresh activity history
    const updatedActivities = await VersionService.getActivities(assetId);
    setActivities(updatedActivities);
    
    setIsComparisonViewOpen(false);
  };
  
  // Open version comparison view
  const handleCompareVersions = (version: AssetVersion) => {
    if (!versions.length) return;
    
    setSelectedVersionForComparison(version);
    setIsComparisonViewOpen(true);
  };
  
  // Get current version for comparison
  const getCurrentVersion = (): AssetVersion | null => {
    return versions.find(v => v.isCurrentVersion) || null;
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
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleUploadVersionClick}
              >
                Upload New Version
              </Button>
            </SectionHeader>
            
            {isVersionsLoading ? (
              <LoadingStateSmall>
                <LoadingSpinner />
                <LoadingText>Loading version history...</LoadingText>
              </LoadingStateSmall>
            ) : versions.length === 0 ? (
              <EmptyVersions>
                <EmptyIcon>📋</EmptyIcon>
                <EmptyText>No version history available</EmptyText>
              </EmptyVersions>
            ) : (
              <>
                {versions.map(version => (
                  <VersionItem key={version.id}>
                    <VersionHeader>
                      <VersionNumberContainer>
                        <VersionNumber>v{version.versionNumber}</VersionNumber>
                        {version.isCurrentVersion && (
                          <CurrentVersionBadge>Current</CurrentVersionBadge>
                        )}
                      </VersionNumberContainer>
                      <VersionDate>{formatDate(version.createdAt)}</VersionDate>
                    </VersionHeader>
                    <VersionMeta>Uploaded by {version.createdBy}</VersionMeta>
                    <VersionNotes>{version.notes || <EmptyNotes>No notes provided</EmptyNotes>}</VersionNotes>
                    <VersionDetails>
                      <VersionDetail>
                        <VersionDetailLabel>Size:</VersionDetailLabel>
                        <VersionDetailValue>{formatFileSize(version.fileSize)}</VersionDetailValue>
                      </VersionDetail>
                    </VersionDetails>
                    <VersionActions>
                      <Button 
                        variant="text" 
                        size="small"
                        onClick={() => handleDownloadVersion(version)}
                      >
                        Download
                      </Button>
                      <Button 
                        variant="text" 
                        size="small"
                        onClick={() => handleCompareVersions(version)}
                      >
                        Compare
                      </Button>
                      {!version.isCurrentVersion && (
                        <Button 
                          variant="text" 
                          size="small"
                          onClick={() => handleRestoreVersion(version)}
                        >
                          Restore
                        </Button>
                      )}
                    </VersionActions>
                  </VersionItem>
                ))}
              </>
            )}
          </VersionsContainer>
        );
        
      case 'activity':
        return (
          <ActivityContainer>
            <SectionHeader>
              <h3>Activity History</h3>
            </SectionHeader>
            
            {isActivitiesLoading ? (
              <LoadingStateSmall>
                <LoadingSpinner />
                <LoadingText>Loading activity history...</LoadingText>
              </LoadingStateSmall>
            ) : (
              <ActivityLogList activities={activities} />
            )}
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
              Versions ({versions.length})
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
      
      {/* Version Upload Modal */}
      {asset && (
        <VersionUploadModal
          asset={asset}
          isOpen={isVersionUploadModalOpen}
          onClose={() => setIsVersionUploadModalOpen(false)}
          onUpload={handleVersionUpload}
        />
      )}
      
      {/* Version Comparison View */}
      {isComparisonViewOpen && selectedVersionForComparison && getCurrentVersion() && (
        <ModalOverlay>
          <ComparisonContainer>
            <VersionComparisonView
              currentVersion={getCurrentVersion()!}
              previousVersion={selectedVersionForComparison}
              onClose={() => setIsComparisonViewOpen(false)}
              onRestore={handleRestoreVersion}
            />
          </ComparisonContainer>
        </ModalOverlay>
      )}
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

// New styled components for version history
const LoadingStateSmall = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

const EmptyVersions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const EmptyText = styled.div`
  font-style: italic;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const EmptyNotes = styled.span`
  font-style: italic;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const VersionNumberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CurrentVersionBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.success + '20'};
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const VersionDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
  margin: ${({ theme }) => theme.spacing[3]} 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const VersionDetail = styled.div`
  display: flex;
  align-items: center;
`;

const VersionDetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.spacing[1]};
`;

const VersionDetailValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Modal overlay for version comparison
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
  z-index: ${({ theme }) => theme.zIndices[50]};
`;

const ComparisonContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: auto;
`;

export default AssetDetailsPage;