import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>DAMFront</FooterLogo>
          <FooterDescription>
            A lightweight Digital Asset Management solution for organizing, 
            storing, and retrieving digital assets efficiently.
          </FooterDescription>
        </FooterSection>
        
        <FooterLinks>
          <FooterLinkGroup>
            <FooterLinkTitle>Navigation</FooterLinkTitle>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/assets">Asset Library</FooterLink>
            <FooterLink to="/admin">Admin Dashboard</FooterLink>
          </FooterLinkGroup>
          
          <FooterLinkGroup>
            <FooterLinkTitle>Admin</FooterLinkTitle>
            <FooterLink to="/admin/upload">Upload Assets</FooterLink>
            <FooterLink to="/admin/filters">Filter Categories</FooterLink>
          </FooterLinkGroup>
        </FooterLinks>
      </FooterContent>
      
      <FooterBottom>
        <Copyright>© {currentYear} DAMFront. All rights reserved.</Copyright>
      </FooterBottom>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[4]}`};
`;

const FooterContent = styled.div`
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const FooterSection = styled.div`
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing[8]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-right: 0;
  }
`;

const FooterLogo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const FooterDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-bottom: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[10]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const FooterLinkGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLinkTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
`;

const FooterBottom = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding-top: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-bottom: 0;
`;

export default Footer;