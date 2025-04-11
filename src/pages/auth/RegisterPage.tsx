import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

/**
 * Registration page component
 */
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    position: ''
  });
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = (): boolean => {
    // Check for empty required fields
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Name, email and password are required');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    // Check password length
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return false;
    }
    
    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setFormError(null);
      
      // Attempt registration
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department || undefined,
        position: formData.position || undefined
      });
      
      // Show success message
      setIsSubmitted(true);
      
      // In a real app, we might redirect to a pending approval page
      // or directly to the dashboard if auto-approval is enabled
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setFormError((err as Error).message || 'Registration failed. Please try again.');
    }
  };
  
  if (isSubmitted) {
    return (
      <Container>
        <RegisterCard>
          <SuccessIcon>✓</SuccessIcon>
          <Title>Registration Successful</Title>
          <SuccessMessage>
            Your account has been created and is pending admin approval. You will be notified by email once your account is approved.
          </SuccessMessage>
          <ButtonContainer>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </ButtonContainer>
        </RegisterCard>
      </Container>
    );
  }
  
  return (
    <Container>
      <RegisterCard>
        <Logo>DAM Platform</Logo>
        <Title>Create Account</Title>
        <Description>Register to access the Digital Asset Management platform</Description>
        
        {(formError || error) && (
          <ErrorMessage>{formError || error}</ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={isLoading}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                disabled={isLoading}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password*</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={isLoading}
                required
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                placeholder="Your department"
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
                placeholder="Your position"
                disabled={isLoading}
              />
            </FormGroup>
          </FormRow>
          
          <SubmitButton 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </SubmitButton>
        </Form>
        
        <LoginLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginLink>
      </RegisterCard>
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

const RegisterCard = styled.div`
  width: 100%;
  max-width: 600px;
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

const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const FormGroup = styled.div`
  flex: 1;
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

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const LoginLink = styled.div`
  text-align: center;
  
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

const SuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing[4]} auto;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  font-size: 40px;
`;

const SuccessMessage = styled.p`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default RegisterPage;