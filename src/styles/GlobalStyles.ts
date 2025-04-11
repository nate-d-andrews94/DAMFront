import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
  }

  button {
    cursor: pointer;
  }

  img, svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  /* Focus styles for accessibility */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;