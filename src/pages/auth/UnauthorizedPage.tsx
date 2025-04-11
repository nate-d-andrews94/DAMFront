import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Unauthorized access page
 * Shown when a user tries to access a page they don't have permission for
 */
const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  return (
    <Container>
      <Content>
        <Icon>🔒</Icon>
        <Title>Access Denied</Title>
        <Message>
          You don't have permission to access this page.
          {user?.role && (
            <RoleInfo>
              Your current role: <RoleBadge>{user.role}</RoleBadge>
            </RoleInfo>
          )}
        </Message>
        <ButtonGroup>
          <BackButton 
            variant="outlined" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </BackButton>
          <HomeButton 
            variant="primary" 
            onClick={() => navigate('/')}
          >
            Go to Homepage
          </HomeButton>
        </ButtonGroup>
        <ContactInfo>
          If you believe you should have access to this page, please contact your administrator.
        </ContactInfo>
        <LogoutLink onClick={logout}>
          Sign out and login with a different account
        </LogoutLink>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.div`
  max-width: 500px;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const RoleInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RoleBadge = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primaryLight + '20'};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-left: ${({ theme }) => theme.spacing[1]};
  text-transform: capitalize;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const BackButton = styled(Button)``;

const HomeButton = styled(Button)``;

const ContactInfo = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LogoutLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default UnauthorizedPage;