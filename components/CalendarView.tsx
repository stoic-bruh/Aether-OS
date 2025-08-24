// in app/components/CalendarView.tsx
'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import timeGridPlugin from '@fullcalendar/timegrid';

// Define the shape of the event objects we'll pass to the calendar
type CalendarEvent = {
  title: string;
  start: string;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
};

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="card-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        editable={true} // Allows dragging and resizing events
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
      />
    </div>
  );
}