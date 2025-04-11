import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AuthService from '@/services/AuthService';
import { UserGroup, Permission } from '@/types/user.types';

// Mock function to get groups since we need to implement this
const getGroups = async (): Promise<UserGroup[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock groups from AuthService
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  return [
    {
      id: 'admins',
      name: 'Administrators',
      description: 'System administrators with full access',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      members: ['1'],
      permissions: [
        { id: 'admin-all-system', action: 'view', resourceType: 'system' },
        { id: 'admin-manage-users', action: 'manage_users', resourceType: 'system' }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Team',
      description: 'All marketing department staff',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-03-15T00:00:00Z',
      members: ['2', '3', '5'],
      permissions: [
        { id: 'marketing-asset-view', action: 'view', resourceType: 'asset' },
        { id: 'marketing-asset-download', action: 'download', resourceType: 'asset' },
        { id: 'marketing-asset-edit', action: 'edit', resourceType: 'asset' }
      ]
    },
    {
      id: 'leadership',
      name: 'Leadership Team',
      description: 'Executive and management staff',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-02-10T00:00:00Z',
      members: ['2'],
      permissions: [
        { id: 'leadership-view-all', action: 'view', resourceType: 'asset' },
        { id: 'leadership-download-all', action: 'download', resourceType: 'asset' }
      ]
    },
    {
      id: 'sales',
      name: 'Sales Team',
      description: 'All sales department staff',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-04-01T00:00:00Z',
      members: ['4'],
      permissions: [
        { id: 'sales-view-approved', action: 'view', resourceType: 'asset' },
        { id: 'sales-download-approved', action: 'download', resourceType: 'asset' }
      ]
    },
    {
      id: 'content-team',
      name: 'Content Team',
      description: 'Content creators and editors',
      createdAt: '2025-02-15T00:00:00Z',
      updatedAt: '2025-02-15T00:00:00Z',
      members: ['3'],
      permissions: [
        { id: 'content-asset-edit', action: 'edit', resourceType: 'asset' },
        { id: 'content-asset-upload', action: 'upload', resourceType: 'asset' }
      ]
    }
  ];
};

// Mock function to update a group
const updateGroup = async (groupId: string, groupData: Partial<UserGroup>): Promise<UserGroup> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  // In a real app, this would call an API
  console.log('Updating group', groupId, groupData);
  
  // Return mock updated group
  const groups = await getGroups();
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    throw new Error('Group not found');
  }
  
  return {
    ...group,
    ...groupData,
    updatedAt: new Date().toISOString()
  };
};

