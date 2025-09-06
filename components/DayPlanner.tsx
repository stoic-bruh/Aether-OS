// in app/components/DayPlanner.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfHour, addHours, isSameHour, differenceInMinutes } from 'date-fns';
import { Task, PlannedEvent } from '@/lib/types';
import { X } from 'lucide-react';

// --- Helper Functions ---
const generateTimeSlots = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(6, 0, 0, 0);
  return Array.from({ length: 18 }, (_, i) => addHours(startOfDay, i));
};

const calculateEventHeight = (start: string, end: string) => {
  const durationMinutes = differenceInMinutes(new Date(end), new Date(start));
  return `${durationMinutes}px`; // 1 minute = 1 pixel height
};

// --- Main Component ---
export default function DayPlanner({ initialEvents, incompleteTasks, selectedDate }: { initialEvents: PlannedEvent[], incompleteTasks: Task[], selectedDate: Date }) {
  const [events, setEvents] = useState(initialEvents);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEventSlot, setNewEventSlot] = useState<Date | null>(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, [editingEventId, newEventSlot]);
  
  const handleSlotClick = (slot: Date) => {
    if (editingEventId) return; // Don't create new if already editing
    setNewEventSlot(slot);
    setEditText('');
  };

  const handleCreateOrUpdate = async (title: string, startTime?: Date, eventId?: string) => {
    if (!title.trim()) {
      setNewEventSlot(null);
      setEditingEventId(null);
      return;
    }
    
    if (eventId) { // Updating an existing event
      await fetch(`/api/planner/${eventId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      });
    } else if (startTime) { // Creating a new event
      const endTime = addHours(startTime, 1);
      await fetch('/api/planner', {
        method: 'POST',
        body: JSON.stringify({ title, start_time: startTime.toISOString(), end_time: endTime.toISOString(), type: 'Task' }),
      });
    }

    setNewEventSlot(null);
    setEditingEventId(null);
    router.refresh();
  };
  
  const handleDelete = async (id: string) => {
    await fetch(`/api/planner/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="card-container">
      <div className="relative">
        {generateTimeSlots(selectedDate).map((slot, index) => (
          <div 
            key={index} 
            className="flex items-start border-t border-neutral-800/50 min-h-[60px] group"
            onClick={() => handleSlotClick(slot)}
          >
            <div className="w-20 text-right pr-4 pt-2 text-xs text-neutral-500">{format(slot, 'h a')}</div>
            <div className="flex-1 h-full relative">
              {/* Render existing events */}
              {initialEvents.filter(e => isSameHour(new Date(e.start_time), slot)).map(event => (
                <div key={event.id} className="absolute w-full pr-4">
                   <div 
                      className="group/event relative bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2 cursor-pointer" 
                      style={{ height: calculateEventHeight(event.start_time, event.end_time) }}
                      onClick={(e) => { e.stopPropagation(); setEditingEventId(event.id); setEditText(event.title); }}
                   >
                      {editingEventId === event.id ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => handleCreateOrUpdate(editText, undefined, event.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateOrUpdate(editText, undefined, event.id)}
                          className="bg-transparent text-white w-full h-full outline-none"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-white">{event.title}</p>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/20 text-neutral-500 opacity-0 group-hover/event:opacity-100 hover:text-white transition-opacity"
                      >
                        <X size={12} />
                      </button>
                   </div>
                </div>
              ))}
              {/* Render new event input */}
              {newEventSlot && isSameHour(newEventSlot, slot) && (
                 <div className="absolute w-full pr-4">
                    <div className="bg-cyan-900/50 border border-cyan-700/50 rounded-lg p-2" style={{ height: '60px' }}>
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="New Event..."
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => handleCreateOrUpdate(editText, newEventSlot)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateOrUpdate(editText, newEventSlot)}
                        className="bg-transparent text-white w-full h-full outline-none"
                      />
                    </div>
                 </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}