import React from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: React.ElementType;
  to?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || isLoading}
        {...rest}
      >
        {isLoading && <Spinner />}
        {!isLoading && leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
        <span>{children}</span>
        {!isLoading && rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

const sizeStyles = {
  small: css`
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  `,
  medium: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  `,
  large: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  `,
};

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
    
    &:focus-visible {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryLight + '20'};
    }
    
    &:focus-visible {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
    }
  `,
  tertiary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.border + '50'};
    }
    
    &:focus-visible {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.border};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.error};
    color: white;
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => '#d32f2f'};
    }
    
    &:focus-visible {
      box-shadow: 0 0 0 2px ${({ theme }) => '#ef5350'};
    }
  `,
};

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  gap: ${({ theme }) => theme.spacing[2]};
  
  /* Apply size styles */
  ${({ size }) => sizeStyles[size]}
  
  /* Apply variant styles */
  ${({ variant }) => variantStyles[variant]}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.2em;
`;

const Spinner = styled.span`
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: ${({ theme }) => theme.spacing[2]};
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Button;