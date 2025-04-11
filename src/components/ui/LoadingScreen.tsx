import React from 'react';
import styled from 'styled-components';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

/**
 * Loading screen component
 * Can be displayed as a full-screen overlay or within a container
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...', 
  fullScreen = true 
}) => {
  return (
    <LoadingContainer fullScreen={fullScreen}>
      <Spinner />
      <LoadingMessage>{message}</LoadingMessage>
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div<{ fullScreen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${({ fullScreen }) => fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  `}
  ${({ fullScreen, theme }) => !fullScreen && `
    min-height: 300px;
    padding: ${theme.spacing[8]};
  `}
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: spin 1s ease-in-out infinite;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

export default LoadingScreen;