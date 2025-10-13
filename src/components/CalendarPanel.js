import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';

const localizer = momentLocalizer(moment);

const PanelHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ViewControls = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: ${props => props.active ? '#4a90e2' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#357abd' : '#f5f5f5'};
  }
`;

const CalendarContainer = styled.div`
  flex: 1;
  padding: 20px;
  background: white;
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

  .rbc-time-view .rbc-header {
    border-bottom: 1px solid #e0e0e0;
  }

  .rbc-time-view .rbc-time-gutter {
    background: #f8f9fa;
  }

  .rbc-time-view .rbc-time-content {
    border-left: 1px solid #e0e0e0;
  }

  .rbc-time-view .rbc-timeslot-group {
    border-bottom: 1px solid #f0f0f0;
  }

  .rbc-time-view .rbc-time-slot {
    border-bottom: 1px solid #f8f9fa;
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

const EventTooltip = styled.div`
  position: absolute;
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
  max-width: 200px;
`;

const CalendarPanel = ({ tasks, onTaskSelect, selectedTask }) => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Преобразуем задачи в события для календаря
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.dueDate || new Date(),
    end: task.dueDate || new Date(),
    resource: task,
    allDay: true
  }));

  const handleSelectEvent = (event) => {
    onTaskSelect(event.resource);
  };

  const handleSelectSlot = (slotInfo) => {
    // Можно добавить логику для создания новой задачи на выбранную дату
    console.log('Selected slot:', slotInfo);
  };

  const eventStyleGetter = (event) => {
    const task = event.resource;
    let backgroundColor = '#4a90e2';
    
    switch (task.priority) {
      case 'high':
        backgroundColor = '#e74c3c';
        break;
      case 'medium':
        backgroundColor = '#f39c12';
        break;
      case 'low':
        backgroundColor = '#27ae60';
        break;
      default:
        backgroundColor = '#4a90e2';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => onNavigate('PREV')} style={{ padding: '8px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
          <FiChevronLeft />
        </button>
        <button onClick={() => onNavigate('TODAY')} style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
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
            background: view === 'month' ? '#4a90e2' : 'white', 
            color: view === 'month' ? 'white' : '#666',
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
            background: view === 'week' ? '#4a90e2' : 'white', 
            color: view === 'week' ? 'white' : '#666',
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
            background: view === 'day' ? '#4a90e2' : 'white', 
            color: view === 'day' ? 'white' : '#666',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer'
          }}
        >
          День
        </button>
      </div>
    </div>
  );

  return (
    <>
      <PanelHeader>
        <Title>
          <FiCalendar />
          Календарь задач
        </Title>
      </PanelHeader>

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
            toolbar: CustomToolbar
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
            showMore: total => `+${total} еще`
          }}
        />
      </CalendarContainer>
    </>
  );
};

export default CalendarPanel;
