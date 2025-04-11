import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import FileDropzone from '@/components/ui/FileDropzone';
import { Asset } from '@/types/asset.types';

interface VersionUploadModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, notes: string) => Promise<void>;
}

/**
 * Modal component for uploading new versions of an asset
 */
const VersionUploadModal: React.FC<VersionUploadModalProps> = ({
  asset,
  isOpen,
  onClose,
  onUpload
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle file drop/selection
  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  };
  
  // Handle version upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await onUpload(file, notes);
      onClose();
    } catch (err) {
      console.error('Error uploading version:', err);
      setError('Failed to upload new version. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <Modal>
        <ModalHeader>
          <ModalTitle>Upload New Version</ModalTitle>
          <CloseButton onClick={onClose} disabled={isLoading}>×</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <AssetInfo>
            <AssetName>Current asset: {asset.name}</AssetName>
            <AssetVersion>Version: {asset.version}</AssetVersion>
          </AssetInfo>
          
          <DropzoneContainer>
            <FileDropzone
              onDrop={handleFileDrop}
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc', '.docx'],
                'application/vnd.ms-excel': ['.xls', '.xlsx'],
                'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
                'video/*': ['.mp4', '.webm', '.mov'],
                'audio/*': ['.mp3', '.wav', '.ogg']
              }}
              maxFiles={1}
            />
          </DropzoneContainer>
          
          {file && (
            <FileInfo>
              <FileName>{file.name}</FileName>
              <FileSize>{formatFileSize(file.size)}</FileSize>
            </FileInfo>
          )}
          
          <NotesLabel>Version Notes</NotesLabel>
          <NotesInput 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe what changed in this version..."
            rows={4}
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalContent>
        
        <ModalFooter>
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpload}
            disabled={!file || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload New Version'}
          </Button>
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  );
};

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
};

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
  z-index: ${({ theme }) => theme.zIndices[50]};
`;

const Modal = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text};
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
    background-color: ${({ theme }) => theme.colors.background};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  overflow-y: auto;
  flex: 1;
`;

const AssetInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const AssetName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const AssetVersion = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DropzoneContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FileInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.success + '10'};
  border: 1px solid ${({ theme }) => theme.colors.success + '30'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FileName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const FileSize = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NotesLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const NotesInput = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  resize: vertical;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.error + '10'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export default VersionUploadModal;