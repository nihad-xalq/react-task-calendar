import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek, parseISO, isFirstDayOfMonth, isLastDayOfMonth } from 'date-fns';
import type { DroppableProvided, DraggableProvided, DraggableStateSnapshot, DropResult } from 'react-beautiful-dnd';
import type { Task, Holiday, CalendarCell as CalendarCellType, Label } from '../types';
import { IoChevronBack, IoChevronForward, IoSearch, IoClose, IoTrash, IoAdd, IoPencil } from 'react-icons/io5';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CountrySelector } from './CountrySelector';
import React, { useState, useEffect } from 'react';
import * as S from '../styles/Calendar.styled';
import { TaskEditor } from './TaskEditor';
import { LabelModal } from './LabelModal';
import { TaskLabels } from './TaskLabels';
import { api } from '../services/api';
import styled from '@emotion/styled';
import { PREDEFINED_LABELS } from '../types';

const SearchIconSvg = () => <IoSearch size={20} />;
const ClearIconSvg = () => <IoClose size={20} />;

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const NavButton = styled.button`
  background: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #1565c0;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MonthTitle = styled.h2`
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
`;

interface Country {
  countryCode: string;
  name: string;
}

interface ContextMenuPosition {
  x: number;
  y: number;
  taskId: string;
  cellDate: string;
}

const highlightSearchText = (text: string, searchQuery: string) => {
  if (!searchQuery) return text;
  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === searchQuery.toLowerCase()
      ? <mark key={i}>{part}</mark>
      : part
  );
};

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cells, setCells] = useState<CalendarCellType[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [labelModalTask, setLabelModalTask] = useState<Task | null>(null);
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [highlightedResult, setHighlightedResult] = useState<number>(-1);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [highlightedCell, setHighlightedCell] = useState<string | null>(null);

  // Fetch available countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await api.getAvailableCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch holidays when month or country changes
  useEffect(() => {
    const fetchHolidays = async () => {
      setIsLoadingHolidays(true);
      try {
        const year = currentDate.getFullYear();
        const holidayData = await api.getHolidays(year, selectedCountry);
        setHolidays(holidayData);
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
        setHolidays([]);
      } finally {
        setIsLoadingHolidays(false);
      }
    };

    fetchHolidays();
  }, [currentDate, selectedCountry]);

  // Add useEffect to handle clicking outside context menu
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  useEffect(() => {
    // Get the first day of the current month
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Create new cells using allTasks instead of previous cells
    setCells(allDays.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date,
        tasks: allTasks.filter(task => task.date === dateStr),
        holidays: [],
        isCurrentMonth: format(date, 'M') === format(currentDate, 'M')
      };
    }));
  }, [currentDate, allTasks]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);

    if (!result.destination) return;

    const { source, destination } = result;

    setAllTasks(prev => {
      const taskToMove = prev.find(task =>
        task.date === source.droppableId &&
        prev.filter(t => t.date === source.droppableId)[source.index].id === task.id
      );

      if (!taskToMove) return prev;

      // Remove task from its original position
      const tasksWithoutMoved = prev.filter(task => task.id !== taskToMove.id);

      // Create updated task with new date and order
      const updatedTask = {
        ...taskToMove,
        date: destination.droppableId,
      };

      // Insert the task at the new position
      const finalTasks = [...tasksWithoutMoved];
      finalTasks.splice(
        finalTasks.indexOf(finalTasks[destination.index] || finalTasks[finalTasks.length - 1]) + 1 || finalTasks.length,
        0,
        updatedTask
      );

      return finalTasks;
    });
  };

  const addTask = (date: Date, e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Task',
      date: dateStr,
      order: allTasks.filter(t => t.date === dateStr).length,
      labels: [],
      isLabelsMinimized: true
    };

    setAllTasks(prev => [...prev, newTask]);
    setEditingTask(newTask.id);
  };

  const updateTask = (taskId: string, newTitle: string) => {
    setAllTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, title: newTitle } : task
    ));
    setEditingTask(null);
  };

  const updateTaskLabels = (taskId: string, labels: string[]) => {
    setAllTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, labels } : task
    ));
  };

  const updateTaskLabelMinimized = (taskId: string, isMinimized: boolean) => {
    setAllTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, isLabelsMinimized: isMinimized } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setAllTasks(prev => prev.filter(task => task.id !== taskId));
    setEditingTask(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const filterTasks = (tasks: Task[]) => {
    if (!searchTerm) return tasks;
    const searchLower = searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchLower) ||
      task.labels.some(labelId => {
        const label = PREDEFINED_LABELS.find(l => l.id === labelId);
        return label?.name.toLowerCase().includes(searchLower);
      })
    );
  };

  useEffect(() => {
    if (searchTerm) {
      const results = allTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.labels.some(labelId => {
          const label = PREDEFINED_LABELS.find(l => l.id === labelId);
          return label?.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
      setSearchResults(results);
      setShowSearchDropdown(true);
      setHighlightedResult(-1);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchTerm, allTasks]);

  const handleSearchItemClick = (task: Task) => {
    const taskDate = parseISO(task.date);
    setCurrentDate(taskDate);
    setShowSearchDropdown(false);
    setHighlightedCell(task.date);

    // Remove highlight after animation
    setTimeout(() => {
      setHighlightedCell(null);
    }, 2000);

    // Scroll to the task
    const cells = document.querySelectorAll(`[data-task-id="${task.id}"]`);
    cells[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedResult(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedResult(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedResult >= 0 && searchResults[highlightedResult]) {
          handleSearchItemClick(searchResults[highlightedResult]);
        }
        break;
      case 'Escape':
        setShowSearchDropdown(false);
        break;
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleContextMenu = (e: React.MouseEvent, taskId: string, cellDate: string) => {
    e.preventDefault();
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    // Don't show context menu on right click for mobile
    if (window.innerWidth <= 480 && e.type === 'contextmenu') {
      return;
    }

    setContextMenu({
      x: window.innerWidth <= 480 ? 0 : e.clientX,
      y: window.innerWidth <= 480 ? 0 : e.clientY,
      taskId,
      cellDate
    });
  };

  const handleTaskClick = (e: React.MouseEvent, taskId: string, cellDate: string) => {
    // For mobile, show menu on regular click
    if (window.innerWidth <= 480) {
      e.preventDefault();
      e.stopPropagation();
      const task = allTasks.find(t => t.id === taskId);
      if (!task) return;

      setContextMenu({
        x: 0,
        y: 0,
        taskId,
        cellDate
      });
    }
  };

  return (
    <div>
      <S.ControlsContainer>
        <CountrySelector
          countries={countries}
          selectedCountry={selectedCountry}
          onSelect={handleCountryChange}
        />

        <div style={{ position: 'relative' }}>
          <S.SearchContainer>
            <S.SearchIcon>
              <SearchIconSvg />
            </S.SearchIcon>
            <S.SearchBar
              type="text"
              id="task-search"
              name="task-search"
              placeholder="Search tasks or labels..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            {searchTerm && (
              <>
                <S.ClearButton onClick={clearSearch} title="Clear search">
                  <ClearIconSvg />
                </S.ClearButton>
                <S.SearchResultsCount>
                  Found: <span>{searchResults.length}</span>
                </S.SearchResultsCount>
              </>
            )}
          </S.SearchContainer>

          <S.SearchResultsDropdown isVisible={showSearchDropdown && searchResults.length > 0}>
            {searchResults.map((task, index) => (
              <S.SearchResultItem
                key={task.id}
                isHighlighted={index === highlightedResult}
                onClick={() => handleSearchItemClick(task)}
              >
                <div className="date">{format(parseISO(task.date), 'MMM d, yyyy')}</div>
                <div className="title">
                  {highlightSearchText(task.title, searchTerm)}
                </div>
                <div className="labels">
                  {task.labels.map(labelId => {
                    const label = PREDEFINED_LABELS.find(l => l.id === labelId);
                    if (!label) return null;
                    return (
                      <S.SearchLabel
                        key={label.id}
                        color={label.color}
                        title={label.name}
                      />
                    );
                  })}
                </div>
              </S.SearchResultItem>
            ))}
          </S.SearchResultsDropdown>
        </div>
      </S.ControlsContainer>

      <S.TopControls>
        <S.NavButton onClick={handlePrevMonth}>
          <IoChevronBack />
          <span>Previous</span>
        </S.NavButton>
        <S.MonthTitle>{format(currentDate, 'MMMM yyyy')}</S.MonthTitle>
        <S.NavButton onClick={handleNextMonth}>
          <span>Next</span>
          <IoChevronForward />
        </S.NavButton>
      </S.TopControls>

      <S.CalendarHeader>
        {DAYS_OF_WEEK.map(day => (
          <div key={day}>{day}</div>
        ))}
      </S.CalendarHeader>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <S.CalendarGrid>
          {cells.map(cell => {
            const cellId = format(cell.date, 'yyyy-MM-dd');
            const cellHolidays = holidays.filter(h => h.date === cellId);
            const isFirstDay = isFirstDayOfMonth(cell.date);
            const isLastDay = isLastDayOfMonth(cell.date);

            return (
              <S.CalendarCell
                key={cellId}
                isCurrentMonth={cell.isCurrentMonth}
                isHighlighted={cellId === highlightedCell}
                onClick={(e) => {
                  // Only add task on click for non-mobile devices
                  if (window.innerWidth > 480) {
                    addTask(cell.date, e);
                  }
                }}
              >
                <S.DateHeader hasHolidays={cellHolidays.length > 0}>
                  <S.DateText>
                    <S.WeekDay>{format(cell.date, 'EEE')}</S.WeekDay>
                    <S.DateNumber>
                      {format(cell.date, 'd')}
                      {(isFirstDay || isLastDay) && (
                        <S.MonthAbbr>{format(cell.date, 'MMM')}</S.MonthAbbr>
                      )}
                    </S.DateNumber>
                  </S.DateText>
                  {cell.tasks.length > 0 && (
                    <S.TaskCount>({cell.tasks.length} tasks)</S.TaskCount>
                  )}
                  <S.AddTaskButton
                    onClick={(e) => {
                      e.stopPropagation();
                      addTask(cell.date, e);
                    }}
                    title="Add new task"
                  >
                    <IoAdd />
                  </S.AddTaskButton>
                </S.DateHeader>

                <S.HolidayContainer>
                  {isLoadingHolidays ? (
                    <S.Holiday>Loading holidays...</S.Holiday>
                  ) : (
                    cellHolidays.map(holiday => (
                      <S.Holiday key={holiday.name} title={`Holiday in ${countries.find(c => c.countryCode === holiday.countryCode)?.name || holiday.countryCode}`}>
                        {holiday.name}
                      </S.Holiday>
                    ))
                  )}
                </S.HolidayContainer>

                <Droppable droppableId={cellId}>
                  {(provided: DroppableProvided) => (
                    <S.TaskList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {filterTasks(cell.tasks).map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                            <S.Task
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                              isSearchMatch={Boolean(searchTerm && task.title.toLowerCase().includes(searchTerm.toLowerCase()))}
                              onContextMenu={(e) => handleContextMenu(e, task.id, cellId)}
                              onClick={(e) => handleTaskClick(e, task.id, cellId)}
                            >
                              <TaskLabels
                                selectedLabels={task.labels || []}
                                isMinimized={task.isLabelsMinimized}
                                onMinimizedChange={(isMinimized) => updateTaskLabelMinimized(task.id, isMinimized)}
                              />
                              {editingTask === task.id ? (
                                <TaskEditor
                                  initialValue={task.title}
                                  onSave={(value) => updateTask(task.id, value)}
                                  onCancel={() => setEditingTask(null)}
                                  taskId={task.id}
                                />
                              ) : (
                                <div
                                  onClick={(e) => {
                                    if (window.innerWidth > 480) {
                                      e.stopPropagation();
                                      setEditingTask(task.id);
                                    }
                                  }}
                                  style={{ width: '100%' }}
                                >
                                  {searchTerm ? highlightSearchText(task.title, searchTerm) : task.title}
                                </div>
                              )}
                            </S.Task>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </S.TaskList>
                  )}
                </Droppable>
              </S.CalendarCell>
            );
          })}
        </S.CalendarGrid>
      </DragDropContext>

      {contextMenu && (
        <>
        <S.ContextMenuOverlay onClick={() => setContextMenu(null)} />
        <S.ContextMenu
          style={{
            top: contextMenu.y,
            left: contextMenu.x
          }}
        >
          <S.ContextMenuItem
            onClick={() => {
              setEditingTask(contextMenu.taskId);
              setContextMenu(null);
            }}
          >
            <IoPencil />
            Edit Task
          </S.ContextMenuItem>
          <S.ContextMenuItem
            onClick={() => {
              const task = allTasks.find(t => t.id === contextMenu.taskId);
              if (task) {
                setLabelModalTask(task);
              }
              setContextMenu(null);
            }}
          >
            <IoAdd />
            Set Labels
          </S.ContextMenuItem>
          <S.ContextMenuItem
            isDestructive
            onClick={() => {
              deleteTask(contextMenu.taskId);
              setContextMenu(null);
            }}
          >
            <IoTrash />
            Delete Task
          </S.ContextMenuItem>
        </S.ContextMenu>
        </>
      )}

      {labelModalTask && (
        <LabelModal
          selectedLabels={labelModalTask.labels || []}
          onLabelsChange={(labels) => {
            updateTaskLabels(labelModalTask.id, labels);
          }}
          onClose={() => setLabelModalTask(null)}
          taskTitle={labelModalTask.title}
        />
      )}
    </div>
  );
}; 