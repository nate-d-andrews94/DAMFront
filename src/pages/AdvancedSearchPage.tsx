import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AssetGrid from '@/components/assets/AssetGrid';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SearchHistory, { SearchHistoryItem } from '@/components/search/SearchHistory';
import AssetService from '@/services/assetService';
import { Asset, FilterCategory, FilterValue } from '@/types/asset.types';

// Filter type for search criteria
interface SearchFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

// Saved search interface
interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilter[];
  createdAt: string;
}

// Mock saved searches
const mockSavedSearches: SavedSearch[] = [
  {
    id: 'search1',
    name: 'Recent Marketing Images',
    filters: [
      { id: 'f1', field: 'type', operator: 'equals', value: 'image' },
      { id: 'f2', field: 'folder', operator: 'contains', value: 'marketing' },
      { id: 'f3', field: 'uploadedAt', operator: 'after', value: '2025-01-01' }
    ],
    createdAt: '2025-03-15T10:30:00Z'
  },
  {
    id: 'search2',
    name: 'Large PDF Files',
    filters: [
      { id: 'f4', field: 'type', operator: 'equals', value: 'pdf' },
      { id: 'f5', field: 'size', operator: 'greater', value: '5000000' }
    ],
    createdAt: '2025-03-10T14:20:00Z'
  }
];

// Available fields for searching
const searchFields = [
  { id: 'name', label: 'Name' },
  { id: 'type', label: 'File Type' },
  { id: 'size', label: 'Size' },
  { id: 'uploadedAt', label: 'Upload Date' },
  { id: 'uploadedBy', label: 'Uploaded By' },
  { id: 'folder', label: 'Folder' },
  { id: 'tags', label: 'Tags' },
  { id: 'metadata.description', label: 'Description' }
];

// Available operators based on field type
const getOperatorsForField = (fieldId: string) => {
  const textFields = ['name', 'type', 'uploadedBy', 'folder', 'tags', 'metadata.description'];
  const numericFields = ['size'];
  const dateFields = ['uploadedAt'];
  
  if (textFields.includes(fieldId)) {
    return [
      { id: 'equals', label: 'Equals' },
      { id: 'contains', label: 'Contains' },
      { id: 'startsWith', label: 'Starts with' },
      { id: 'endsWith', label: 'Ends with' }
    ];
  } else if (numericFields.includes(fieldId)) {
    return [
      { id: 'equals', label: 'Equals' },
      { id: 'greater', label: 'Greater than' },
      { id: 'less', label: 'Less than' },
      { id: 'between', label: 'Between' }
    ];
  } else if (dateFields.includes(fieldId)) {
    return [
      { id: 'equals', label: 'On' },
      { id: 'before', label: 'Before' },
      { id: 'after', label: 'After' },
      { id: 'between', label: 'Between' }
    ];
  }
  
  return [{ id: 'equals', label: 'Equals' }];
};

// Get placeholder text based on field and operator
const getPlaceholderForField = (fieldId: string, operatorId: string) => {
  if (fieldId === 'type') return 'jpg, png, pdf, etc...';
  if (fieldId === 'size' && operatorId === 'between') return '1000000, 5000000';
  if (fieldId === 'size') return 'Size in bytes (e.g. 1000000)';
  if (fieldId === 'uploadedAt' && operatorId === 'between') return 'YYYY-MM-DD, YYYY-MM-DD';
  if (fieldId === 'uploadedAt') return 'YYYY-MM-DD';
  if (fieldId === 'tags') return 'Tag name';
  
  return 'Enter value...';
};

// Get input type based on field
const getInputTypeForField = (fieldId: string) => {
  if (fieldId === 'uploadedAt') return 'date';
  if (fieldId === 'size') return 'number';
  return 'text';
};

const AdvancedSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State for search filters
  const [filters, setFilters] = useState<SearchFilter[]>([
    { id: '1', field: 'name', operator: 'contains', value: '' }
  ]);
  const [results, setResults] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [isSavingSearch, setIsSavingSearch] = useState(false);
  
  // Load search parameters from URL on initial render
  useEffect(() => {
    const queryField = searchParams.get('field');
    const queryOperator = searchParams.get('operator');
    const queryValue = searchParams.get('value');
    
    if (queryField && queryOperator && queryValue) {
      setFilters([
        { id: '1', field: queryField, operator: queryOperator, value: queryValue }
      ]);
      // Auto-search if URL parameters are present
      handleSearch();
    }
  }, []);
  
  // Add a new filter
  const handleAddFilter = () => {
    const newId = (filters.length + 1).toString();
    setFilters([...filters, { id: newId, field: 'name', operator: 'contains', value: '' }]);
  };
  
  // Remove a filter
  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter(filter => filter.id !== filterId));
  };
  
  // Update a filter field
  const handleFilterFieldChange = (filterId: string, field: string, value: string) => {
    setFilters(filters.map(filter => {
      if (filter.id === filterId) {
        // Reset operator when field changes
        if (field === 'field') {
          return { 
            ...filter, 
            [field]: value, 
            operator: getOperatorsForField(value)[0].id 
          };
        }
        return { ...filter, [field]: value };
      }
      return filter;
    }));
  };
  
  // Load a saved search
  const handleLoadSavedSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    setShowSavedSearches(false);
  };
  
  // Save the current search
  const handleSaveSearch = () => {
    if (!newSearchName.trim()) return;
    
    // In a real app, this would save to a database
    const newSavedSearch: SavedSearch = {
      id: `search${Date.now()}`,
      name: newSearchName,
      filters: [...filters],
      createdAt: new Date().toISOString()
    };
    
    // For this demo, we would add to the mock saved searches
    console.log('Saving search:', newSavedSearch);
    
    setNewSearchName('');
    setIsSavingSearch(false);
  };
  
  // Execute the search
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      
      // Update URL with search params (using first filter only for simplicity)
      const mainFilter = filters[0];
      setSearchParams({
        field: mainFilter.field,
        operator: mainFilter.operator,
        value: mainFilter.value
      });
      
      // In a real app, we would send these filters to our API
      console.log('Searching with filters:', filters);
      
      // For the demo, we just get all assets and filter them on the client side
      const allAssets = await AssetService.getAssets();
      
      // Apply filters
      const filteredAssets = allAssets.filter(asset => {
        // Each filter is applied with AND logic
        return filters.every(filter => {
          return applyFilter(asset, filter);
        });
      });
      
      setResults(filteredAssets);
      
      // Add search to history if we have results and search terms
      if (filters.some(f => f.value)) {
        addToSearchHistory(filteredAssets);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply a single filter to an asset
  const applyFilter = (asset: Asset, filter: SearchFilter): boolean => {
    const { field, operator, value } = filter;
    
    // Handle nested fields like metadata.description
    let fieldValue: any;
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      fieldValue = asset[parent]?.[child];
    } else {
      fieldValue = asset[field];
    }
    
    // Handle different field types and operators
    if (field === 'tags') {
      // Special handling for tags array
      if (operator === 'equals') {
        return asset.tags.includes(value);
      } else if (operator === 'contains') {
        return asset.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()));
      }
    } else if (typeof fieldValue === 'string') {
      // String comparison
      if (operator === 'equals') {
        return fieldValue.toLowerCase() === value.toLowerCase();
      } else if (operator === 'contains') {
        return fieldValue.toLowerCase().includes(value.toLowerCase());
      } else if (operator === 'startsWith') {
        return fieldValue.toLowerCase().startsWith(value.toLowerCase());
      } else if (operator === 'endsWith') {
        return fieldValue.toLowerCase().endsWith(value.toLowerCase());
      }
    } else if (typeof fieldValue === 'number') {
      // Numeric comparison
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return false;
      
      if (operator === 'equals') {
        return fieldValue === numValue;
      } else if (operator === 'greater') {
        return fieldValue > numValue;
      } else if (operator === 'less') {
        return fieldValue < numValue;
      } else if (operator === 'between') {
        const [min, max] = value.split(',').map(v => parseFloat(v.trim()));
        return !isNaN(min) && !isNaN(max) && fieldValue >= min && fieldValue <= max;
      }
    } else if (field === 'uploadedAt') {
      // Date comparison
      const dateValue = new Date(value);
      const fieldDate = new Date(fieldValue);
      
      if (isNaN(dateValue.getTime())) return false;
      
      if (operator === 'equals') {
        // Compare just the date portion
        return fieldDate.toDateString() === dateValue.toDateString();
      } else if (operator === 'before') {
        return fieldDate < dateValue;
      } else if (operator === 'after') {
        return fieldDate > dateValue;
      } else if (operator === 'between') {
        const [startDate, endDate] = value.split(',').map(v => new Date(v.trim()));
        return (
          !isNaN(startDate.getTime()) && 
          !isNaN(endDate.getTime()) && 
          fieldDate >= startDate && 
          fieldDate <= endDate
        );
      }
    }
    
    return false;
  };
  
  // Handle asset click
  const handleAssetClick = (asset: Asset) => {
    navigate(`/assets/${asset.id}`);
  };
  
  // Reset search
  const handleReset = () => {
    setFilters([{ id: '1', field: 'name', operator: 'contains', value: '' }]);
    setResults([]);
    setSearchParams({});
  };
  
  // Add search to history
  const addToSearchHistory = (searchResults: Asset[]) => {
    const searchId = `search_${Date.now()}`;
    
    const historyItem: SearchHistoryItem = {
      id: searchId,
      query: '',
      filters: filters.map(f => ({
        field: f.field,
        operator: f.operator,
        value: f.value
      })),
      timestamp: new Date().toISOString(),
      resultCount: searchResults.length
    };
    
    // Get existing history from localStorage
    try {
      const existingHistory = localStorage.getItem('searchHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Add new search to beginning
      const updatedHistory = [historyItem, ...history.slice(0, 9)];
      
      // Save back to localStorage
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Error updating search history:', err);
    }
  };
  
  // Load a search from history
  const handleLoadFromHistory = (search: SearchHistoryItem) => {
    if (search.filters && search.filters.length > 0) {
      const mappedFilters = search.filters.map((filter, index) => ({
        id: (index + 1).toString(),
        field: filter.field,
        operator: filter.operator,
        value: filter.value
      }));
      
      setFilters(mappedFilters);
      handleSearch();
    }
  };

  return (
    <Container>
      <PageHeader>
        <h1>Advanced Search</h1>
      </PageHeader>
      
      <SearchContainer>
        <SearchHistory onSelectSearch={handleLoadFromHistory} />
        
        <SearchBuilder>
          <SearchHeader>
            <h2>Search Criteria</h2>
            <SearchActions>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => setShowSavedSearches(!showSavedSearches)}
              >
                Saved Searches
              </Button>
              {filters.some(f => f.value) && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => setIsSavingSearch(true)}
                >
                  Save Search
                </Button>
              )}
            </SearchActions>
          </SearchHeader>
          
          {showSavedSearches && (
            <SavedSearchesContainer>
              <h3>Saved Searches</h3>
              {mockSavedSearches.map(search => (
                <SavedSearchItem key={search.id} onClick={() => handleLoadSavedSearch(search)}>
                  <SavedSearchName>{search.name}</SavedSearchName>
                  <SavedSearchMeta>
                    {search.filters.length} {search.filters.length === 1 ? 'filter' : 'filters'}
                  </SavedSearchMeta>
                </SavedSearchItem>
              ))}
            </SavedSearchesContainer>
          )}
          
          {isSavingSearch && (
            <SaveSearchForm>
              <FormInput
                type="text"
                placeholder="Enter a name for this search"
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
                autoFocus
              />
              <SaveSearchActions>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => setIsSavingSearch(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="small" 
                  onClick={handleSaveSearch}
                  disabled={!newSearchName.trim()}
                >
                  Save
                </Button>
              </SaveSearchActions>
            </SaveSearchForm>
          )}
          
          <FiltersContainer>
            {filters.map(filter => (
              <FilterRow key={filter.id}>
                <FieldSelect
                  value={filter.field}
                  onChange={(e) => handleFilterFieldChange(filter.id, 'field', e.target.value)}
                >
                  {searchFields.map(field => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </FieldSelect>
                
                <OperatorSelect
                  value={filter.operator}
                  onChange={(e) => handleFilterFieldChange(filter.id, 'operator', e.target.value)}
                >
                  {getOperatorsForField(filter.field).map(op => (
                    <option key={op.id} value={op.id}>
                      {op.label}
                    </option>
                  ))}
                </OperatorSelect>
                
                <FilterInput
                  type={getInputTypeForField(filter.field)}
                  placeholder={getPlaceholderForField(filter.field, filter.operator)}
                  value={filter.value}
                  onChange={(e) => handleFilterFieldChange(filter.id, 'value', e.target.value)}
                />
                
                <RemoveFilterButton 
                  onClick={() => handleRemoveFilter(filter.id)}
                  disabled={filters.length === 1}
                >
                  ×
                </RemoveFilterButton>
              </FilterRow>
            ))}
          </FiltersContainer>
          
          <FilterActions>
            <Button 
              variant="text" 
              onClick={handleAddFilter}
            >
              + Add Filter
            </Button>
            
            <ActionButtons>
              <Button 
                variant="outlined" 
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSearch}
                disabled={!filters.some(f => f.value)}
              >
                Search
              </Button>
            </ActionButtons>
          </FilterActions>
        </SearchBuilder>
        
        <ResultsContainer>
          <ResultsHeader>
            <h2>Search Results</h2>
            {results.length > 0 && (
              <ResultsCount>{results.length} assets found</ResultsCount>
            )}
          </ResultsHeader>
          
          <AssetGrid
            assets={results}
            onAssetClick={handleAssetClick}
            isLoading={isLoading}
            emptyMessage={
              filters.some(f => f.value) 
                ? 'No assets match your search criteria' 
                : 'Use the search form to find assets'
            }
          />
        </ResultsContainer>
      </SearchContainer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  h1 {
    margin: 0;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const SearchBuilder = styled(Card)`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
`;

const SearchActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SavedSearchesContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SavedSearchItem = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SavedSearchName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const SavedSearchMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SaveSearchForm = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SaveSearchActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

const FieldSelect = styled.select`
  flex: 1;
  min-width: 120px;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 0 0 100%;
  }
`;

const OperatorSelect = styled.select`
  flex: 1;
  min-width: 120px;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 0 0 100%;
  }
`;

const FilterInput = styled.input`
  flex: 2;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: 1 0 80%;
  }
`;

const RemoveFilterButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1.2rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.error + '10'};
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const ResultsContainer = styled.div``;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
`;

const ResultsCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

export default AdvancedSearchPage;