import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container>
      <Hero>
        <h1>Digital Asset Management</h1>
        <p>Organize, store, and retrieve your digital assets efficiently</p>
        <LinkContainer>
          <StyledLink to="/assets">Browse Assets</StyledLink>
          <StyledLink to="/admin" className="secondary">Admin Dashboard</StyledLink>
        </LinkContainer>
      </Hero>
      <Features>
        <Feature>
          <h3>Asset Library</h3>
          <p>Browse and discover assets with powerful search and filtering</p>
        </Feature>
        <Feature>
          <h3>Easy Upload</h3>
          <p>Drag and drop interface for quick file uploads</p>
        </Feature>
        <Feature>
          <h3>Smart Sharing</h3>
          <p>Generate links with embedded context for tracking</p>
        </Feature>
      </Features>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const Hero = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} 0;
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes['4xl']};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing[8]};
  }
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background-color: ${({ theme, className }) => 
    className === 'secondary' ? 'transparent' : theme.colors.primary};
  color: ${({ theme, className }) => 
    className === 'secondary' ? theme.colors.primary : theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  
  &:hover {
    text-decoration: none;
    background-color: ${({ theme, className }) => 
      className === 'secondary' ? theme.colors.primaryLight + '20' : theme.colors.primaryDark};
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};
  margin-top: ${({ theme }) => theme.spacing[16]};
`;

const Feature = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export default HomePage;