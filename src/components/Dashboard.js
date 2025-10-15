import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ru';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiList } from 'react-icons/fi';
import TaskItem from './TaskItem';

// Устанавливаем русскую локаль для moment
moment.locale('ru');

const localizer = momentLocalizer(moment);

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
`;

const DashboardHeader = styled.div`
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
`;

const DashboardTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const DashboardSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const DashboardContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
`;

const CalendarSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CalendarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CalendarTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;

const CalendarContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const CustomCalendar = styled(Calendar)`
  height: 100%;
  
  .rbc-calendar {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .rbc-header {
    background: #4a90e2;
    color: white;
    font-weight: 600;
    padding: 12px 8px;
    border: none;
  }

  .rbc-today {
    background-color: #e3f2fd;
  }

  .rbc-event {
    background: #4a90e2;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    cursor: pointer;
  }

  .rbc-event:hover {
    background: #357abd;
  }

  .rbc-event-content {
    font-weight: 500;
  }

  .rbc-toolbar {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .rbc-toolbar-label {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .rbc-btn-group {
    display: flex;
    gap: 4px;
  }

  .rbc-btn-group button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: white;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 12px;
  }

  .rbc-btn-group button:hover {
    background: #f5f5f5;
  }

  .rbc-btn-group button.rbc-active {
    background: #4a90e2;
    color: white;
    border-color: #4a90e2;
  }

  .rbc-btn-group button:first-child {
    border-radius: 6px 0 0 6px;
  }

  .rbc-btn-group button:last-child {
    border-radius: 0 6px 6px 0;
  }

  .rbc-btn-group button:not(:first-child):not(:last-child) {
    border-radius: 0;
  }
`;

const TasksSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TasksHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TasksTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;

const AddTaskButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #357abd;
  }
`;

const TasksList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 14px;
  line-height: 1.5;
`;



