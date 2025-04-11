import React from 'react';
import styled from 'styled-components';
import Button from '@/components/ui/Button';
import { FiX } from 'react-icons/fi';

export interface MetadataField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'tags';
}

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fields: MetadataField[];
  onFieldChange: (fieldId: string, value: string) => void;
  onSave: () => void;
}

const MetadataModal: React.FC<MetadataModalProps> = ({
  isOpen,
  onClose,
  fileName,
  fields,
  onFieldChange,
  onSave
}) => {
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
    onClose();
  };
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Edit Metadata</h2>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <FileName>{fileName}</FileName>
          
          <Form onSubmit={handleSubmit}>
            {fields.map(field => (
              <FormGroup key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <TextArea
                    id={field.id}
                    value={field.value}
                    onChange={(e) => onFieldChange(field.id, e.target.value)}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={field.id}
                    type="text"
                    value={field.value}
                    onChange={(e) => onFieldChange(field.id, e.target.value)}
                  />
                )}
              </FormGroup>
            ))}
            
            <ButtonGroup>
              <Button variant="tertiary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndices[50]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  width: 32px;
  height: 32px;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const FileName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  word-break: break-all;
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

const TextArea = styled.textarea`
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

export default MetadataModal;