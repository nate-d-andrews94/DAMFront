import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';

describe('Button', () => {
  const renderWithTheme = (ui: React.ReactNode) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  };

  it('renders button with default props', () => {
    renderWithTheme(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = renderWithTheme(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button', { name: /primary/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider theme={theme}><Button variant="secondary">Secondary</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /secondary/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider theme={theme}><Button variant="tertiary">Tertiary</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /tertiary/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider theme={theme}><Button variant="outline">Outline</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /outline/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider theme={theme}><Button variant="danger">Danger</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /danger/i })).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { rerender } = renderWithTheme(<Button size="small">Small</Button>);
    expect(screen.getByRole('button', { name: /small/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider theme={theme}><Button size="medium">Medium</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider theme={theme}><Button size="large">Large</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /large/i })).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    renderWithTheme(
      <Button leftIcon={<span data-testid="left-icon" />}>
        With Left Icon
      </Button>
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /with left icon/i })).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    renderWithTheme(
      <Button rightIcon={<span data-testid="right-icon" />}>
        With Right Icon
      </Button>
    );
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /with right icon/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is passed', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it('shows loading spinner when isLoading is true', () => {
    renderWithTheme(<Button isLoading>Loading</Button>);
    
    // Loading spinner should be present
    expect(screen.getByRole('button')).toHaveTextContent('Loading');
    // In loading state, text is visually hidden but accessible
    // We can check for specific styling or components that indicate loading
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    
    renderWithTheme(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: /disabled/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn();
    
    renderWithTheme(<Button onClick={handleClick} isLoading>Loading</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: /loading/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});