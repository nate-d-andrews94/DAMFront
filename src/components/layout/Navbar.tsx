import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <NavbarContainer>
      <NavbarContent>
        <LogoContainer>
          <Logo to="/">DAMFront</Logo>
        </LogoContainer>
        
        <MenuToggle onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </MenuToggle>
        
        <NavLinks isOpen={isMenuOpen}>
          <NavLink 
            to="/assets" 
            isActive={location.pathname.startsWith('/assets')}
          >
            Asset Library
          </NavLink>
          <NavLink 
            to="/admin" 
            isActive={location.pathname.startsWith('/admin')}
          >
            Admin
          </NavLink>
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.nav`
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices[10]};
`;

const NavbarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

const LogoContainer = styled.div`
  flex-shrink: 0;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    width: 100%;
    padding-top: ${({ theme }) => theme.spacing[4]};
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ theme, isActive }) => 
    isActive ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.medium};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
    text-decoration: none;
  }
`;

export default Navbar;