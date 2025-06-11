import React, { useState, useEffect } from 'react';
import { PREDEFINED_LABELS } from '../types';
import { IoClose } from 'react-icons/io5';
import styled from '@emotion/styled';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const LabelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelItem = styled.div<{ color: string; selected: boolean }>`
  padding: 5px 10px;
  border-radius: 6px;
  background-color: ${props => props.color}10;
  border: 2px solid ${props => props.selected ? props.color : 'transparent'};
  color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: ${props => props.color}20;
  }

  &::after {
    content: '${props => props.selected ? '✓' : ''}';
    font-weight: bold;
  }
`;

interface LabelModalProps {
  selectedLabels: string[];
  onLabelsChange: (labels: string[]) => void;
  onClose: () => void;
  taskTitle: string;
}

export const LabelModal: React.FC<LabelModalProps> = ({
  selectedLabels,
  onLabelsChange,
  onClose,
  taskTitle
}) => {
  const [currentLabels, setCurrentLabels] = useState<string[]>(selectedLabels);

  useEffect(() => {
    setCurrentLabels(selectedLabels);
  }, [selectedLabels]);

  const toggleLabel = (labelId: string) => {
    const newLabels = currentLabels.includes(labelId)
      ? currentLabels.filter(id => id !== labelId)
      : [...currentLabels, labelId];
    setCurrentLabels(newLabels);
    onLabelsChange(newLabels);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Labels for "{taskTitle}"</ModalTitle>
          <CloseButton onClick={onClose}>
            <IoClose size={24} />
          </CloseButton>
        </ModalHeader>
        <LabelList>
          {PREDEFINED_LABELS.map(label => (
            <LabelItem
              key={label.id}
              color={label.color}
              selected={currentLabels.includes(label.id)}
              onClick={() => toggleLabel(label.id)}
            >
              {label.name}
            </LabelItem>
          ))}
        </LabelList>
      </ModalContent>
    </ModalOverlay>
  );
}; 