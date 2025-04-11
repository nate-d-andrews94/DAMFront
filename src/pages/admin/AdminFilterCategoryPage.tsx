import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AdminFilterCategoryPage = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  
  // Placeholder for real implementation
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating category:', { categoryName, categoryDescription });
    // Would actually save the category here
    setCategoryName('');
    setCategoryDescription('');
  };
  
  return (
    <Container>
      <PageHeader>
        <h1>Filter Categories</h1>
        <BackLink to="/admin">Back to Dashboard</BackLink>
      </PageHeader>
      
      <ContentGrid>
        <LeftColumn>
          <Card>
            <h2>Create New Category</h2>
            <Form onSubmit={handleCreateCategory}>
              <FormGroup>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input 
                  id="categoryName" 
                  type="text" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="E.g., Industry, Product Type"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="categoryDescription">Description</Label>
                <Textarea 
                  id="categoryDescription" 
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Describe the purpose of this category"
                  rows={4}
                />
              </FormGroup>
              
              <SubmitButton type="submit">Create Category</SubmitButton>
            </Form>
          </Card>
        </LeftColumn>
        
        <RightColumn>
          <Card>
            <SectionHeader>
              <h2>Existing Categories</h2>
            </SectionHeader>
            
            <EmptyState>
              <p>No filter categories have been created yet.</p>
              <p>Create a category to help organize your assets.</p>
            </EmptyState>
          </Card>
        </RightColumn>
      </ContentGrid>
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
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  h1 {
    margin-bottom: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div``;

const RightColumn = styled.div``;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  h2 {
    margin-bottom: 0;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight + '40'};
  }
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight + '40'};
  }
`;

const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default AdminFilterCategoryPage;