import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  children?: React.ReactNode;
  label?: string;
  supportedFormatsText?: string;
  disabled?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesAdded,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept,
  children,
  label = 'Drag and drop files here',
  supportedFormatsText,
  disabled = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );
  
  const onDropRejected = useCallback(
    (fileRejections: any[]) => {
      const rejection = fileRejections[0];
      const error = rejection?.errors?.[0];
      
      if (error?.code === 'file-too-large') {
        setError(`File is too large. Max size is ${(maxSize / 1024 / 1024).toFixed(0)}MB.`);
      } else if (error?.code === 'file-invalid-type') {
        setError('File type not supported.');
      } else if (error?.code === 'too-many-files') {
        setError(`Too many files. Max ${maxFiles} files allowed.`);
      } else {
        setError('Error uploading file. Please try again.');
      }
    },
    [maxFiles, maxSize]
  );
  
  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    onDropRejected,
    maxFiles,
    maxSize,
    accept,
    disabled,
    noClick: !!children,
    noKeyboard: !!children,
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);
  
  return (
    <DropzoneContainer>
      <DropzoneArea
        {...getRootProps()}
        isDragActive={isDragActive}
        isDragReject={!!error}
        disabled={disabled}
      >
        <input {...getInputProps()} />
        
        {children || (
          <DropzoneContent>
            <UploadIcon>📂</UploadIcon>
            <DropzoneLabel>{label}</DropzoneLabel>
            {!isDragActive && <OrText>or</OrText>}
            {!isDragActive && !disabled && <BrowseButton>Browse Files</BrowseButton>}
            {supportedFormatsText && <SupportedFormats>{supportedFormatsText}</SupportedFormats>}
          </DropzoneContent>
        )}
      </DropzoneArea>
      
      {error && <ErrorText>{error}</ErrorText>}
    </DropzoneContainer>
  );
};

const DropzoneContainer = styled.div`
  width: 100%;
`;

const DropzoneArea = styled.div<{
  isDragActive: boolean;
  isDragReject: boolean;
  disabled: boolean;
}>`
  border: 2px dashed
    ${({ theme, isDragActive, isDragReject, disabled }) => {
      if (disabled) return theme.colors.border;
      if (isDragReject) return theme.colors.error;
      if (isDragActive) return theme.colors.primary;
      return theme.colors.border;
    }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme, isDragActive, isDragReject, disabled }) => {
    if (disabled) return theme.colors.border + '20';
    if (isDragReject) return theme.colors.error + '10';
    if (isDragActive) return theme.colors.primaryLight + '10';
    return theme.colors.surface;
  }};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DropzoneLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const OrText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const BrowseButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const SupportedFormats = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin: 0;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

export default FileDropzone;