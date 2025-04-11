import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AdminUploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  }, []);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  }, []);
  
  return (
    <Container>
      <PageHeader>
        <h1>Upload Assets</h1>
        <BackLink to="/admin">Back to Dashboard</BackLink>
      </PageHeader>
      
      <DropZone 
        isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <DropzoneContent>
          <UploadIcon>📁</UploadIcon>
          <h3>Drag and drop files here</h3>
          <p>or</p>
          <FileInputLabel>
            Browse Files
            <FileInput 
              type="file" 
              onChange={handleFileSelect} 
              multiple 
            />
          </FileInputLabel>
          <SupportedFormats>
            Supported formats: JPG, PNG, GIF, PDF, DOCX, XLSX, PPTX
          </SupportedFormats>
        </DropzoneContent>
      </DropZone>
      
      {uploadedFiles.length > 0 && (
        <UploadedFiles>
          <SectionHeader>
            <h2>Selected Files ({uploadedFiles.length})</h2>
            <ClearButton onClick={() => setUploadedFiles([])}>Clear All</ClearButton>
          </SectionHeader>
          
          <FileList>
            {uploadedFiles.map((file, index) => (
              <FileItem key={index}>
                <FileIcon>📄</FileIcon>
                <FileDetails>
                  <FileName>{file.name}</FileName>
                  <FileSize>{(file.size / 1024 / 1024).toFixed(2)} MB</FileSize>
                </FileDetails>
                <RemoveButton 
                  onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                >
                  ✕
                </RemoveButton>
              </FileItem>
            ))}
          </FileList>
          
          <UploadButton>Upload {uploadedFiles.length} Files</UploadButton>
        </UploadedFiles>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
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

const DropZone = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${({ theme, isDragging }) => 
    isDragging ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme, isDragging }) => 
    isDragging ? theme.colors.primaryLight + '10' : theme.colors.surface};
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FileInputLabel = styled.label`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const SupportedFormats = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UploadedFiles = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
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

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  max-height: 400px;
  overflow-y: auto;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const FileIcon = styled.div`
  font-size: 1.5rem;
  margin-right: ${({ theme }) => theme.spacing[3]};
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  word-break: break-all;
`;

const FileSize = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const UploadButton = styled.button`
  width: 100%;
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

export default AdminUploadPage;