export interface Task {
  id: string;
  title: string;
  date: string;
  order: number;
  labels: string[];
  isLabelsMinimized: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Holiday {
  date: string;
  name: string;
  countryCode: string;
}

export interface CalendarCell {
  date: Date;
  tasks: Task[];
  holidays: Holiday[];
  isCurrentMonth: boolean;
}

export interface DragItem {
  id: string;
  date: string;
  index: number;
}

export interface DragEndResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
}

// Predefined labels
export const PREDEFINED_LABELS: Label[] = [
  { id: 'design', name: 'Design', color: '#ff9800' },  // Orange
  { id: 'urgent', name: 'Urgent', color: '#f44336' },  // Red
  { id: 'feature', name: 'Feature', color: '#4caf50' },  // Green
  { id: 'bug', name: 'Bug', color: '#e91e63' },  // Pink
  { id: 'documentation', name: 'Documentation', color: '#795548' },  // Brown
  { id: 'in-progress', name: 'In Progress', color: '#2196f3' },  // Blue
  { id: 'blocked', name: 'Blocked', color: '#9c27b0' },  // Purple
  { id: 'review', name: 'Review', color: '#009688' },  // Teal
  { id: 'testing', name: 'Testing', color: '#ffd700' },  // Gold
  { id: 'low-priority', name: 'Low Priority', color: '#9e9e9e' },  // Gray
  { id: 'high-priority', name: 'High Priority', color: '#ff5722' },  // Deep Orange
  { id: 'discussion', name: 'Discussion', color: '#3f51b5' },  // Indigo
]; 