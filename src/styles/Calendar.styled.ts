import styled from '@emotion/styled';

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 16px;

  @media (max-width: 768px) {
    gap: 8px;
    padding: 8px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 8px 4px;
  }
`;

export const CalendarCell = styled.div<{ isCurrentMonth: boolean; isHighlighted?: boolean }>`
  min-height: 140px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${props => {
    if (props.isHighlighted) return '#e3f2fd';
    return props.isCurrentMonth ? 'white' : '#f8f9fa';
  }};
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${props => 
    props.isHighlighted 
      ? '0 0 0 2px #1976d2'
      : props.isCurrentMonth 
        ? '0 2px 4px rgba(0,0,0,0.05)'
        : 'none'
  };

  @media (max-width: 768px) {
    min-height: 120px;
    padding: 8px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    ${props => !props.isCurrentMonth && `
      display: none;
    `}
    min-height: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  ${props => props.isHighlighted && `
    animation: pulse 2s;
  `}

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(25, 118, 210, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
    }
  }

  &:hover {
    background-color: ${props => props.isHighlighted ? '#bbdefb' : '#f5f5f5'};
    transform: translateY(-1px);
    box-shadow: ${props =>
    props.isHighlighted
      ? '0 0 0 2px #1976d2, 0 4px 8px rgba(0,0,0,0.1)'
      : '0 4px 8px rgba(0,0,0,0.1)'
  };
  }
`;

export const MonthTitle = styled.h2`
  margin: 0;
  color: #1976d2;
  min-width: 200px;
  text-align: center;
  padding: 5px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: -0.5px;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const DateHeader = styled.div<{ hasHolidays?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    margin-bottom: 0;
    padding-bottom: 8px;
    border-bottom: ${props => props.hasHolidays ? '0' : '1px solid #edf2f7'};
  }
`;

export const DateText = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;

  @media (max-width: 480px) {
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
`;

export const WeekDay = styled.span`
  display: none;

  @media (max-width: 480px) {
    display: block;
    font-size: 0.75rem;
    color: #9e9e9e;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const DateNumber = styled.div`
  display: flex;
  align-items: center;
`;

export const MonthAbbr = styled.span`
  margin-left: 4px;
  color: #757575;
  font-size: 0.85em;

  @media (max-width: 480px) {
    margin-left: 4px;
    font-size: 0.9em;
    font-weight: 500;
  }
`;

export const TaskCount = styled.span`
  color: rgb(175, 181, 187);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  min-width: 16px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 2px 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 1px 4px;
  }
`;

export const HolidayContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 480px) {
    margin-top: -4px;
    margin-bottom: 8px;
  }
`;

export const Holiday = styled.div`
  font-size: 0.85rem;
  color: #d32f2f;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    color: #ef5350;
    padding: 4px 8px;
    background: #ffebee;
    border-radius: 4px;
    display: inline-block;
    max-width: 100%;
  }
`;

export const TaskList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding: 4px;
  margin: -4px;
  min-height: 0;

  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;
    margin: 0;
    overflow: visible;
  }
`;

export const Task = styled.div<{ isDragging?: boolean; isSearchMatch?: boolean }>`
  background-color: ${props => {
    if (props.isSearchMatch) return '#fffaf0';
    return props.isDragging ? '#ebf8ff' : '#fff';
  }};
  padding: 10px;
  border-radius: 8px;
  cursor: move;
  font-size: 0.9rem;
  line-height: 1.4;
  min-height: 34px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  letter-spacing: -0.1px;
  box-shadow: ${props => {
    if (props.isSearchMatch) return '0 2px 4px rgba(237, 137, 54, 0.1)';
    return props.isDragging
      ? '0 8px 16px rgba(0,0,0,0.1)'
      : '0 1px 3px rgba(0,0,0,0.05)';
  }};
  transition: all 0.2s ease;
  white-space: normal;
  overflow: hidden;
  word-break: break-word;
  position: relative;
  border-left: ${props => props.isSearchMatch ? '3px solid #ed8936' : 'none'};
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 480px) {
    padding: 8px 10px;
    margin: 0;
  }

  &:hover {
    background-color: ${props => props.isSearchMatch ? '#feebc8' : '#f7fafc'};
    transform: translateY(-1px);
    box-shadow: ${props => {
    if (props.isSearchMatch) return '0 4px 6px rgba(237, 137, 54, 0.15)';
    return '0 4px 6px rgba(0,0,0,0.07)';
  }};
  }

  mark {
    background-color: #fbd38d;
    padding: 0 2px;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.85rem;
  }
`;

export const CalendarHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #424242;

  @media (max-width: 768px) {
    gap: 8px;
    padding: 0 8px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    display: none;
  }

  > div {
    text-align: center;
    padding: 8px;

    @media (max-width: 480px) {
      padding: 4px;
    }
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SearchResultsCount = styled.div`
  position: absolute;
  left: 5px;
  bottom: -22px;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: #1976d2;
    font-weight: 600;
  }
`;

export const SearchResultsDropdown = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.isVisible ? 'block' : 'none'};

  @media (max-width: 768px) {
    max-height: 250px;
  }
`;

export const SearchResultItem = styled.div<{ isHighlighted: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.isHighlighted ? '#f5f5f5' : 'transparent'};

  &:hover {
    background: #f5f5f5;
  }

  .date {
    color: #666;
    font-size: 12px;
    min-width: 95px;
  }

  .title {
    flex: 1;
    
    mark {
      background-color: #fff3e0;
      padding: 2px 4px;
      border-radius: 2px;
    }
  }

  .labels {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }
`;

export const SearchLabel = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
  opacity: 0.8;
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #757575;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    color: #1976d2;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

export const ControlsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 16px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
    padding: 0 8px;
  }

  @media (max-width: 480px) {
    padding: 0 4px;
    margin-bottom: 12px;
  }
`;

export const ContextMenu = styled.div`
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  overflow: hidden;
  min-width: 180px;

  @media (max-width: 480px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 16px 16px 0 0;
    min-width: auto;
    padding: 8px 0;
  }
`;

export const ContextMenuItem = styled.div<{ isDestructive?: boolean }>`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.isDestructive ? '#e53e3e' : '#333'};
  transition: all 0.2s;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: ${props => props.isDestructive ? '#fff5f5' : '#f5f5f5'};
  }

  @media (max-width: 480px) {
    padding: 16px;
    font-size: 16px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const ContextMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

export const SearchBar = styled.input`
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  transition: all 0.2s;
  background-color: #f5f5f5;
  color: black;
  letter-spacing: -0.2px;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }

  &::placeholder {
    color: #9e9e9e;
    font-weight: 400;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #757575;
`;

export const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #1976d2;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  @media (max-width: 480px) {
    padding: 8px;
    
    span {
      display: none;
    }
  }

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const AddTaskButton = styled.button`
  display: none;
  
  @media (max-width: 480px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #1976d2;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    margin-left: auto;

    &:hover {
      background: #1565c0;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`; 