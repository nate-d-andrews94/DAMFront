import React, { useState } from 'react';
import styled from 'styled-components';
import { AssetActivity } from '@/types/asset.types';

interface ActivityLogListProps {
  activities: AssetActivity[];
  onFilterChange?: (filter: string) => void;
  className?: string;
}

/**
 * Component for displaying asset activity logs with filtering
 */
const ActivityLogList: React.FC<ActivityLogListProps> = ({
  activities,
  onFilterChange,
  className
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get icon for activity type
  const getActivityIcon = (action: AssetActivity['action']): string => {
    switch (action) {
      case 'view':
        return '👁️';
      case 'download':
        return '⬇️';
      case 'share':
        return '🔗';
      case 'edit':
        return '✏️';
      case 'version_upload':
        return '📤';
      case 'version_restore':
        return '🔄';
      default:
        return '📋';
    }
  };
  
  // Get action text
  const getActionText = (activity: AssetActivity): string => {
    const { action, actorName, versionNumber, contextData } = activity;
    
    switch (action) {
      case 'view':
        return `${actorName} viewed ${versionNumber ? `version ${versionNumber}` : 'this asset'}`;
      case 'download':
        return `${actorName} downloaded ${versionNumber ? `version ${versionNumber}` : 'this asset'}`;
      case 'share':
        return `${actorName} shared this asset ${contextData?.recipientEmail ? `with ${contextData.recipientEmail}` : ''}`;
      case 'edit':
        return `${actorName} edited ${contextData?.field || 'metadata'}`;
      case 'version_upload':
        return `${actorName} uploaded version ${versionNumber}`;
      case 'version_restore':
        return `${actorName} restored version ${versionNumber} as the current version`;
      default:
        return `${actorName} performed action on this asset`;
    }
  };
  
  // Filter activities based on active filter
  const filteredActivities = activeFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.action === activeFilter);
  
  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };
  
  return (
    <Container className={className}>
      <Header>
        <Title>Activity Log</Title>
        <FilterContainer>
          <FilterButton 
            isActive={activeFilter === 'all'} 
            onClick={() => handleFilterChange('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            isActive={activeFilter === 'view'} 
            onClick={() => handleFilterChange('view')}
          >
            Views
          </FilterButton>
          <FilterButton 
            isActive={activeFilter === 'download'} 
            onClick={() => handleFilterChange('download')}
          >
            Downloads
          </FilterButton>
          <FilterButton 
            isActive={activeFilter === 'version_upload' || activeFilter === 'version_restore'} 
            onClick={() => handleFilterChange('version_upload')}
          >
            Versions
          </FilterButton>
          <FilterButton 
            isActive={activeFilter === 'edit'} 
            onClick={() => handleFilterChange('edit')}
          >
            Edits
          </FilterButton>
          <FilterButton 
            isActive={activeFilter === 'share'} 
            onClick={() => handleFilterChange('share')}
          >
            Shares
          </FilterButton>
        </FilterContainer>
      </Header>
      
      {filteredActivities.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyText>No activities found</EmptyText>
        </EmptyState>
      ) : (
        <ActivityList>
          {filteredActivities.map((activity) => (
            <ActivityItem key={activity.id}>
              <ActivityIcon>
                {getActivityIcon(activity.action)}
              </ActivityIcon>
              <ActivityContent>
                <ActivityText>
                  {getActionText(activity)}
                </ActivityText>
                <ActivityDetails>
                  {activity.action === 'version_upload' && activity.contextData?.changeDescription && (
                    <ActivityNotes>
                      "{activity.contextData.changeDescription}"
                    </ActivityNotes>
                  )}
                  {activity.action === 'edit' && activity.contextData?.newValue && (
                    <ActivityNotes>
                      Set to: "{activity.contextData.newValue}"
                    </ActivityNotes>
                  )}
                </ActivityDetails>
                <ActivityTime>
                  {formatDate(activity.timestamp)}
                </ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </ActivityList>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing[3]} 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : 'transparent'};
  color: ${({ theme, isActive }) => 
    isActive ? 'white' : theme.colors.textSecondary};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme, isActive }) => 
      isActive ? theme.colors.primaryDark : theme.colors.border};
    color: ${({ theme, isActive }) => 
      isActive ? 'white' : theme.colors.text};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const EmptyText = styled.div`
  font-style: italic;
`;

const ActivityList = styled.div`
  max-height: 500px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const ActivityIcon = styled.div`
  margin-right: ${({ theme }) => theme.spacing[3]};
  font-size: 1.25rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ActivityDetails = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ActivityNotes = styled.div`
  font-style: italic;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: ${({ theme }) => theme.spacing[2]};
  padding-left: ${({ theme }) => theme.spacing[2]};
  border-left: 2px solid ${({ theme }) => theme.colors.border};
`;

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default ActivityLogList;