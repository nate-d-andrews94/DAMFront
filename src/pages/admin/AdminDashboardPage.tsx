import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <Container>
      <PageHeader>
        <h1>Admin Dashboard</h1>
        <ActionButton as={Link} to="/admin/upload">Upload Assets</ActionButton>
      </PageHeader>
      
      <AdminPanels>
        <AdminPanel to="/admin/users">
          <AdminPanelIcon>👤</AdminPanelIcon>
          <AdminPanelTitle>User Management</AdminPanelTitle>
          <AdminPanelDescription>
            Manage users, roles, and accounts
          </AdminPanelDescription>
        </AdminPanel>
        
        <AdminPanel to="/admin/groups">
          <AdminPanelIcon>👥</AdminPanelIcon>
          <AdminPanelTitle>Group Management</AdminPanelTitle>
          <AdminPanelDescription>
            Manage user groups and permissions
          </AdminPanelDescription>
        </AdminPanel>
        
        <AdminPanel to="/admin/upload">
          <AdminPanelIcon>📁</AdminPanelIcon>
          <AdminPanelTitle>Upload Assets</AdminPanelTitle>
          <AdminPanelDescription>
            Upload and manage digital assets
          </AdminPanelDescription>
        </AdminPanel>
        
        <AdminPanel to="/admin/filters">
          <AdminPanelIcon>🏷️</AdminPanelIcon>
          <AdminPanelTitle>Filter Categories</AdminPanelTitle>
          <AdminPanelDescription>
            Manage metadata and filter categories
          </AdminPanelDescription>
        </AdminPanel>
      </AdminPanels>
      
      <StatsGrid>
        <StatCard>
          <StatValue>6</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>5</StatValue>
          <StatLabel>User Groups</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Total Assets</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Total Views</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <SectionHeader>
        <h2>Recent Activity</h2>
        <ViewAllLink to="/admin/activity">View All</ViewAllLink>
      </SectionHeader>
      
      <EmptyState>
        <p>No recent activity</p>
      </EmptyState>
      
      <SectionHeader>
        <h2>Recent Uploads</h2>
        <ViewAllLink to="/assets">View All</ViewAllLink>
      </SectionHeader>
      
      <EmptyState>
        <p>No recent uploads</p>
        <ActionButton as={Link} to="/admin/upload">Upload Assets</ActionButton>
      </EmptyState>
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    margin-bottom: 0;
  }
`;

const ViewAllLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const AdminPanels = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const AdminPanel = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform ${({ theme }) => theme.transitions.fast},
              box-shadow ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  color: inherit;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    text-decoration: none;
    color: inherit;
  }
`;

const AdminPanelIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const AdminPanelTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-align: center;
`;

const AdminPanelDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin: 0;
`;

export default AdminDashboardPage;