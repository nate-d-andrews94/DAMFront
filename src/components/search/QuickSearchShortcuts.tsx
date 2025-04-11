import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';

// Shortcut interface
interface SearchShortcut {
  id: string;
  name: string;
  icon: string;
  field: string;
  operator: string;
  value: string;
  count?: number;
}

// Default shortcuts
const defaultShortcuts: SearchShortcut[] = [
  {
    id: 'recent',
    name: 'Recent Uploads',
    icon: '🕒',
    field: 'uploadedAt',
    operator: 'after',
    value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    count: 12
  },
  {
    id: 'images',
    name: 'Images',
    icon: '🖼️',
    field: 'type',
    operator: 'equals',
    value: 'image',
    count: 35
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: '📄',
    field: 'type',
    operator: 'equals',
    value: 'document',
    count: 25
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: '🎬',
    field: 'type',
    operator: 'equals',
    value: 'video',
    count: 8
  },
  {
    id: 'large',
    name: 'Large Files',
    icon: '📦',
    field: 'size',
    operator: 'greater',
    value: '10000000', // 10MB
    count: 15
  }
];

interface QuickSearchShortcutsProps {
  shortcuts?: SearchShortcut[];
  className?: string;
}

/**
 * Component that displays quick search shortcuts
 */
const QuickSearchShortcuts: React.FC<QuickSearchShortcutsProps> = ({ 
  shortcuts = defaultShortcuts,
  className
}) => {
  const navigate = useNavigate();
  
  // Handle shortcut click
  const handleShortcutClick = (shortcut: SearchShortcut) => {
    navigate(`/search?field=${encodeURIComponent(shortcut.field)}&operator=${encodeURIComponent(shortcut.operator)}&value=${encodeURIComponent(shortcut.value)}`);
  };
  
  return (
    <Container className={className}>
      <Title>Quick Searches</Title>
      
      <ShortcutsGrid>
        {shortcuts.map(shortcut => (
          <ShortcutCard key={shortcut.id} onClick={() => handleShortcutClick(shortcut)}>
            <ShortcutIcon>{shortcut.icon}</ShortcutIcon>
            <ShortcutName>{shortcut.name}</ShortcutName>
            {shortcut.count !== undefined && (
              <ShortcutCount>{shortcut.count}</ShortcutCount>
            )}
          </ShortcutCard>
        ))}
      </ShortcutsGrid>
    </Container>
  );
};

const Container = styled(Card)`
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ShortcutsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ShortcutCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ShortcutIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ShortcutName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-align: center;
`;

const ShortcutCount = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default QuickSearchShortcuts;