import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';

// Search history item interface
export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: Array<{ field: string; operator: string; value: string }>;
  timestamp: string;
  resultCount?: number;
}

interface SearchHistoryProps {
  maxItems?: number;
  onSelectSearch?: (search: SearchHistoryItem) => void;
  className?: string;
}

/**
 * Component to display and manage search history
 */
const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  maxItems = 5,
  onSelectSearch,
  className
}) => {
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  
  // Load search history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed);
        }
      } catch (err) {
        console.error('Error parsing search history:', err);
      }
    }
  }, []);
  
  // Add a new search to history
  const addSearchToHistory = (search: SearchHistoryItem) => {
    setSearchHistory(prev => {
      // Remove duplicates and add new search to beginning
      const filtered = prev.filter(item => item.id !== search.id);
      const updated = [search, ...filtered].slice(0, maxItems);
      
      // Save to localStorage
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      
      return updated;
    });
  };
  
  // Clear all search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };
  
  // Remove a specific search from history
  const removeSearchFromHistory = (id: string) => {
    setSearchHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  };
  
  // Format the search query for display
  const formatSearchQuery = (search: SearchHistoryItem): string => {
    if (search.query) {
      return `"${search.query}"`;
    }
    
    if (search.filters && search.filters.length > 0) {
      // Show first filter as summary
      const filter = search.filters[0];
      return `${filter.field} ${filter.operator} ${filter.value}${search.filters.length > 1 ? ' +' + (search.filters.length - 1) + ' filters' : ''}`;
    }
    
    return 'Unspecified search';
  };
  
  // Handle click on a search history item
  const handleSearchClick = (search: SearchHistoryItem) => {
    if (onSelectSearch) {
      onSelectSearch(search);
    } else {
      // Navigate to search page with parameters
      if (search.query) {
        navigate(`/search?q=${encodeURIComponent(search.query)}`);
      } else if (search.filters && search.filters.length > 0) {
        const filter = search.filters[0];
        navigate(`/search?field=${encodeURIComponent(filter.field)}&operator=${encodeURIComponent(filter.operator)}&value=${encodeURIComponent(filter.value)}`);
      }
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };
  
  if (searchHistory.length === 0) {
    return null;
  }
  
  return (
    <Container className={className}>
      <Header>
        <Title>Recent Searches</Title>
        <ClearButton onClick={clearSearchHistory}>Clear All</ClearButton>
      </Header>
      
      <HistoryList>
        {searchHistory.map(search => (
          <HistoryItem key={search.id}>
            <HistoryItemContent onClick={() => handleSearchClick(search)}>
              <SearchQueryText>{formatSearchQuery(search)}</SearchQueryText>
              <SearchMeta>
                <SearchTime>{formatTimestamp(search.timestamp)}</SearchTime>
                {search.resultCount !== undefined && (
                  <ResultCount>{search.resultCount} results</ResultCount>
                )}
              </SearchMeta>
            </HistoryItemContent>
            <RemoveButton onClick={() => removeSearchFromHistory(search.id)}>
              ×
            </RemoveButton>
          </HistoryItem>
        ))}
      </HistoryList>
    </Container>
  );
};

const Container = styled(Card)`
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  
  &:hover {
    text-decoration: underline;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const HistoryItemContent = styled.div`
  flex: 1;
  cursor: pointer;
`;

const SearchQueryText = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const SearchMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SearchTime = styled.div``;

const ResultCount = styled.div``;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.error + '20'};
    color: ${({ theme }) => theme.colors.error};
  }
`;

export default SearchHistory;