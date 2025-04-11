import React, { useState } from 'react';
import styled from 'styled-components';
import { FilterCategory, FilterValue } from '@/types/asset.types';

interface FilterPanelProps {
  categories: FilterCategory[];
  values: FilterValue[];
  selectedValues: string[];
  onFilterChange: (valueIds: string[]) => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  values,
  selectedValues,
  onFilterChange,
  className,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(cat => cat.id)
  );
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const toggleFilter = (valueId: string) => {
    onFilterChange(
      selectedValues.includes(valueId)
        ? selectedValues.filter(id => id !== valueId)
        : [...selectedValues, valueId]
    );
  };
  
  const getValuesByCategory = (categoryId: string) => {
    return values.filter(value => value.categoryId === categoryId);
  };
  
  const clearAll = () => {
    onFilterChange([]);
  };
  
  return (
    <Container className={className}>
      <PanelHeader>
        <PanelTitle>Filters</PanelTitle>
        {selectedValues.length > 0 && (
          <ClearButton onClick={clearAll}>Clear All</ClearButton>
        )}
      </PanelHeader>
      
      <FilterList>
        {categories.map(category => {
          const categoryValues = getValuesByCategory(category.id);
          const isExpanded = expandedCategories.includes(category.id);
          const hasSelectedValues = categoryValues.some(
            value => selectedValues.includes(value.id)
          );
          
          return (
            <FilterCategory key={category.id}>
              <CategoryHeader onClick={() => toggleCategory(category.id)}>
                <CategoryTitle hasSelected={hasSelectedValues}>
                  {category.name}
                </CategoryTitle>
                <ExpandIcon isExpanded={isExpanded}>
                  {isExpanded ? '−' : '+'}
                </ExpandIcon>
              </CategoryHeader>
              
              {isExpanded && (
                <ValueList>
                  {categoryValues.map(value => (
                    <ValueItem key={value.id}>
                      <Checkbox
                        type="checkbox"
                        id={`filter-${value.id}`}
                        checked={selectedValues.includes(value.id)}
                        onChange={() => toggleFilter(value.id)}
                      />
                      <ValueLabel htmlFor={`filter-${value.id}`}>
                        {value.value}
                      </ValueLabel>
                    </ValueItem>
                  ))}
                  
                  {categoryValues.length === 0 && (
                    <EmptyValues>No values available</EmptyValues>
                  )}
                </ValueList>
              )}
            </FilterCategory>
          );
        })}
        
        {categories.length === 0 && (
          <EmptyCategories>No filter categories available</EmptyCategories>
        )}
      </FilterList>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const PanelTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  margin: 0;
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

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterCategory = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CategoryTitle = styled.h4<{ hasSelected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme, hasSelected }) => 
    hasSelected 
      ? theme.typography.fontWeights.semibold 
      : theme.typography.fontWeights.medium};
  margin: 0;
  color: ${({ theme, hasSelected }) => 
    hasSelected ? theme.colors.primary : theme.colors.text};
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  transition: transform ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ValueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  padding-left: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ValueItem = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  cursor: pointer;
  margin-right: ${({ theme }) => theme.spacing[2]};
  width: 16px;
  height: 16px;
`;

const ValueLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EmptyValues = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing[2]} 0;
  font-style: italic;
`;

const EmptyCategories = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing[4]} 0;
  text-align: center;
  font-style: italic;
`;

export default FilterPanel;