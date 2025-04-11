import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Asset } from '@/types/asset.types';

// Modal states for different batch operations
type ModalType = 'tag' | 'move' | 'delete' | 'download' | null;

interface BatchOperationsBarProps {
  selectedAssets: Asset[];
  onClearSelection: () => void;
  onTagAssets: (assets: Asset[], tags: string[]) => Promise<void>;
  onMoveAssets: (assets: Asset[], targetFolder: string) => Promise<void>;
  onDeleteAssets: (assets: Asset[]) => Promise<void>;
  className?: string;
}

/**
 * Component for handling batch operations on selected assets
 */
const BatchOperationsBar: React.FC<BatchOperationsBarProps> = ({
  selectedAssets,
  onClearSelection,
  onTagAssets,
  onMoveAssets,
  onDeleteAssets,
  className,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [folderPaths, setFolderPaths] = useState<string[]>([
    '/marketing',
    '/sales',
    '/product',
    '/marketing/brochures',
    '/marketing/social-media',
    '/sales/presentations'
  ]);
  
  // Handle showing the tag modal
  const handleTagClick = () => {
    setActiveModal('tag');
    setTags([]);
    setTagInput('');
  };
  
  // Handle showing the move modal
  const handleMoveClick = () => {
    setActiveModal('move');
    setSelectedFolder('');
  };
  
  // Handle showing the delete modal
  const handleDeleteClick = () => {
    setActiveModal('delete');
  };
  
  // Handle downloading multiple assets
  const handleDownloadClick = async () => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would create a zip file
      // or provide individual download links
      for (const asset of selectedAssets) {
        const link = document.createElement('a');
        link.href = asset.fileUrl;
        link.download = asset.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add a slight delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Close modal and clear selection after successful download
      setActiveModal(null);
      onClearSelection();
    } catch (error) {
      console.error('Error downloading assets:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle adding a tag to the list
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Add tag if it doesn't already exist
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    
    setTagInput('');
  };
  
  // Handle removing a tag from the list
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Handle applying tags to selected assets
  const handleApplyTags = async () => {
    if (tags.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      await onTagAssets(selectedAssets, tags);
      setActiveModal(null);
      onClearSelection();
    } catch (error) {
      console.error('Error applying tags:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle moving assets to selected folder
  const handleMoveAssets = async () => {
    if (!selectedFolder) return;
    
    setIsProcessing(true);
    
    try {
      await onMoveAssets(selectedAssets, selectedFolder);
      setActiveModal(null);
      onClearSelection();
    } catch (error) {
      console.error('Error moving assets:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle deleting selected assets
  const handleDeleteAssets = async () => {
    setIsProcessing(true);
    
    try {
      await onDeleteAssets(selectedAssets);
      setActiveModal(null);
      onClearSelection();
    } catch (error) {
      console.error('Error deleting assets:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Calculate total size of selected assets
  const getTotalSize = (): string => {
    const totalBytes = selectedAssets.reduce((sum, asset) => sum + asset.size, 0);
    
    if (totalBytes < 1024) return `${totalBytes} B`;
    if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
    if (totalBytes < 1024 * 1024 * 1024) return `${(totalBytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(totalBytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };
  
  return (
    <Container className={className}>
      <SelectionInfo>
        <SelectionCount>
          {selectedAssets.length} {selectedAssets.length === 1 ? 'asset' : 'assets'} selected
        </SelectionCount>
        <SelectionSize>
          Total size: {getTotalSize()}
        </SelectionSize>
      </SelectionInfo>
      
      <ActionButtons>
        <ActionButton onClick={handleTagClick}>
          <ActionIcon>🏷️</ActionIcon>
          <ActionText>Tag</ActionText>
        </ActionButton>
        
        <ActionButton onClick={handleMoveClick}>
          <ActionIcon>📁</ActionIcon>
          <ActionText>Move</ActionText>
        </ActionButton>
        
        <ActionButton onClick={handleDownloadClick}>
          <ActionIcon>⬇️</ActionIcon>
          <ActionText>Download</ActionText>
        </ActionButton>
        
        <ActionButton onClick={handleDeleteClick} className="danger">
          <ActionIcon>🗑️</ActionIcon>
          <ActionText>Delete</ActionText>
        </ActionButton>
      </ActionButtons>
      
      <ClearButton onClick={onClearSelection}>
        Clear Selection
      </ClearButton>
      
      {/* Tag Modal */}
      {activeModal === 'tag' && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <ModalTitle>Tag Selected Assets</ModalTitle>
              <CloseButton onClick={() => setActiveModal(null)}>×</CloseButton>
            </ModalHeader>
            
            <ModalContent>
              <ModalText>
                Add tags to {selectedAssets.length} selected {selectedAssets.length === 1 ? 'asset' : 'assets'}.
              </ModalText>
              
              <TagInput>
                <TagInputField
                  type="text"
                  placeholder="Enter a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <AddTagButton onClick={handleAddTag}>Add</AddTagButton>
              </TagInput>
              
              <TagList>
                {tags.map(tag => (
                  <TagItem key={tag}>
                    <TagName>{tag}</TagName>
                    <RemoveTagButton onClick={() => handleRemoveTag(tag)}>×</RemoveTagButton>
                  </TagItem>
                ))}
                {tags.length === 0 && (
                  <EmptyMessage>No tags added yet</EmptyMessage>
                )}
              </TagList>
            </ModalContent>
            
            <ModalFooter>
              <Button 
                variant="outlined" 
                onClick={() => setActiveModal(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleApplyTags}
                disabled={tags.length === 0 || isProcessing}
              >
                {isProcessing ? 'Applying...' : 'Apply Tags'}
              </Button>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
      
      {/* Move Modal */}
      {activeModal === 'move' && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <ModalTitle>Move Selected Assets</ModalTitle>
              <CloseButton onClick={() => setActiveModal(null)}>×</CloseButton>
            </ModalHeader>
            
            <ModalContent>
              <ModalText>
                Select a destination folder for {selectedAssets.length} selected {selectedAssets.length === 1 ? 'asset' : 'assets'}.
              </ModalText>
              
              <FolderList>
                {folderPaths.map(folder => (
                  <FolderItem 
                    key={folder}
                    isSelected={selectedFolder === folder}
                    onClick={() => setSelectedFolder(folder)}
                  >
                    <FolderIcon>📁</FolderIcon>
                    <FolderPath>{folder}</FolderPath>
                  </FolderItem>
                ))}
              </FolderList>
            </ModalContent>
            
            <ModalFooter>
              <Button 
                variant="outlined" 
                onClick={() => setActiveModal(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleMoveAssets}
                disabled={!selectedFolder || isProcessing}
              >
                {isProcessing ? 'Moving...' : 'Move Assets'}
              </Button>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
      
      {/* Delete Modal */}
      {activeModal === 'delete' && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <ModalTitle>Delete Selected Assets</ModalTitle>
              <CloseButton onClick={() => setActiveModal(null)}>×</CloseButton>
            </ModalHeader>
            
            <ModalContent>
              <ModalText className="warning">
                Are you sure you want to delete {selectedAssets.length} selected {selectedAssets.length === 1 ? 'asset' : 'assets'}?
              </ModalText>
              <ModalText className="warning">
                This action cannot be undone.
              </ModalText>
              
              <AssetsList>
                {selectedAssets.slice(0, 5).map(asset => (
                  <AssetListItem key={asset.id}>
                    <AssetIcon>
                      {/jpg|jpeg|png|gif|webp|svg/i.test(asset.fileType) ? '🖼️' : 
                       /pdf|doc|docx|xls|xlsx|ppt|pptx|txt/i.test(asset.fileType) ? '📄' :
                       /mp4|webm|mov|avi/i.test(asset.fileType) ? '🎬' :
                       /mp3|wav|ogg/i.test(asset.fileType) ? '🎵' : '📁'}
                    </AssetIcon>
                    <AssetName>{asset.name}</AssetName>
                  </AssetListItem>
                ))}
                {selectedAssets.length > 5 && (
                  <MoreAssetsMessage>
                    +{selectedAssets.length - 5} more {selectedAssets.length - 5 === 1 ? 'asset' : 'assets'}
                  </MoreAssetsMessage>
                )}
              </AssetsList>
            </ModalContent>
            
            <ModalFooter>
              <Button 
                variant="outlined" 
                onClick={() => setActiveModal(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDeleteAssets}
                disabled={isProcessing}
              >
                {isProcessing ? 'Deleting...' : 'Delete Assets'}
              </Button>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]};
  z-index: ${({ theme }) => theme.zIndices[20]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const SelectionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectionCount = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const SelectionSize = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  opacity: 0.8;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  min-width: 70px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &.danger:hover {
    background: ${({ theme }) => theme.colors.error};
  }
`;

const ActionIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ActionText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
`;

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
  z-index: ${({ theme }) => theme.zIndices[30]};
`;

const Modal = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
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
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const ModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  overflow-y: auto;
  flex: 1;
`;

const ModalText = styled.p`
  margin-top: 0;
  
  &.warning {
    color: ${({ theme }) => theme.colors.error};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  }
`;

const TagInput = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const TagInputField = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-right: none;
  border-radius: ${({ theme }) => theme.borderRadius.md} 0 0 ${({ theme }) => theme.borderRadius.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddTagButton = styled.button`
  padding: ${({ theme }) => `0 ${theme.spacing[3]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primaryLight + '20'};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const TagName = styled.span`
  margin-right: ${({ theme }) => theme.spacing[1]};
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  margin: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const EmptyMessage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;

const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const FolderItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  background-color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primaryLight + '20' : 'transparent'};
  border: 1px solid ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${({ theme, isSelected }) => 
      isSelected ? theme.colors.primaryLight + '30' : theme.colors.background};
  }
`;

const FolderIcon = styled.div`
  margin-right: ${({ theme }) => theme.spacing[2]};
  font-size: 1.2rem;
`;

const FolderPath = styled.div`
  font-family: monospace;
`;

const AssetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const AssetListItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const AssetIcon = styled.div`
  margin-right: ${({ theme }) => theme.spacing[2]};
  font-size: 1.2rem;
`;

const AssetName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MoreAssetsMessage = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  text-align: center;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export default BatchOperationsBar;