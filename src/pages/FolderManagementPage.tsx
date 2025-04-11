import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { v4 as uuidv4 } from 'uuid';

// Mock folders structure - would come from a service in a real implementation
interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  createdAt: string;
}

// Mock initial folders
const initialFolders: Folder[] = [
  { id: "folder1", name: "Marketing", parentId: null, path: "/marketing", createdAt: new Date().toISOString() },
  { id: "folder2", name: "Sales", parentId: null, path: "/sales", createdAt: new Date().toISOString() },
  { id: "folder3", name: "Product", parentId: null, path: "/product", createdAt: new Date().toISOString() },
  { id: "folder4", name: "Brochures", parentId: "folder1", path: "/marketing/brochures", createdAt: new Date().toISOString() },
  { id: "folder5", name: "Social Media", parentId: "folder1", path: "/marketing/social-media", createdAt: new Date().toISOString() },
  { id: "folder6", name: "Presentations", parentId: "folder2", path: "/sales/presentations", createdAt: new Date().toISOString() },
  { id: "folder7", name: "Screenshots", parentId: "folder3", path: "/product/screenshots", createdAt: new Date().toISOString() },
  { id: "folder8", name: "Videos", parentId: "folder3", path: "/product/videos", createdAt: new Date().toISOString() },
  { id: "folder9", name: "Instagram", parentId: "folder5", path: "/marketing/social-media/instagram", createdAt: new Date().toISOString() },
  { id: "folder10", name: "Twitter", parentId: "folder5", path: "/marketing/social-media/twitter", createdAt: new Date().toISOString() },
];

const FolderManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get current folder details
  const currentFolderDetails = currentFolder 
    ? folders.find(f => f.id === currentFolder) 
    : null;
  
  // Get parent folders for breadcrumb navigation
  const getBreadcrumbPath = (folderId: string | null): Folder[] => {
    if (!folderId) return [];
    
    const result: Folder[] = [];
    let current = folders.find(f => f.id === folderId);
    
    while (current) {
      result.unshift(current);
      current = current.parentId 
        ? folders.find(f => f.id === current?.parentId) 
        : null;
    }
    
    return result;
  };
  
  // Get child folders
  const getChildFolders = (parentId: string | null): Folder[] => {
    return folders
      .filter(folder => folder.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };
  
  // Filter folders by search query
  const filteredFolders = searchQuery
    ? folders.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : getChildFolders(currentFolder);
  
  // Create a new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    // Construct the path
    const parentPath = currentFolderDetails?.path || '';
    const folderPath = `${parentPath}/${newFolderName.toLowerCase().replace(/\s+/g, '-')}`;
    
    const newFolder: Folder = {
      id: uuidv4(),
      name: newFolderName,
      parentId: currentFolder,
      path: folderPath,
      createdAt: new Date().toISOString()
    };
    
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };
  
  // Navigate to a folder
  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId);
  };
  
  // Navigate up to parent
  const handleNavigateUp = () => {
    if (!currentFolder) return;
    
    const parent = folders.find(f => f.id === currentFolder)?.parentId;
    setCurrentFolder(parent);
  };
  
  // Navigate to specific folder in breadcrumb
  const handleBreadcrumbClick = (folderId: string) => {
    setCurrentFolder(folderId);
  };
  
  // Navigate to home (root)
  const handleHomeClick = () => {
    setCurrentFolder(null);
  };
  
  return (
    <Container>
      <PageHeader>
        <h1>Folder Management</h1>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="primary"
            onClick={() => setIsCreatingFolder(true)}
          >
            New Folder
          </Button>
        </SearchContainer>
      </PageHeader>
      
      <Navigation>
        <BreadcrumbContainer>
          <BreadcrumbItem onClick={handleHomeClick}>
            Root
          </BreadcrumbItem>
          
          {getBreadcrumbPath(currentFolder).map((folder, index) => (
            <React.Fragment key={folder.id}>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem 
                onClick={() => handleBreadcrumbClick(folder.id)}
                isActive={index === getBreadcrumbPath(currentFolder).length - 1}
              >
                {folder.name}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbContainer>
        
        {currentFolder && (
          <Button 
            variant="outlined" 
            onClick={handleNavigateUp}
          >
            Up to Parent
          </Button>
        )}
      </Navigation>
      
      {isCreatingFolder && (
        <CreateFolderForm>
          <h3>Create New Folder</h3>
          <InputGroup>
            <FormInput
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
            <ButtonGroup>
              <Button 
                variant="primary" 
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                Create
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setIsCreatingFolder(false);
                  setNewFolderName('');
                }}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </InputGroup>
          {currentFolderDetails && (
            <FolderLocation>
              Location: {currentFolderDetails.path || 'Root'}
            </FolderLocation>
          )}
        </CreateFolderForm>
      )}
      
      <FoldersGrid>
        {filteredFolders.length > 0 ? (
          filteredFolders.map(folder => (
            <FolderCard key={folder.id} onClick={() => handleFolderClick(folder.id)}>
              <FolderIcon>📁</FolderIcon>
              <FolderName>{folder.name}</FolderName>
              <FolderInfo>
                Created: {new Date(folder.createdAt).toLocaleDateString()}
              </FolderInfo>
              <FolderPath>{folder.path}</FolderPath>
            </FolderCard>
          ))
        ) : searchQuery ? (
          <EmptyState>
            <EmptyStateIcon>🔍</EmptyStateIcon>
            <EmptyStateText>No folders match your search</EmptyStateText>
          </EmptyState>
        ) : (
          <EmptyState>
            <EmptyStateIcon>📁</EmptyStateIcon>
            <EmptyStateText>No folders found. Create a new folder to get started.</EmptyStateText>
          </EmptyState>
        )}
      </FoldersGrid>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  h1 {
    margin: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-width: 250px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const BreadcrumbItem = styled.button<{ isActive?: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: ${({ isActive, theme }) => 
    isActive ? theme.typography.fontWeights.medium : theme.typography.fontWeights.normal};
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : theme.colors.text};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CreateFolderForm = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  
  h3 {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const FormInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FolderLocation = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const FoldersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FolderCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing[4]};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const FolderIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FolderName = styled.h3`
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const FolderInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FolderPath = styled.div`
  font-family: monospace;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-top: auto;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

export default FolderManagementPage;