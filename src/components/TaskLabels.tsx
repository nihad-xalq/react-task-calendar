import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import type { Label } from '../types';
import { PREDEFINED_LABELS } from '../types';

const LabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
`;

const LabelChip = styled.div<{ color: string; isMinimized: boolean }>`
  padding: ${props => props.isMinimized ? '4px' : '2px'};
  width: ${props => props.isMinimized ? '35px' : 'auto'};
  height: ${props => props.isMinimized ? '3px' : 'auto'};
  min-height: ${props => props.isMinimized ? '3px' : '20px'};
  border-radius: ${props => props.isMinimized ? '6px' : '3px'};
  font-size: 12px;
  background-color: ${props => props.color};
  color: white;
  opacity: 0.8;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  transition: all 0.2s ease;

  ${props => !props.isMinimized && `
    padding: 2px 8px;
  `}

  &:hover {
    opacity: 1;
  }

  span {
    display: inline-block;
    transform-origin: left;
    transform: scaleX(${props => props.isMinimized ? 0 : 1});
    transition: transform 0.2s ease;
    max-width: ${props => props.isMinimized ? '0' : '200px'};
    visibility: ${props => props.isMinimized ? 'hidden' : 'visible'};
  }
`;

interface TaskLabelsProps {
  selectedLabels: string[];
  isMinimized: boolean;
  onMinimizedChange: (isMinimized: boolean) => void;
}

export const TaskLabels: React.FC<TaskLabelsProps> = ({
  selectedLabels,
  isMinimized,
  onMinimizedChange
}) => {
  const [prevLabelCount, setPrevLabelCount] = useState(selectedLabels.length);

  useEffect(() => {
    // Only auto-minimize when labels are added and count becomes more than 2
    if (selectedLabels.length > 2 && selectedLabels.length > prevLabelCount) {
      onMinimizedChange(true);
    }
    setPrevLabelCount(selectedLabels.length);
  }, [selectedLabels.length, prevLabelCount, onMinimizedChange]);

  if (selectedLabels.length === 0) {
    return null;
  }

  const toggleMinimize = (e: React.MouseEvent) => {
    if (e.button === 0) {
      e.stopPropagation();
      onMinimizedChange(!isMinimized);
    }
  };

  return (
    <LabelsContainer onClick={toggleMinimize}>
      {selectedLabels.map(labelId => {
        const label = PREDEFINED_LABELS.find(l => l.id === labelId);
        if (!label) return null;
        return (
          <LabelChip
            key={label.id}
            color={label.color}
            isMinimized={isMinimized}
            title={label.name}
          >
            <span>{label.name}</span>
          </LabelChip>
        );
      })}
    </LabelsContainer>
  );
}; 