import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FiUpload, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import FileDropzone from '@/components/ui/FileDropzone';
import useFileUpload from '@/hooks/useFileUpload';
import Button from '@/components/ui/Button';
import MetadataModal, { MetadataField } from '@/components/assets/MetadataModal';

const AdminUploadPage = () => {
  const navigate = useNavigate();
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [metadata, setMetadata] = useState<Record<string, MetadataField[]>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  
  // Available tags and folders (would come from API in real app)
  const availableTags = ['Marketing', 'Sales', 'Brand', 'Product', 'Event', 'Social Media'];
  const availableFolders = ['Marketing Materials', 'Sales Assets', 'Brand Guidelines', 'Product Documentation'];
  
  // Initialize our custom hook for file uploads
  const {
    files,
    isUploading,
    progress,
    errors,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    cancelUpload
  } = useFileUpload({
    maxFiles: 20,
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    acceptedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
  });
  
  // File upload handlers
  const handleFilesAdded = (newFiles: File[]) => {
    addFiles(newFiles);
    
    // Initialize metadata for each new file
    const newMetadata = { ...metadata };
    newFiles.forEach(file => {
      if (!newMetadata[file.name]) {
        newMetadata[file.name] = [
          { id: 'description', label: 'Description', value: '', type: 'textarea' },
          { id: 'author', label: 'Author', value: '', type: 'text' },
          { id: 'source', label: 'Source', value: '', type: 'text' }
        ];
      }
    });
    setMetadata(newMetadata);
  };
  
  const handleRemoveFile = (fileName: string) => {
    removeFile(fileName);
    // Also clean up metadata
    const newMetadata = { ...metadata };
    delete newMetadata[fileName];
    setMetadata(newMetadata);
  };
  
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    try {
      await uploadFiles();
      // Navigate to asset library after successful upload
      navigate('/assets', { state: { uploadSuccess: true } });
    } catch (error) {
      // Error handling is already in the hook
      console.error('Upload failed:', error);
    }
  };
  
  // Metadata handling
  const openMetadataModal = (index: number) => {
    setSelectedFileIndex(index);
    setShowMetadataModal(true);
  };
  
  const updateMetadataField = (fileName: string, fieldId: string, value: string) => {
    const newMetadata = { ...metadata };
    const fieldIndex = newMetadata[fileName].findIndex(field => field.id === fieldId);
    if (fieldIndex !== -1) {
      newMetadata[fileName][fieldIndex].value = value;
      setMetadata(newMetadata);
    }
  };
  
  // Get file extension and determine its type
  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) return 'document';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'spreadsheet';
    if (['ppt', 'pptx'].includes(extension)) return 'presentation';
    return 'other';
  };
  
  // Get appropriate icon for file type
  const getFileIcon = (fileName: string): string => {
    const type = getFileType(fileName);
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      case 'spreadsheet': return '📊';
      case 'presentation': return '📑';
      default: return '📁';
    }
  };
  
  return (
    <Container>
      <PageHeader>
        <h1>Upload Assets</h1>
        <BackLink to="/admin">Back to Dashboard</BackLink>
      </PageHeader>
      
      <UploadSection>
        <FileDropzone
          onFilesAdded={handleFilesAdded}
          maxFiles={20}
          maxSize={50 * 1024 * 1024}
          accept={{
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-powerpoint': ['.ppt'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
          }}
          label="Drag and drop files to upload"
          supportedFormatsText="Supported formats: JPG, PNG, GIF, PDF, DOCX, XLSX, PPTX"
          disabled={isUploading}
        />
        
        {errors.length > 0 && (
          <ErrorMessages>
            {errors.map((error, index) => (
              <ErrorMessage key={index}>
                <FiAlertCircle /> {error}
              </ErrorMessage>
            ))}
          </ErrorMessages>
        )}
      </UploadSection>
      
      {files.length > 0 && (
        <UploadedFiles>
          <SectionHeader>
            <h2>Selected Files ({files.length})</h2>
            <div>
              <Button 
                variant="tertiary" 
                size="small" 
                onClick={clearFiles}
                disabled={isUploading}
              >
                Clear All
              </Button>
            </div>
          </SectionHeader>
          
          <FolderSection>
            <SectionSubHeader>
              <h3>Destination Folder</h3>
            </SectionSubHeader>
            <FolderSelector>
              <select 
                value={selectedFolder} 
                onChange={(e) => setSelectedFolder(e.target.value)}
                disabled={isUploading}
              >
                <option value="">Select a folder</option>
                {availableFolders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </FolderSelector>
          </FolderSection>
          
          <TagsSection>
            <SectionSubHeader>
              <h3>Add Tags (applies to all files)</h3>
            </SectionSubHeader>
            <TagsContainer>
              {availableTags.map(tag => (
                <Tag 
                  key={tag}
                  isSelected={selectedTags.includes(tag)}
                  onClick={() => {
                    if (isUploading) return;
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag) 
                        : [...prev, tag]
                    );
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </TagsContainer>
          </TagsSection>
          
          <FileList>
            {files.map((file, index) => (
              <FileItem key={file.name}>
                <FileTypeIcon>{getFileIcon(file.name)}</FileTypeIcon>
                <FileDetails>
                  <FileName>{file.name}</FileName>
                  <FileSize>{(file.size / 1024 / 1024).toFixed(2)} MB</FileSize>
                  {isUploading && progress[file.name] !== undefined && (
                    <ProgressContainer>
                      <ProgressBar progress={progress[file.name]} />
                      <ProgressText>{progress[file.name]}%</ProgressText>
                    </ProgressContainer>
                  )}
                </FileDetails>
                <FileActions>
                  <ActionButton 
                    onClick={() => openMetadataModal(index)}
                    disabled={isUploading}
                    title="Edit Metadata"
                  >
                    Edit
                  </ActionButton>
                  <RemoveButton 
                    onClick={() => handleRemoveFile(file.name)}
                    disabled={isUploading}
                    title="Remove File"
                  >
                    ✕
                  </RemoveButton>
                </FileActions>
              </FileItem>
            ))}
          </FileList>
          
          <UploadActions>
            <Button 
              variant="tertiary"
              onClick={() => navigate('/admin')}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={isUploading || files.length === 0 || !selectedFolder}
              isLoading={isUploading}
              leftIcon={<FiUpload />}
            >
              {isUploading ? 'Uploading...' : `Upload ${files.length} Files`}
            </Button>
          </UploadActions>
        </UploadedFiles>
      )}
      
      {/* Metadata Modal */}
      {selectedFileIndex !== null && files[selectedFileIndex] && (
        <MetadataModal
          isOpen={showMetadataModal}
          onClose={() => setShowMetadataModal(false)}
          fileName={files[selectedFileIndex].name}
          fields={metadata[files[selectedFileIndex].name] || []}
          onFieldChange={(fieldId, value) => updateMetadataField(files[selectedFileIndex].name, fieldId, value)}
          onSave={() => {
            // In a real app, we would save this metadata to state to be uploaded with the file
            console.log('Metadata saved:', metadata[files[selectedFileIndex].name]);
          }}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  h1 {
    margin-bottom: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const UploadSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ErrorMessages = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.error + '10'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const UploadedFiles = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    margin-bottom: 0;
  }
`;

const SectionSubHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    margin-bottom: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const FolderSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  padding-bottom: ${({ theme }) => theme.spacing[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FolderSelector = styled.div`
  select {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[3]};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    background-color: ${({ theme }) => theme.colors.background};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

const TagsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  padding-bottom: ${({ theme }) => theme.spacing[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Tag = styled.div<{ isSelected: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  background-color: ${({ theme, isSelected }) => isSelected ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, isSelected }) => isSelected ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme, isSelected }) => isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme, isSelected }) => 
      isSelected ? theme.colors.primary : theme.colors.primaryLight + '20'};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  max-height: 400px;
  overflow-y: auto;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const FileTypeIcon = styled.div`
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.primaryLight + '10'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const FileDetails = styled.div`
  flex: 1;
  min-width: 0; // Needed for text truncation
`;

const FileName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ProgressBar = styled.div<{ progress: number }>`
  flex: 1;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ progress }) => `${progress}%`};
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  min-width: 40px;
  text-align: right;
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight + '20'};
  }
  
  &:disabled {
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
    }
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.error};
  }
  
  &:disabled {
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  }
`;

const UploadActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export default AdminUploadPage;