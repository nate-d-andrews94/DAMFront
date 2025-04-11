import React from 'react';
import styled, { css } from 'styled-components';

export type CardVariant = 'default' | 'outlined' | 'elevated';

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className,
  onClick,
  interactive = false,
}) => {
  return (
    <StyledCard
      variant={variant}
      className={className}
      onClick={onClick}
      interactive={interactive}
    >
      {children}
    </StyledCard>
  );
};

const variantStyles = {
  default: css`
    background-color: ${({ theme }) => theme.colors.surface};
    border: none;
  `,
  outlined: css`
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
  `,
  elevated: css`
    background-color: ${({ theme }) => theme.colors.background};
    border: none;
    box-shadow: ${({ theme }) => theme.shadows.md};
  `,
};

const StyledCard = styled.div<{ variant: CardVariant; interactive: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  ${({ variant }) => variantStyles[variant]}
  
  ${({ interactive, theme }) =>
    interactive &&
    css`
      cursor: pointer;
      transition: transform ${theme.transitions.fast},
        box-shadow ${theme.transitions.fast};
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.lg};
      }
      
      &:active {
        transform: translateY(0);
      }
    `}
`;

export default Card;