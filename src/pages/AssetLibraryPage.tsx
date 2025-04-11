import { useState } from 'react';
import styled from 'styled-components';

const AssetLibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  
  // Placeholder for real implementation
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };
  
  return (
    <Container>
      <PageHeader>
        <h1>Asset Library</h1>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">Search</SearchButton>
        </SearchForm>
      </PageHeader>
      
      <ContentContainer>
        <FilterSidebar>
          <FilterSection>
            <h3>Filter Categories</h3>
            <FilterList>
              <FilterItem 
                isSelected={selectedFilter === 'all'}
                onClick={() => setSelectedFilter('all')}
              >
                All Assets
              </FilterItem>
              <FilterItem 
                isSelected={selectedFilter === 'images'}
                onClick={() => setSelectedFilter('images')}
              >
                Images
              </FilterItem>
              <FilterItem 
                isSelected={selectedFilter === 'documents'}
                onClick={() => setSelectedFilter('documents')}
              >
                Documents
              </FilterItem>
              <FilterItem 
                isSelected={selectedFilter === 'videos'}
                onClick={() => setSelectedFilter('videos')}
              >
                Videos
              </FilterItem>
            </FilterList>
          </FilterSection>
        </FilterSidebar>
        
        <MainContent>
          <EmptyState>
            <h3>No assets found</h3>
            <p>Upload assets to get started or try a different search.</p>
          </EmptyState>
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
  
  h1 {
    margin-bottom: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 500px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 100%;
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

const ContentContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

const FilterSidebar = styled.aside`
  flex: 0 0 250px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex: auto;
  }
`;

const FilterSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
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

const MainContent = styled.main`
  flex: 1;
  min-height: 500px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    max-width: 400px;
  }
`;

export default AssetLibraryPage;