import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AuthService from '@/services/AuthService';
import { User, UserRole } from '@/types/user.types';

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    position: '',
    status: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        department: selectedUser.department || '',
        position: selectedUser.position || '',
        status: selectedUser.status
      });
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await AuthService.getUsers();
      setUsers(users);
      setError(null);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      
      const updatedUser = await AuthService.updateUser(selectedUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role as UserRole,
        department: formData.department,
        position: formData.position,
        status: formData.status as 'active' | 'inactive' | 'pending'
      });
      
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      setSelectedUser(updatedUser);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return '#6e36e5';
      case 'manager': return '#36b5e5';
      case 'editor': return '#36e57d';
      case 'viewer': return '#e5b636';
      default: return '#a0a0a0';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#3cbe68';
      case 'pending': return '#e7a83c';
      case 'inactive': return '#e75a3c';
      default: return '#a0a0a0';
    }
  };

  return (
    <Container>
      <PageHeader>
        <h1>User Management</h1>
        <ActionButton as={Link} to="/admin">Back to Dashboard</ActionButton>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ContentContainer>
        <UserListSection>
          <SectionHeader>
            <h2>Users</h2>
            <Badge>{users.length}</Badge>
          </SectionHeader>
          
          {loading && !users.length ? (
            <LoadingState>Loading users...</LoadingState>
          ) : (
            <UserList>
              {users.map(user => (
                <UserListItem 
                  key={user.id} 
                  active={selectedUser?.id === user.id}
                  onClick={() => handleSelectUser(user)}
                >
                  <UserAvatar>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <UserInitials>{user.name.slice(0, 2)}</UserInitials>
                    )}
                    <UserStatusIndicator status={user.status} />
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                    <RoleBadge style={{ backgroundColor: getRoleColor(user.role) }}>
                      {user.role}
                    </RoleBadge>
                  </UserInfo>
                </UserListItem>
              ))}
            </UserList>
          )}
        </UserListSection>

        <UserDetailSection>
          {selectedUser ? (
            <>
              <UserDetailHeader>
                <h2>{isEditing ? 'Edit User' : 'User Details'}</h2>
                <EditButton onClick={handleEditToggle}>
                  {isEditing ? 'Cancel' : 'Edit User'}
                </EditButton>
              </UserDetailHeader>
              
              {isEditing ? (
                <UserEditForm onSubmit={handleUpdateUser}>
                  <FormGroup>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormInput
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormInput
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroupRow>
                    <FormGroup>
                      <FormLabel htmlFor="role">Role</FormLabel>
                      <FormSelect
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="admin">Administrator</option>
                        <option value="manager">Manager</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </FormSelect>
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel htmlFor="status">Status</FormLabel>
                      <FormSelect
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                      </FormSelect>
                    </FormGroup>
                  </FormGroupRow>
                  
                  <FormGroupRow>
                    <FormGroup>
                      <FormLabel htmlFor="department">Department</FormLabel>
                      <FormInput
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel htmlFor="position">Position</FormLabel>
                      <FormInput
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </FormGroupRow>
                  
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </SubmitButton>
                </UserEditForm>
              ) : (
                <UserDetail>
                  <UserSummary>
                    <UserAvatar large>
                      {selectedUser.avatar ? (
                        <img src={selectedUser.avatar} alt={selectedUser.name} />
                      ) : (
                        <UserInitials>{selectedUser.name.slice(0, 2)}</UserInitials>
                      )}
                    </UserAvatar>
                    <div>
                      <UserDetailName>{selectedUser.name}</UserDetailName>
                      <UserDetailEmail>{selectedUser.email}</UserDetailEmail>
                      <StatusBadge style={{ backgroundColor: getStatusColor(selectedUser.status) }}>
                        {selectedUser.status}
                      </StatusBadge>
                      <RoleBadge style={{ backgroundColor: getRoleColor(selectedUser.role) }}>
                        {selectedUser.role}
                      </RoleBadge>
                    </div>
                  </UserSummary>
                  
                  <UserInfoGrid>
                    <UserInfoItem>
                      <InfoLabel>Department</InfoLabel>
                      <InfoValue>{selectedUser.department || '—'}</InfoValue>
                    </UserInfoItem>
                    <UserInfoItem>
                      <InfoLabel>Position</InfoLabel>
                      <InfoValue>{selectedUser.position || '—'}</InfoValue>
                    </UserInfoItem>
                    <UserInfoItem>
                      <InfoLabel>Created</InfoLabel>
                      <InfoValue>{new Date(selectedUser.createdAt).toLocaleDateString()}</InfoValue>
                    </UserInfoItem>
                    <UserInfoItem>
                      <InfoLabel>Last Login</InfoLabel>
                      <InfoValue>
                        {selectedUser.lastLogin
                          ? new Date(selectedUser.lastLogin).toLocaleDateString()
                          : 'Never'}
                      </InfoValue>
                    </UserInfoItem>
                  </UserInfoGrid>
                  
                  <UserGroupSection>
                    <SectionHeader>
                      <h3>Group Memberships</h3>
                      <Badge>{selectedUser.groups.length}</Badge>
                    </SectionHeader>
                    
                    {selectedUser.groups.length > 0 ? (
                      <GroupList>
                        {selectedUser.groups.map(groupId => (
                          <GroupItem key={groupId}>
                            {groupId}
                          </GroupItem>
                        ))}
                      </GroupList>
                    ) : (
                      <EmptyState>
                        <p>No group memberships</p>
                      </EmptyState>
                    )}
                  </UserGroupSection>
                </UserDetail>
              )}
            </>
          ) : (
            <EmptyState>
              <p>Select a user to view details</p>
            </EmptyState>
          )}
        </UserDetailSection>
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

const UserListSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const UserDetailSection = styled.div`
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

const LoadingState = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UserList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

interface UserListItemProps {
  active: boolean;
}

const UserListItem = styled.div<UserListItemProps>`
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

interface UserAvatarProps {
  large?: boolean;
}

const UserAvatar = styled.div<UserAvatarProps>`
  position: relative;
  width: ${({ large }) => large ? '4rem' : '2.5rem'};
  height: ${({ large }) => large ? '4rem' : '2.5rem'};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing[4]};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface UserStatusIndicatorProps {
  status: 'active' | 'inactive' | 'pending';
}

const UserStatusIndicator = styled.div<UserStatusIndicatorProps>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid white;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'inactive': return theme.colors.danger;
      default: return theme.colors.textSecondary;
    }
  }};
`;

const UserInitials = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: capitalize;
`;

const StatusBadge = styled(RoleBadge)`
  margin-right: 0.5rem;
`;

const UserDetailHeader = styled.div`
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

const UserDetail = styled.div`
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

const UserSummary = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const UserDetailName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  margin-bottom: 0.25rem;
`;

const UserDetailEmail = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.75rem;
`;

const UserInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const UserInfoItem = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const UserGroupSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const GroupList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const GroupItem = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const UserEditForm = styled.form`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormGroupRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
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

const FormSelect = styled.select`
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

export default UserManagementPage;