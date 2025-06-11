import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const Input = styled.input`
  width: 100%;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  color: #333;
  outline: none;

  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: 16px; /* Prevent zoom on mobile */
  }

  &:focus {
    // border-color: #1565c0;
    // box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    outline: none;
    padding: 2px 4px;

    @media (max-width: 768px) {
      padding: 4px 6px;
    }
  }
`;

interface TaskEditorProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  taskId: string;
}

export const TaskEditor: React.FC<TaskEditorProps> = ({
  initialValue,
  onSave,
  onCancel,
  taskId
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(value);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
    onCancel();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
      id={`task-input-${taskId}`}
      name={`task-input-${taskId}`}
      aria-label="Edit task title"
    />
  );
}; 