
import React, { useState } from 'react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users, Edit, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  relationship?: string;
  cardId?: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees: Attendee[];
  type: 'meeting' | 'activity' | 'event';
  status: 'scheduled' | 'completed' | 'cancelled';
  description?: string;
}

interface CalendarViewProps {
  onClose: () => void;
  meetings: Meeting[];
  onDateSelect: (date: string) => void;
  onEditMeeting: (meeting: Meeting) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onClose, meetings, onDateSelect, onEditMeeting }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return meetings.filter(meeting => meeting.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasEvents = (date: Date | null) => {
    return getEventsForDate(date).length > 0;
  };

  const getEventTypeColor = (type: Meeting['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'activity': return 'bg-green-500';
      case 'event': return 'bg-purple-500';
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddMeetingToDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    onDateSelect(dateString);
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">行事曆</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => selectedDate && handleAddMeetingToDate(selectedDate)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-xl font-bold text-gray-800">
            {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={`
                  aspect-square p-2 text-sm cursor-pointer rounded-lg transition-colors
                  ${day ? 'hover:bg-gray-50' : ''}
                  ${isToday(day) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  ${isSelected(day) ? 'bg-blue-100 text-blue-700' : ''}
                  ${!day ? 'cursor-default' : ''}
                `}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <div className="h-full flex flex-col">
                    <span className={`text-center ${isToday(day) ? 'font-bold' : ''}`}>
                      {day.getDate()}
                    </span>
                    {hasEvents(day) && (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-1 mt-1">
                        {getEventsForDate(day).slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                          />
                        ))}
                        {getEventsForDate(day).length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{getEventsForDate(day).length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">
                {selectedDate.toLocaleDateString('zh-TW')} 的行程
              </h3>
              <Button
                size="sm"
                onClick={() => handleAddMeetingToDate(selectedDate)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                新增會議
              </Button>
            </div>
            
            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">此日期沒有安排行程</p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                        <div>
                          <h4 className="font-medium text-gray-800">{event.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                            {event.location && (
                              <>
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditMeeting(event)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {event.attendees.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-3 h-3" />
                          <span>{event.attendees.length} 位參與者</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {event.attendees.map((attendee, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                            >
                              {attendee.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {event.description && (
                      <div className="mt-2 text-sm text-gray-600">
                        {event.description}
                      </div>
                    )}
                    
                    <div className={`
                      mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block
                      ${event.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${event.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                      ${event.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {event.status === 'scheduled' ? '已安排' : event.status === 'completed' ? '已完成' : '已取消'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1"
            onClick={() => selectedDate && handleAddMeetingToDate(selectedDate)}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">新增會議</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1"
            onClick={() => setCurrentDate(new Date())}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">回到今天</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs">設定提醒</span>
          </Button>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-bold text-gray-800 mb-3">本月概覽</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {meetings.filter(e => e.type === 'meeting').length}
              </div>
              <div className="text-xs text-gray-600">會議</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {meetings.filter(e => e.type === 'activity').length}
              </div>
              <div className="text-xs text-gray-600">活動</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {meetings.filter(e => e.type === 'event').length}
              </div>
              <div className="text-xs text-gray-600">事件</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
