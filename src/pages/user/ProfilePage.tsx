import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

/**
 * User profile page
 * Allows users to view and update their profile information
 */
const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading, error } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    position: user?.position || ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return;
    }
    
    try {
      setFormError(null);
      setSuccessMessage(null);
      
      await updateProfile({
        name: formData.name,
        department: formData.department || undefined,
        position: formData.position || undefined
      });
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Profile update error:', err);
      setFormError((err as Error).message || 'Failed to update profile');
    }
  };
  
  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      name: user?.name || '',
      department: user?.department || '',
      position: user?.position || ''
    });
    setIsEditing(false);
    setFormError(null);
  };
  
  if (!user) {
    return <div>No user data available</div>;
  }
  
  return (
    <Container>
      <PageHeader>
        <Title>My Profile</Title>
        <HeaderActions>
          {!isEditing && (
            <EditButton 
              variant="primary" 
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </EditButton>
          )}
        </HeaderActions>
      </PageHeader>
      
      {successMessage && (
        <SuccessMessage>{successMessage}</SuccessMessage>
      )}
      
      {(formError || error) && (
        <ErrorMessage>{formError || error}</ErrorMessage>
      )}
      
      <ContentCard>
        <ProfileSection>
          <ProfileHeader>
            <Avatar src={user.avatar || '/images/default-avatar.png'} alt={user.name} />
            
            <ProfileInfo>
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </FormGroup>
                  
                  <FormRow>
                    <FormGroup>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        type="text"
                        value={formData.department}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        type="text"
                        value={formData.position}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </FormGroup>
                  </FormRow>
                  
                  <ButtonGroup>
                    <CancelButton 
                      variant="outlined" 
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </CancelButton>
                    <SaveButton 
                      type="submit" 
                      variant="primary" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </SaveButton>
                  </ButtonGroup>
                </Form>
              ) : (
                <>
                  <UserName>{user.name}</UserName>
                  <UserMeta>
                    <MetaItem>
                      <MetaLabel>Email:</MetaLabel>
                      <MetaValue>{user.email}</MetaValue>
                    </MetaItem>
                    
                    {user.department && (
                      <MetaItem>
                        <MetaLabel>Department:</MetaLabel>
                        <MetaValue>{user.department}</MetaValue>
                      </MetaItem>
                    )}
                    
                    {user.position && (
                      <MetaItem>
                        <MetaLabel>Position:</MetaLabel>
                        <MetaValue>{user.position}</MetaValue>
                      </MetaItem>
                    )}
                  </UserMeta>
                </>
              )}
            </ProfileInfo>
          </ProfileHeader>
        </ProfileSection>
        
        <ProfileSection>
          <SectionTitle>Account Information</SectionTitle>
          
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Role</InfoLabel>
              <InfoValue>
                <RoleBadge role={user.role}>{user.role}</RoleBadge>
              </InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>Status</InfoLabel>
              <InfoValue>
                <StatusBadge status={user.status}>{user.status}</StatusBadge>
              </InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>Account Created</InfoLabel>
              <InfoValue>{formatDate(user.createdAt)}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>Last Login</InfoLabel>
              <InfoValue>{user.lastLogin ? formatDate(user.lastLogin) : 'N/A'}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </ProfileSection>
        
        {user.groups.length > 0 && (
          <ProfileSection>
            <SectionTitle>Groups</SectionTitle>
            
            <GroupsList>
              {user.groups.map((groupId) => (
                <GroupBadge key={groupId}>
                  {formatGroupName(groupId)}
                </GroupBadge>
              ))}
            </GroupsList>
          </ProfileSection>
        )}
      </ContentCard>
    </Container>
  );
};

// Helper functions
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatGroupName = (groupId: string): string => {
  // This would normally fetch the group name from a groups service
  // For now, just format the ID to look like a name
  return groupId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Styled components
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin: 0;
`;

const HeaderActions = styled.div``;

const EditButton = styled(Button)``;

const ContentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const ProfileSection = styled.section`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: ${({ theme }) => theme.spacing[6]};
  border: 4px solid ${({ theme }) => theme.colors.background};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-right: 0;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin: 0 0 ${({ theme }) => theme.spacing[3]} 0;
`;

const UserMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
`;

const MetaLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-right: ${({ theme }) => theme.spacing[2]};
`;

const MetaValue = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const InfoLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const RoleBadge = styled.span<{ role: string }>`
  display: inline-block;
  text-transform: capitalize;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  
  ${({ role, theme }) => {
    if (role === 'admin') {
      return `
        background-color: ${theme.colors.primaryDark + '20'};
        color: ${theme.colors.primaryDark};
      `;
    } else if (role === 'manager') {
      return `
        background-color: ${theme.colors.primary + '20'};
        color: ${theme.colors.primary};
      `;
    } else if (role === 'editor') {
      return `
        background-color: ${theme.colors.success + '20'};
        color: ${theme.colors.success};
      `;
    } else {
      return `
        background-color: ${theme.colors.secondary + '20'};
        color: ${theme.colors.secondary};
      `;
    }
  }}
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  text-transform: capitalize;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  
  ${({ status, theme }) => {
    if (status === 'active') {
      return `
        background-color: ${theme.colors.success + '20'};
        color: ${theme.colors.success};
      `;
    } else if (status === 'pending') {
      return `
        background-color: ${theme.colors.warning + '20'};
        color: ${theme.colors.warning};
      `;
    } else {
      return `
        background-color: ${theme.colors.error + '20'};
        color: ${theme.colors.error};
      `;
    }
  }}
`;

const Form = styled.form``;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight + '40'};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const CancelButton = styled(Button)``;

const SaveButton = styled(Button)``;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  background-color: ${({ theme }) => theme.colors.success + '10'};
  border: 1px solid ${({ theme }) => theme.colors.success + '30'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.error + '10'};
  border: 1px solid ${({ theme }) => theme.colors.error + '30'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const GroupsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const GroupBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primaryLight + '20'};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

export default ProfilePage;