/**
 * VisionFlow Calendar Page
 * Calendar view with drag-and-drop rescheduling
 * Phase 2D: Calendar
 */

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, View, Event as RBCEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { GlowCard, GlowCardContent } from '@/components/glow-ui/GlowCard';
import { GlowButton } from '@/components/glow-ui/GlowButton';
import { GlowSwitch } from '@/components/glow-ui/GlowSwitch';
import { EventDetailPanel } from './components/EventDetailPanel';
import type { CalendarEventDetail } from './components/EventDetailPanel';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface CalendarEvent extends RBCEvent {
  id: string;
  type: 'TASK' | 'PROJECT' | 'MILESTONE';
  status: string;
  priority?: string;
  color: string;
  resource: {
    id: string;
    type: string;
    projectId?: string;
  };
}

export default function VisionFlowCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventDetail | null>(null);
  const [filters, setFilters] = useState({
    includeTasks: true,
    includeProjects: true,
    includeMilestones: true,
  });

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range based on current view
      const start = moment(currentDate).startOf(view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toISOString();
      const end = moment(currentDate).endOf(view === 'month' ? 'month' : view === 'week' ? 'week' : 'day').toISOString();

      const params = new URLSearchParams({
        start,
        end,
        include_tasks: filters.includeTasks.toString(),
        include_projects: filters.includeProjects.toString(),
        include_milestones: filters.includeMilestones.toString(),
      });

      const response = await fetch(`/api/v1/apps/visionflow/calendar/events?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to load events');
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load calendar events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentDate, view, filters]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event as CalendarEventDetail);
  }, []);

  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const eventStyleGetter = useCallback((event: RBCEvent) => {
    const calendarEvent = event as unknown as CalendarEvent;
    return {
      style: {
        backgroundColor: calendarEvent.color || '#0047AB',
        borderColor: calendarEvent.color || '#0047AB',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        padding: '2px 4px',
      },
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (event.type === 'TASK' && !filters.includeTasks) return false;
      if (event.type === 'PROJECT' && !filters.includeProjects) return false;
      if (event.type === 'MILESTONE' && !filters.includeMilestones) return false;
      return true;
    });
  }, [events, filters]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Calendar</h2>
          <p className="mt-1 text-sm text-gray-600">
            View and manage your tasks, projects, and milestones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GlowButton
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </GlowButton>
        </div>
      </div>

      {/* Filters */}
      <GlowCard variant="flat" padding="md">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-700">Show:</span>
          <div className="flex items-center gap-2">
            <GlowSwitch
              checked={filters.includeTasks}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, includeTasks: checked })
              }
            />
            <label className="text-sm text-gray-700">Tasks</label>
          </div>
          <div className="flex items-center gap-2">
            <GlowSwitch
              checked={filters.includeProjects}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, includeProjects: checked })
              }
            />
            <label className="text-sm text-gray-700">Projects</label>
          </div>
          <div className="flex items-center gap-2">
            <GlowSwitch
              checked={filters.includeMilestones}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, includeMilestones: checked })
              }
            />
            <label className="text-sm text-gray-700">Milestones</label>
          </div>
        </div>
      </GlowCard>

      {/* Calendar */}
      <GlowCard variant="flat" padding="md">
        <GlowCardContent className="p-0">
          <div style={{ height: '600px' }}>
            <BigCalendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              date={currentDate}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar,
              }}
            />
          </div>
        </GlowCardContent>
      </GlowCard>

      {/* Event Detail Panel */}
      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={loadEvents}
        />
      )}
    </div>
  );
}

// Custom Toolbar Component
function CustomToolbar({ label, onNavigate, onView }: any) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <GlowButton
          variant="outline"
          size="sm"
          onClick={() => onNavigate('PREV')}
        >
          <ChevronLeft className="h-4 w-4" />
        </GlowButton>
        <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
        <GlowButton
          variant="outline"
          size="sm"
          onClick={() => onNavigate('NEXT')}
        >
          <ChevronRight className="h-4 w-4" />
        </GlowButton>
        <GlowButton
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </GlowButton>
      </div>
      <div className="flex items-center gap-2">
        <GlowButton
          variant="outline"
          size="sm"
          onClick={() => onView('month')}
        >
          Month
        </GlowButton>
        <GlowButton
          variant="outline"
          size="sm"
          onClick={() => onView('week')}
        >
          Week
        </GlowButton>
        <GlowButton
          variant="outline"
          size="sm"
          onClick={() => onView('day')}
        >
          Day
        </GlowButton>
        <GlowButton
          variant="outline"
          size="sm"
          onClick={() => onView('agenda')}
        >
          Agenda
        </GlowButton>
      </div>
    </div>
  );
}

