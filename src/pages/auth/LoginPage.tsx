import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

/**
 * Login page component
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  
  // Get the page to redirect to after login
  const from = (location.state as any)?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setFormError('Password is required');
      return;
    }
    
    try {
      setFormError(null);
      
      // Attempt login
      await login({ email, password });
      
      // Navigate to the page the user was trying to access
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setFormError((err as Error).message || 'Login failed. Please check your credentials.');
    }
  };
  
  return (
    <Container>
      <LoginCard>
        <Logo>DAM Platform</Logo>
        <Title>Sign In</Title>
        <Description>Sign in to access the Digital Asset Management platform</Description>
        
        {(formError || error) && (
          <ErrorMessage>{formError || error}</ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </FormGroup>
          
          <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>
          
          <SubmitButton 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </SubmitButton>
        </Form>
        
        <RegisterLink>
          Don't have an account? <Link to="/register">Register</Link>
        </RegisterLink>
        
        <DemoAccounts>
          <DemoTitle>Demo Accounts</DemoTitle>
          <DemoAccountList>
            <DemoAccount>
              <DemoRole>Admin:</DemoRole> admin@example.com
            </DemoAccount>
            <DemoAccount>
              <DemoRole>Manager:</DemoRole> manager@example.com
            </DemoAccount>
            <DemoAccount>
              <DemoRole>Editor:</DemoRole> editor@example.com
            </DemoAccount>
            <DemoAccount>
              <DemoRole>Viewer:</DemoRole> viewer@example.com
            </DemoAccount>
          </DemoAccountList>
          <DemoNote>Use any password to login with these demo accounts.</DemoNote>
        </DemoAccounts>
      </LoginCard>
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

const LoginCard = styled.div`
  width: 100%;
  max-width: 450px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Form = styled.form`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
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
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight + '40'};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.error + '10'};
  border: 1px solid ${({ theme }) => theme.colors.error + '30'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

const DemoAccounts = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const DemoTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  text-align: center;
`;

const DemoAccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const DemoAccount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DemoRole = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const DemoNote = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  text-align: center;
`;

export default LoginPage;