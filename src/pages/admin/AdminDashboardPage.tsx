import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <Container>
      <PageHeader>
        <h1>Admin Dashboard</h1>
        <ActionButton as={Link} to="/admin/upload">Upload Assets</ActionButton>
      </PageHeader>
      
      <StatsGrid>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Total Assets</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Recent Uploads</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Total Views</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Filter Categories</StatLabel>
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

export default AdminDashboardPage;