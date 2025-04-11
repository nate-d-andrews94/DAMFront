import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container>
      <ContentBox>
        <StatusCode>404</StatusCode>
        <Title>Page Not Found</Title>
        <Description>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </Description>
        <HomeLink to="/">Return Home</HomeLink>
      </ContentBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ContentBox = styled.div`
  text-align: center;
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const StatusCode = styled.h1`
  font-size: 6rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  line-height: 1;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    text-decoration: none;
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default NotFoundPage;