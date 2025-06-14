import { useState } from 'react';
import { 
  FiCalendar, 
  FiPlus, 
  FiChevronLeft, 
  FiChevronRight, 
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiClock,
  FiMapPin,
  FiUser,
  FiTag
} from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  
  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Client Meeting',
      date: '2025-06-15',
      time: '10:00',
      duration: 60, // minutes
      type: 'meeting',
      client: 'Acme Corp',
      location: 'Conference Room A',
      description: 'Quarterly review meeting with Acme Corp team.',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Project Deadline',
      date: '2025-06-20',
      time: '17:00',
      duration: 0,
      type: 'deadline',
      client: 'Globex',
      description: 'Submit final deliverables for the Globex project.',
      color: 'red'
    },
    {
      id: 3,
      title: 'Team Sync',
      date: '2025-06-22',
      time: '14:30',
      duration: 30,
      type: 'meeting',
      client: 'Internal',
      location: 'Zoom',
      description: 'Weekly team sync meeting.',
      color: 'green'
    },
  ]);

  // Navigation functions
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Get days for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Check if a day has events
  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  // Get color class for event type
  const getEventColorClass = (eventType) => {
    switch (eventType) {
      case 'meeting': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'deadline': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get color for event dot
  const getEventDotColor = (eventColor) => {
    switch (eventColor) {
      case 'blue': return 'bg-blue-500';
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Get events for the selected date
  const selectedDateEvents = getEventsForDay(selectedDate);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Calendar</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your schedule and appointments
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {['month', 'week', 'day'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm font-medium ${
                  view === v
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                } ${
                  v === 'month' ? 'rounded-l-lg' : ''
                } ${
                  v === 'day' ? 'rounded-r-lg' : 'border-r border-gray-200 dark:border-gray-600'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button 
            onClick={goToToday}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Today
          </button>
          <button 
            onClick={() => setShowEventModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={prevMonth}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              aria-label="Previous month"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="mx-4 text-xl font-semibold text-gray-800 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              aria-label="Next month"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <FiFilter className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <FiDownload className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {/* Weekday Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-100 dark:bg-gray-700 p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {monthDays.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div 
                key={i} 
                onClick={() => setSelectedDate(day)}
                className={`min-h-24 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  isSelected ? 'ring-2 ring-blue-500 z-10' : ''
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${
                      isToday 
                        ? 'flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white' 
                        : isCurrentMonth 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex -space-x-1">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div 
                            key={idx} 
                            className={`w-1.5 h-1.5 rounded-full ${getEventDotColor(event.color)}`}
                            title={`${event.title} (${event.client})`}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-xs text-gray-400">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-20">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div 
                        key={event.id} 
                        className={`text-xs p-1 mb-1 rounded truncate ${getEventColorClass(event.type)}`}
                        title={`${event.title} (${event.client})`}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event' : 'events'} scheduled
          </p>
        </div>
        
        {selectedDateEvents.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {selectedDateEvents.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-12 w-1 rounded-full ${getEventDotColor(event.color)}`}></div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">{event.title}</h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getEventColorClass(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>{event.time} • {event.duration} min</span>
                    </div>
                    {event.location && (
                      <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiUser className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span>{event.client}</span>
                    </div>
                    {event.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events scheduled</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new event.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowEventModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                New Event
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Event Modal (simplified) */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">New Event</h3>
                <button 
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="event-title"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Event title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="event-date"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="event-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      id="event-time"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    id="event-type"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option>Meeting</option>
                    <option>Call</option>
                    <option>Deadline</option>
                    <option>Reminder</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="event-client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Client
                  </label>
                  <input
                    type="text"
                    id="event-client"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Client name"
                  />
                </div>
                <div>
                  <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location/Link (optional)
                  </label>
                  <input
                    type="text"
                    id="event-location"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Zoom, Conference Room, etc."
                  />
                </div>
                <div>
                  <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    id="event-description"
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Add details about the event..."
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="event-reminder"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="event-reminder" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Set reminder
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