const CustomToolbar = ({ label, onNavigate, onView, currentDate, onDateSelect }) => {


  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => onNavigate('PREV')} style={{ padding: '8px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
          <FiChevronLeft />
        </button>
        
        <button 
          onClick={() => {
            const today = new Date();
            if (onDateSelect) {
              onDateSelect(today);
            }
            onNavigate('TODAY');
          }} 
          style={{ 
            padding: '8px 16px', 
            border: '1px solid #ddd', 
            background: 'white', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#4a90e2',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f0f7ff';
            e.target.style.borderColor = '#4a90e2';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.borderColor = '#ddd';
          }}
        >
          Сегодня
        </button>
        
        <button onClick={() => onNavigate('NEXT')} style={{ padding: '8px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
          <FiChevronRight />
        </button>
      </div>
      
      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>
        {label}
      </h2>
      
      <div style={{ display: 'flex', gap: '4px' }}>
        <button 
          onClick={() => onView('month')} 
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            background: 'white', 
            color: '#666',
            borderRadius: '4px 0 0 4px',
            cursor: 'pointer'
          }}
        >
          Месяц
        </button>
        <button 
          onClick={() => onView('week')} 
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            background: 'white', 
            color: '#666',
            borderRadius: '0',
            cursor: 'pointer'
          }}
        >
          Неделя
        </button>
        <button 
          onClick={() => onView('day')} 
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            background: 'white', 
            color: '#666',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer'
          }}
        >
          День
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ tasks, onTaskSelect, selectedTask, onCreateTask, user }) => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
  };


  // Преобразуем задачи в события для календаря
  const events = tasks.map(task => {
    // Если нет даты начала, используем дату создания
    const startDate = task.startDate ? new Date(task.startDate) : new Date(task.createdAt);
    // Если нет даты окончания, используем дату начала + 1 день
    const dueDate = task.dueDate ? new Date(task.dueDate) : new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    const today = new Date();
    const isOverdue = dueDate < today && task.status === 'active';
    const isDueToday = dueDate.toDateString() === today.toDateString();
    
    return {
      id: task.id,
      title: `${task.title}${isOverdue ? ' (ПРОСРОЧЕНО)' : isDueToday ? ' (СЕГОДНЯ)' : ''}`,
      start: startDate,
      end: dueDate,
      resource: task,
      allDay: true
    };
  });

  const handleSelectEvent = (event) => {
    onTaskSelect(event.resource);
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = slotInfo.start;
    const tasksOnDate = tasks.filter(task => {
      const taskStartDate = task.startDate ? new Date(task.startDate) : new Date(task.createdAt);
      const taskDueDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
      
      // Проверяем, попадает ли выбранная дата в диапазон задачи
      return selectedDate >= taskStartDate && selectedDate <= taskDueDate;
    });

    if (tasksOnDate.length > 0) {
      // Если есть задачи на эту дату, показываем первую
      onTaskSelect(tasksOnDate[0]);
    } else {
      // Если нет задач, создаем новую с выбранной датой
      onCreateTask(selectedDate);
    }
  };

  const eventStyleGetter = (event) => {
    const task = event.resource;
    const startDate = task.startDate ? new Date(task.startDate) : new Date();
    const dueDate = task.dueDate ? new Date(task.dueDate) : new Date();
    const today = new Date();
    const isOverdue = dueDate < today && task.status === 'active';
    const isDueToday = dueDate.toDateString() === today.toDateString();
    
    let backgroundColor = '#4a90e2';
    let borderColor = '#4a90e2';
    let fontWeight = '500';
    
    // Цвета по приоритету
    switch (task.priority) {
      case 'high':
        backgroundColor = '#e74c3c';
        borderColor = '#c0392b';
        break;
      case 'medium':
        backgroundColor = '#f39c12';
        borderColor = '#e67e22';
        break;
      case 'low':
        backgroundColor = '#27ae60';
        borderColor = '#229954';
        break;
      default:
        backgroundColor = '#4a90e2';
        borderColor = '#357abd';
    }
    
    // Специальные стили для просроченных и сегодняшних задач
    if (isOverdue) {
      backgroundColor = '#e74c3c';
      borderColor = '#c0392b';
      fontWeight = 'bold';
    } else if (isDueToday) {
      backgroundColor = '#f39c12';
      borderColor = '#e67e22';
      fontWeight = 'bold';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: '2px',
        borderRadius: '6px',
        opacity: task.status === 'completed' ? 0.6 : 1,
        color: 'white',
        border: 'none',
        display: 'block',
        fontWeight,
        fontSize: '12px',
        padding: '4px 8px',
        boxShadow: isOverdue ? '0 2px 4px rgba(231, 76, 60, 0.3)' : 
                   isDueToday ? '0 2px 4px rgba(243, 156, 18, 0.3)' : 
                   '0 1px 3px rgba(0, 0, 0, 0.2)'
      }
    };
  };

  // Получаем последние 5 активных задач
  const recentTasks = tasks
    .filter(task => task.status === 'active')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Дашборд</DashboardTitle>
        <DashboardSubtitle>Обзор ваших задач и календарь</DashboardSubtitle>
      </DashboardHeader>

      <DashboardContent>
        <CalendarSection>
          <CalendarHeader>
            <CalendarTitle>
              <FiCalendar />
              Календарь задач
            </CalendarTitle>
          </CalendarHeader>

          <CalendarContainer>
            <CustomCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              views={['month', 'week', 'day']}
              date={date}
              onNavigate={setDate}
              onView={setView}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: (props) => (
                  <CustomToolbar 
                    {...props} 
                    currentDate={date}
                    onDateSelect={handleDateSelect}
                  />
                )
              }}
              messages={{
                next: 'Следующий',
                previous: 'Предыдущий',
                today: 'Сегодня',
                month: 'Месяц',
                week: 'Неделя',
                day: 'День',
                agenda: 'Повестка',
                date: 'Дата',
                time: 'Время',
                event: 'Событие',
                noEventsInRange: 'Нет событий в выбранном диапазоне',
                showMore: total => `+${total} еще`,
                allDay: 'Весь день',
                work_week: 'Рабочая неделя',
                yesterday: 'Вчера',
                tomorrow: 'Завтра',
                am: '',
                pm: '',
                AM: '',
                PM: '',
                dateFormat: 'DD.MM.YYYY',
                dayFormat: 'DD',
                dayRangeHeaderFormat: 'MMMM YYYY',
                dayHeaderFormat: 'dddd, DD MMMM',
                monthHeaderFormat: 'MMMM YYYY',
                weekdayFormat: 'dd',
                timeFormat: 'HH:mm',
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: 'HH:mm',
                agendaDateFormat: 'DD.MM.YYYY',
                agendaTimeFormat: 'HH:mm',
                agendaTimeRangeFormat: 'HH:mm - HH:mm',
                selectRangePrompt: 'Выберите диапазон дат',
                eventRangeStartFormat: 'DD.MM.YYYY HH:mm',
                eventRangeEndFormat: 'DD.MM.YYYY HH:mm'
              }}
            />
          </CalendarContainer>
        </CalendarSection>

        <TasksSection>
          <TasksHeader>
            <TasksTitle>
              <FiList />
              Последние задачи
            </TasksTitle>
            {user && (
              <AddTaskButton onClick={onCreateTask}>
                <FiPlus />
                Добавить
              </AddTaskButton>
            )}
          </TasksHeader>

          <TasksList>
            {recentTasks.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📋</EmptyIcon>
                <EmptyText>Нет активных задач</EmptyText>
              </EmptyState>
            ) : (
              recentTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isSelected={selectedTask?.id === task.id}
                  onClick={() => onTaskSelect(task)}
                />
              ))
            )}
          </TasksList>
        </TasksSection>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