const GroupManagementPage = () => {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  useEffect(() => {
    fetchGroups();
  }, []);
  
  useEffect(() => {
    if (selectedGroup) {
      setFormData({
        name: selectedGroup.name,
        description: selectedGroup.description || ''
      });
    }
  }, [selectedGroup]);
  
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const groups = await getGroups();
      setGroups(groups);
      setError(null);
    } catch (err) {
      setError('Failed to load groups. Please try again.');
      console.error('Error loading groups:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectGroup = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsEditing(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGroup) return;
    
    try {
      setLoading(true);
      
      const updatedGroup = await updateGroup(selectedGroup.id, {
        name: formData.name,
        description: formData.description
      });
      
      setGroups(groups.map(group => 
        group.id === updatedGroup.id ? updatedGroup : group
      ));
      
      setSelectedGroup(updatedGroup);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update group. Please try again.');
      console.error('Error updating group:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to format permission in readable text
  const formatPermission = (permission: Permission): string => {
    const actionMap: Record<string, string> = {
      view: 'View',
      download: 'Download',
      edit: 'Edit',
      delete: 'Delete',
      share: 'Share',
      upload: 'Upload',
      manage_users: 'Manage Users',
      manage_groups: 'Manage Groups',
      manage_permissions: 'Manage Permissions'
    };
    
    const resourceMap: Record<string, string> = {
      asset: 'Assets',
      folder: 'Folders',
      tag: 'Tags',
      user: 'Users',
      group: 'Groups',
      system: 'System'
    };
    
    const action = actionMap[permission.action] || permission.action;
    const resource = resourceMap[permission.resourceType] || permission.resourceType;
    
    return `${action} ${resource}${permission.resourceId ? ` (ID: ${permission.resourceId})` : ''}`;
  };

  return (
    <Container>
      <PageHeader>
        <h1>Group Management</h1>
        <ActionButton as={Link} to="/admin">Back to Dashboard</ActionButton>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ContentContainer>
        <GroupListSection>
          <SectionHeader>
            <h2>Groups</h2>
            <Badge>{groups.length}</Badge>
          </SectionHeader>
          
          {loading && !groups.length ? (
            <LoadingState>Loading groups...</LoadingState>
          ) : (
            <GroupList>
              {groups.map(group => (
                <GroupListItem 
                  key={group.id} 
                  active={selectedGroup?.id === group.id}
                  onClick={() => handleSelectGroup(group)}
                >
                  <GroupIcon>
                    {group.name.charAt(0)}
                  </GroupIcon>
                  <GroupInfo>
                    <GroupName>{group.name}</GroupName>
                    <GroupDescription>{group.description || 'No description'}</GroupDescription>
                    <MembersBadge>
                      {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                    </MembersBadge>
                  </GroupInfo>
                </GroupListItem>
              ))}
            </GroupList>
          )}
        </GroupListSection>

        <GroupDetailSection>
          {selectedGroup ? (
            <>
              <GroupDetailHeader>
                <h2>{isEditing ? 'Edit Group' : 'Group Details'}</h2>
                <EditButton onClick={handleEditToggle}>
                  {isEditing ? 'Cancel' : 'Edit Group'}
                </EditButton>
              </GroupDetailHeader>
              
              {isEditing ? (
                <GroupEditForm onSubmit={handleUpdateGroup}>
                  <FormGroup>
                    <FormLabel htmlFor="name">Group Name</FormLabel>
                    <FormInput
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <FormTextarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </FormGroup>
                  
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </SubmitButton>
                </GroupEditForm>
              ) : (
                <GroupDetail>
                  <GroupSummary>
                    <GroupIconLarge>
                      {selectedGroup.name.charAt(0)}
                    </GroupIconLarge>
                    <div>
                      <GroupDetailName>{selectedGroup.name}</GroupDetailName>
                      <GroupDetailDescription>
                        {selectedGroup.description || 'No description'}
                      </GroupDetailDescription>
                      <GroupMetaInfo>
                        Created {new Date(selectedGroup.createdAt).toLocaleDateString()} • 
                        Updated {new Date(selectedGroup.updatedAt).toLocaleDateString()}
                      </GroupMetaInfo>
                    </div>
                  </GroupSummary>
                  
                  <SectionDivider />
                  
                  <SectionSubHeader>
                    <h3>Members</h3>
                    <Badge>{selectedGroup.members.length}</Badge>
                  </SectionSubHeader>
                  
                  {selectedGroup.members.length > 0 ? (
                    <MembersList>
                      {selectedGroup.members.map(memberId => (
                        <MemberItem key={memberId}>
                          <MemberAvatar>{memberId}</MemberAvatar>
                          <div>User ID: {memberId}</div>
                        </MemberItem>
                      ))}
                    </MembersList>
                  ) : (
                    <EmptyState>
                      <p>No members in this group</p>
                    </EmptyState>
                  )}
                  
                  <SectionDivider />
                  
                  <SectionSubHeader>
                    <h3>Permissions</h3>
                    <Badge>{selectedGroup.permissions.length}</Badge>
                  </SectionSubHeader>
                  
                  {selectedGroup.permissions.length > 0 ? (
                    <PermissionsList>
                      {selectedGroup.permissions.map(permission => (
                        <PermissionItem key={permission.id}>
                          {formatPermission(permission)}
                        </PermissionItem>
                      ))}
                    </PermissionsList>
                  ) : (
                    <EmptyState>
                      <p>No permissions assigned</p>
                    </EmptyState>
                  )}
                </GroupDetail>
              )}
            </>
          ) : (
            <EmptyState>
              <p>Select a group to view details</p>
            </EmptyState>
          )}
        </GroupDetailSection>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
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
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const ActionButton = styled.button`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: none;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const GroupListSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const GroupDetailSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h2, h3 {
    margin-bottom: 0;
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  }
`;

const SectionSubHeader = styled(SectionHeader)`
  border-top: none;
  padding-top: 0;
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
`;

const MembersBadge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingState = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GroupList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

interface GroupListItemProps {
  active: boolean;
}

const GroupListItem = styled.div<GroupListItemProps>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  cursor: pointer;
  background-color: ${({ active, theme }) => active ? theme.colors.primaryLight : 'transparent'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primaryLight : theme.colors.backgroundHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const GroupIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  text-transform: uppercase;
  margin-right: ${({ theme }) => theme.spacing[4]};
`;

const GroupIconLarge = styled(GroupIcon)`
  width: 4rem;
  height: 4rem;
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
`;

const GroupInfo = styled.div`
  flex: 1;
`;

const GroupName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: 0.25rem;
`;

const GroupDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const GroupDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h2 {
    margin-bottom: 0;
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  }
`;

const EditButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const GroupDetail = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GroupSummary = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const GroupDetailName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  margin-bottom: 0.25rem;
`;

const GroupDetailDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const GroupMetaInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing[6]} 0;
`;

const MembersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const MemberAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-right: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
`;

const PermissionsList = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const PermissionItem = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const GroupEditForm = styled.form`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  margin-top: ${({ theme }) => theme.spacing[6]};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default GroupManagementPage;