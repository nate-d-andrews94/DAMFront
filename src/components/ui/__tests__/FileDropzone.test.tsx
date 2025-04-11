import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FileDropzone from '../FileDropzone';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';

// Much simpler mock for react-dropzone
vi.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  })
}));

describe('FileDropzone', () => {
  const renderWithTheme = (ui: React.ReactNode) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  };

  it('renders correctly with default props', () => {
    const onFilesAdded = vi.fn();
    renderWithTheme(<FileDropzone onFilesAdded={onFilesAdded} />);
    
    expect(screen.getByText('Drag and drop files here')).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
    expect(screen.getByText('Browse Files')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    const onFilesAdded = vi.fn();
    renderWithTheme(
      <FileDropzone 
        onFilesAdded={onFilesAdded} 
        label="Custom upload label" 
      />
    );
    
    expect(screen.getByText('Custom upload label')).toBeInTheDocument();
  });

  it('renders with supportedFormatsText', () => {
    const onFilesAdded = vi.fn();
    renderWithTheme(
      <FileDropzone 
        onFilesAdded={onFilesAdded} 
        supportedFormatsText="JPG, PNG only" 
      />
    );
    
    expect(screen.getByText('JPG, PNG only')).toBeInTheDocument();
  });

  it('renders disabled state correctly', () => {
    const onFilesAdded = vi.fn();
    renderWithTheme(
      <FileDropzone 
        onFilesAdded={onFilesAdded}
        disabled
      />
    );
    
    // In disabled state, the browse button shouldn't be visible
    expect(screen.queryByText('Browse Files')).not.toBeInTheDocument();
  });
});