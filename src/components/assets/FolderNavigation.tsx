import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
}

interface FolderNavigationProps {
  folders: Folder[];
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  className?: string;
}

/**
 * Folder navigation component for the asset library
 * Displays folders in a tree structure and allows navigation
 */
const FolderNavigation: React.FC<FolderNavigationProps> = ({
  folders,
  currentFolderId,
  onFolderSelect,
  className,
}) => {
  // Get root folders (no parent)
  const rootFolders = folders.filter((folder) => folder.parentId === null);

  // Get child folders for a parent folder
  const getChildFolders = (parentId: string) => {
    return folders.filter((folder) => folder.parentId === parentId);
  };

  // Recursive component to render folder tree
  const FolderTree = ({ parentId, level = 0 }: { parentId: string | null; level?: number }) => {
    const foldersToRender = parentId === null ? rootFolders : getChildFolders(parentId);

    if (foldersToRender.length === 0) {
      return null;
    }

    return (
      <FolderList>
        {foldersToRender.map((folder) => {
          const isSelected = folder.id === currentFolderId;
          const hasChildren = folders.some((f) => f.parentId === folder.id);
          
          return (
            <FolderItem key={folder.id} $level={level}>
              <FolderButton 
                onClick={() => onFolderSelect(folder.id)}
                $isSelected={isSelected}
              >
                <FolderIcon>{hasChildren ? "📁" : "📂"}</FolderIcon>
                <FolderName>{folder.name}</FolderName>
              </FolderButton>
              
              {hasChildren && <FolderTree parentId={folder.id} level={level + 1} />}
            </FolderItem>
          );
        })}
      </FolderList>
    );
  };

  return (
    <Container className={className}>
      <NavigationHeader>
        <Title>Folders</Title>
      </NavigationHeader>
      
      <AllAssetsButton 
        onClick={() => onFolderSelect(null)}
        $isSelected={currentFolderId === null}
      >
        <FolderIcon>🏠</FolderIcon>
        <FolderName>All Assets</FolderName>
      </AllAssetsButton>
      
      <FolderTree parentId={null} />
      
      {folders.length === 0 && (
        <EmptyMessage>No folders available</EmptyMessage>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const NavigationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  margin: 0;
`;

const FolderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FolderItem = styled.li<{ $level: number }>`
  margin: ${({ theme }) => theme.spacing[1]} 0;
  padding-left: ${({ $level, theme }) => $level * parseInt(theme.spacing[4])}px;
`;

const FolderButton = styled.button<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  
  font-weight: ${({ $isSelected, theme }) => 
    $isSelected ? theme.typography.fontWeights.medium : theme.typography.fontWeights.normal};
  color: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary : theme.colors.text};
  background-color: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primaryLight + '20' : 'transparent'};
  
  &:hover {
    background-color: ${({ $isSelected, theme }) => 
      $isSelected ? theme.colors.primaryLight + '30' : theme.colors.border + '50'};
  }
`;

const AllAssetsButton = styled(FolderButton)`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const FolderIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing[2]};
  font-size: 1.2em;
`;

const FolderName = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyMessage = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  font-style: italic;
`;

export default FolderNavigation;