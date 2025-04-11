import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { v4 as uuidv4 } from 'uuid';

// Tag interface
interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
  createdAt: string;
  count: number; // Number of assets using this tag
}

// Mock initial tags
const initialTags: Tag[] = [
  { id: "tag1", name: "Logo", color: "#3B82F6", category: "Content Type", createdAt: new Date().toISOString(), count: 12 },
  { id: "tag2", name: "Header", color: "#10B981", category: "Content Type", createdAt: new Date().toISOString(), count: 8 },
  { id: "tag3", name: "Banner", color: "#F59E0B", category: "Content Type", createdAt: new Date().toISOString(), count: 15 },
  { id: "tag4", name: "Icon", color: "#6366F1", category: "Content Type", createdAt: new Date().toISOString(), count: 32 },
  { id: "tag5", name: "Q1 2025", color: "#EC4899", category: "Time Period", createdAt: new Date().toISOString(), count: 23 },
  { id: "tag6", name: "Q2 2025", color: "#8B5CF6", category: "Time Period", createdAt: new Date().toISOString(), count: 18 },
  { id: "tag7", name: "Campaign A", color: "#EF4444", category: "Campaign", createdAt: new Date().toISOString(), count: 9 },
  { id: "tag8", name: "Campaign B", color: "#F97316", category: "Campaign", createdAt: new Date().toISOString(), count: 14 },
  { id: "tag9", name: "Draft", color: "#A1A1AA", category: "Status", createdAt: new Date().toISOString(), count: 7 },
  { id: "tag10", name: "Approved", color: "#22C55E", category: "Status", createdAt: new Date().toISOString(), count: 28 },
];

// Available tag categories
const tagCategories = [
  "Content Type",
  "Time Period",
  "Campaign",
  "Status",
  "Department",
  "Brand",
  "Project",
  "Custom"
];

// Available tag colors
const tagColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#F97316", // Orange
  "#A1A1AA", // Gray
  "#22C55E", // Emerald
];

const TagManagementPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  
  // New tag form state
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(tagColors[0]);
  const [newTagCategory, setNewTagCategory] = useState(tagCategories[0]);
  
  // Filter tags based on search and category filter
  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? tag.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories from tags for filter dropdown
  const uniqueCategories = Array.from(new Set(tags.map(tag => tag.category)));
  
  // Handle creating a new tag
  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag: Tag = {
      id: uuidv4(),
      name: newTagName.trim(),
      color: newTagColor,
      category: newTagCategory,
      createdAt: new Date().toISOString(),
      count: 0
    };
    
    setTags(prev => [...prev, newTag]);
    resetForm();
  };
  
  // Handle updating an existing tag
  const handleUpdateTag = () => {
    if (!editingTagId || !newTagName.trim()) return;
    
    setTags(prev => prev.map(tag => 
      tag.id === editingTagId
        ? {
            ...tag,
            name: newTagName.trim(),
            color: newTagColor,
            category: newTagCategory
          }
        : tag
    ));
    
    resetForm();
  };
  
  // Handle tag deletion
  const handleDeleteTag = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };
  
  // Edit an existing tag
  const handleEditTag = (tag: Tag) => {
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setNewTagCategory(tag.category);
    setEditingTagId(tag.id);
    setIsCreatingTag(true);
  };
  
  // Reset form state
  const resetForm = () => {
    setNewTagName('');
    setNewTagColor(tagColors[0]);
    setNewTagCategory(tagCategories[0]);
    setIsCreatingTag(false);
    setEditingTagId(null);
  };
  
  return (
    <Container>
      <PageHeader>
        <h1>Tag Management</h1>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="primary"
            onClick={() => setIsCreatingTag(true)}
          >
            New Tag
          </Button>
        </SearchContainer>
      </PageHeader>
      
      <FilterBar>
        <CategoryFilter>
          <FilterLabel>Filter by Category:</FilterLabel>
          <CategorySelect 
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </CategorySelect>
        </CategoryFilter>
        
        <TagStats>
          {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''} found
        </TagStats>
      </FilterBar>
      
      {isCreatingTag && (
        <TagFormCard>
          <TagFormHeader>
            <h3>{editingTagId ? 'Edit Tag' : 'Create New Tag'}</h3>
            <CloseButton onClick={resetForm}>×</CloseButton>
          </TagFormHeader>
          
          <TagForm>
            <FormField>
              <FormLabel>Tag Name</FormLabel>
              <FormInput
                type="text"
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                autoFocus
              />
            </FormField>
            
            <FormField>
              <FormLabel>Category</FormLabel>
              <FormSelect
                value={newTagCategory}
                onChange={(e) => setNewTagCategory(e.target.value)}
              >
                {tagCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            
            <FormField>
              <FormLabel>Color</FormLabel>
              <ColorSelector>
                {tagColors.map(color => (
                  <ColorOption
                    key={color}
                    $color={color}
                    $isSelected={color === newTagColor}
                    onClick={() => setNewTagColor(color)}
                    title={color}
                  />
                ))}
              </ColorSelector>
            </FormField>
            
            <FormActions>
              <Button 
                variant="outlined" 
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={editingTagId ? handleUpdateTag : handleCreateTag}
                disabled={!newTagName.trim()}
              >
                {editingTagId ? 'Update' : 'Create'}
              </Button>
            </FormActions>
          </TagForm>
        </TagFormCard>
      )}
      
      <TagsGrid>
        {filteredTags.length > 0 ? (
          filteredTags.map(tag => (
            <TagCard key={tag.id}>
              <TagHeader>
                <TagColorDot $color={tag.color} />
                <TagName>{tag.name}</TagName>
                <TagActions>
                  <ActionButton onClick={() => handleEditTag(tag)}>
                    ✏️
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteTag(tag.id)}>
                    🗑️
                  </ActionButton>
                </TagActions>
              </TagHeader>
              
              <TagInfo>
                <TagCategory>{tag.category}</TagCategory>
                <TagUsage>{tag.count} asset{tag.count !== 1 ? 's' : ''}</TagUsage>
              </TagInfo>
              
              <TagDate>
                Created: {new Date(tag.createdAt).toLocaleDateString()}
              </TagDate>
            </TagCard>
          ))
        ) : (
          <EmptyState>
            <EmptyStateIcon>🏷️</EmptyStateIcon>
            <EmptyStateText>
              {searchQuery || selectedCategory
                ? 'No tags match your filters'
                : 'No tags found. Create a new tag to get started.'}
            </EmptyStateText>
            {(searchQuery || selectedCategory) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </EmptyState>
        )}
      </TagsGrid>
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

const FilterBar = styled.div`
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

const CategoryFilter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const CategorySelect = styled.select`
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TagStats = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TagFormCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: 0;
  overflow: hidden;
`;

const TagFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h3 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TagForm = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FormLabel = styled.label`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ColorSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ColorOption = styled.button<{ $color: string; $isSelected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  border: 2px solid ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  outline: none;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const FormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const TagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const TagCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const TagHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const TagColorDot = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const TagName = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TagActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const TagInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const TagCategory = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const TagUsage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TagDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: auto;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export default TagManagementPage;