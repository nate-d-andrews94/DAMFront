import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AssetGrid from '@/components/assets/AssetGrid';
import FilterPanel from '@/components/assets/FilterPanel';
import FolderNavigation from '@/components/assets/FolderNavigation';
import QuickSearchShortcuts from '@/components/search/QuickSearchShortcuts';
import Button from '@/components/ui/Button';
import { Asset } from '@/types/asset.types';
import useAssetFilters from '@/hooks/useAssetFilters';

// Mock folder data for development
const mockFolders = [
  { id: "folder1", name: "Marketing", parentId: null, path: "/marketing" },
  { id: "folder2", name: "Sales", parentId: null, path: "/sales" },
  { id: "folder3", name: "Product", parentId: null, path: "/product" },
  { id: "folder4", name: "Brochures", parentId: "folder1", path: "/marketing/brochures" },
  { id: "folder5", name: "Social Media", parentId: "folder1", path: "/marketing/social-media" },
  { id: "folder6", name: "Presentations", parentId: "folder2", path: "/sales/presentations" },
  { id: "folder7", name: "Screenshots", parentId: "folder3", path: "/product/screenshots" },
  { id: "folder8", name: "Videos", parentId: "folder3", path: "/product/videos" },
  { id: "folder9", name: "Instagram", parentId: "folder5", path: "/marketing/social-media/instagram" },
  { id: "folder10", name: "Twitter", parentId: "folder5", path: "/marketing/social-media/twitter" },
];

const AssetLibraryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define default values
  const [localError, setLocalError] = useState<Error | null>(null);
  const [localIsLoading, setLocalIsLoading] = useState(true);
  
  // Use try-catch to safely use the hook
  let filteredAssets: any[] = [];
  let isLoading = localIsLoading;
  let error = localError;
  let searchQuery = '';
  let selectedFilterValues: string[] = [];
  let filterCategories: any[] = [];
  let filterValues: any[] = [];
  let setSearchQuery = (query: string) => {};
  let setSelectedFilterValues = (values: string[]) => {};
  let clearFilters = () => {};

  try {
    const result = useAssetFilters();
    filteredAssets = result.filteredAssets || [];
    isLoading = result.isLoading;
    error = result.error || localError;
    searchQuery = result.searchQuery || '';
    setSearchQuery = result.setSearchQuery;
    selectedFilterValues = result.selectedFilterValues || [];
    setSelectedFilterValues = result.setSelectedFilterValues;
    clearFilters = result.clearFilters;
    filterCategories = result.filterCategories || [];
    filterValues = result.filterValues || [];
    
    // Update local loading state to match
    if (localIsLoading !== result.isLoading) {
      setLocalIsLoading(result.isLoading);
    }
    
    if (Array.isArray(filteredAssets)) {
      console.log(`Asset filters loaded successfully: ${filteredAssets.length} assets found`);
    }
  } catch (e) {
    console.error("Error in useAssetFilters:", e);
    setLocalError(e as Error);
    error = e as Error;
  }
  
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>('all');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  // Apply asset type filtering on top of other filters
  const filteredByTypeAssets = Array.isArray(filteredAssets) ? filteredAssets.filter(asset => {
    // Apply folder filter
    if (currentFolderId && asset.folder !== getFolderPathById(currentFolderId)) {
      return false;
    }
    
    // Apply type filter
    if (assetTypeFilter === 'all') return true;
    if (assetTypeFilter === 'images') return /jpg|jpeg|png|gif|webp|svg/i.test(asset.fileType);
    if (assetTypeFilter === 'documents') return /pdf|doc|docx|xls|xlsx|ppt|pptx|txt/i.test(asset.fileType);
    if (assetTypeFilter === 'videos') return /mp4|webm|mov|avi/i.test(asset.fileType);
    if (assetTypeFilter === 'audio') return /mp3|wav|ogg/i.test(asset.fileType);
    return true;
  }) : [];
  
  // Get folder path by id
  const getFolderPathById = (folderId: string): string => {
    const folder = mockFolders.find(f => f.id === folderId);
    return folder ? folder.path : "";
  };
  
  // Handle folder selection
  const handleFolderSelect = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The searchQuery is already updated via onChange, so we don't need
    // to do anything else here except prevent the default form submission
  };
  
  // Handle asset selection
  const handleAssetClick = (asset: Asset) => {
    navigate(`/assets/${asset.id}`);
  };
  
  // Reset button to clear all filters and search
  const handleResetFilters = () => {
    clearFilters();
    setAssetTypeFilter('all');
    setCurrentFolderId(null);
  };
  
  // Navigate to upload page
  const handleUploadClick = () => {
    navigate('/upload');
  };
  
  return (
    <Container>
      <PageHeader>
        <HeaderLeft>
          <h1>
            {currentFolderId 
              ? `${mockFolders.find(f => f.id === currentFolderId)?.name || 'Folder'}`
              : 'Asset Library'
            }
          </h1>
          <Badge>{filteredByTypeAssets.length} assets</Badge>
          {currentFolderId && (
            <FolderPath>
              {mockFolders.find(f => f.id === currentFolderId)?.path || ''}
            </FolderPath>
          )}
        </HeaderLeft>
        <HeaderRight>
          <SearchForm onSubmit={handleSearch}>
            <SearchInput 
              type="text" 
              placeholder="Search assets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">Search</SearchButton>
          </SearchForm>
          <ButtonGroup>
            <AdvancedSearchLink to="/search">Advanced Search</AdvancedSearchLink>
            <UploadButton onClick={handleUploadClick}>Upload</UploadButton>
          </ButtonGroup>
        </HeaderRight>
      </PageHeader>
      
      <ContentContainer>
        <FilterSidebar>
          <FolderNavigation
            folders={mockFolders}
            currentFolderId={currentFolderId}
            onFolderSelect={handleFolderSelect}
          />
          
          <FilterSection>
            <FilterSectionHeader>
              <h3>Asset Types</h3>
              {assetTypeFilter !== 'all' && (
                <ClearButton onClick={() => setAssetTypeFilter('all')}>Clear</ClearButton>
              )}
            </FilterSectionHeader>
            <FilterList>
              <FilterItem 
                isSelected={assetTypeFilter === 'all'}
                onClick={() => setAssetTypeFilter('all')}
              >
                All Assets
              </FilterItem>
              <FilterItem 
                isSelected={assetTypeFilter === 'images'}
                onClick={() => setAssetTypeFilter('images')}
              >
                Images
              </FilterItem>
              <FilterItem 
                isSelected={assetTypeFilter === 'documents'}
                onClick={() => setAssetTypeFilter('documents')}
              >
                Documents
              </FilterItem>
              <FilterItem 
                isSelected={assetTypeFilter === 'videos'}
                onClick={() => setAssetTypeFilter('videos')}
              >
                Videos
              </FilterItem>
              <FilterItem 
                isSelected={assetTypeFilter === 'audio'}
                onClick={() => setAssetTypeFilter('audio')}
              >
                Audio
              </FilterItem>
            </FilterList>
          </FilterSection>
          
          <StyledFilterPanel
            categories={filterCategories}
            values={filterValues}
            selectedValues={selectedFilterValues}
            onFilterChange={setSelectedFilterValues}
          />
          
          {(searchQuery || selectedFilterValues.length > 0 || assetTypeFilter !== 'all' || currentFolderId !== null) && (
            <ResetFiltersButton onClick={handleResetFilters}>
              Reset All Filters
            </ResetFiltersButton>
          )}
        </FilterSidebar>
        
        <MainContent>
          {error ? (
            <ErrorState>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorText>Error loading assets: {error.message || 'Unknown error'}. Please try again.</ErrorText>
              <RetryButton onClick={() => window.location.reload()}>
                Retry
              </RetryButton>
            </ErrorState>
          ) : isLoading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Loading assets...</LoadingText>
            </LoadingContainer>
          ) : (
            <>
              {!searchQuery && (!selectedFilterValues || selectedFilterValues.length === 0) && assetTypeFilter === 'all' && !currentFolderId && (
                <QuickSearchShortcuts />
              )}
              
              <AssetGrid
                assets={filteredByTypeAssets || []}
                onAssetClick={handleAssetClick}
                isLoading={false}
                emptyMessage={
                  searchQuery || (selectedFilterValues && selectedFilterValues.length > 0) || assetTypeFilter !== 'all'
                    ? 'No assets match your filters. Try adjusting your search criteria.'
                    : currentFolderId 
                      ? `No assets found in this folder. Upload assets or move them here.`
                      : 'No assets found. Upload assets to get started.'
                }
              />
            </>
          )}
        </MainContent>
      </ContentContainer>
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
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  
  h1 {
    margin-bottom: 0;
  }
`;

const FolderPath = styled.div`
  font-family: monospace;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  background-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const Badge = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 350px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 100%;
    flex: 1;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md} 0 0 ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const AdvancedSearchLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  white-space: nowrap;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight + '20'};
    text-decoration: none;
  }
`;

const UploadButton = styled(Button).attrs({ variant: 'primary' })`
  white-space: nowrap;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

const FilterSidebar = styled.aside`
  flex: 0 0 280px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex: auto;
  }
`;

const FilterSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FilterSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    margin: 0;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FilterItem = styled.li<{ isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  font-weight: ${({ theme, isSelected }) => 
    isSelected ? theme.typography.fontWeights.medium : theme.typography.fontWeights.normal};
  color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary : theme.colors.text};
  background-color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primaryLight + '20' : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme, isSelected }) => 
      isSelected ? theme.colors.primaryLight + '30' : theme.colors.border + '50'};
  }
`;

const StyledFilterPanel = styled(FilterPanel)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ResetFiltersButton = styled(Button).attrs({ variant: 'outlined' })`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const MainContent = styled.main`
  flex: 1;
  min-height: 500px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  height: 100%;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3B82F6;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  text-align: center;
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const RetryButton = styled(Button).attrs({ variant: 'primary' })``;

export default AssetLibraryPage;