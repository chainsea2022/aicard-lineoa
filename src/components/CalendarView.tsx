
import React, { useState } from 'react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface CalendarViewProps {
  onClose: () => void;
}

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'call' | 'email';
  status: 'scheduled' | 'completed' | 'cancelled';
}

const CalendarView: React.FC<CalendarViewProps> = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: '產品介紹會議',
      date: '2024-01-15',
      time: '14:00',
      type: 'meeting',
      status: 'scheduled'
    },
    {
      id: 2,
      title: '客戶電話訪談',
      date: '2024-01-16',
      time: '10:30',
      type: 'call',
      status: 'scheduled'
    },
    {
      id: 3,
      title: '跟進信件發送',
      date: '2024-01-17',
      time: '09:00',
      type: 'email',
      status: 'completed'
    },
    {
      id: 4,
      title: '月會',
      date: '2024-01-20',
      time: '15:00',
      type: 'meeting',
      status: 'scheduled'
    }
  ]);

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
    return events.filter(event => event.date === dateString);
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

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'call': return 'bg-green-500';
      case 'email': return 'bg-purple-500';
    }
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
                onClick={() => day && setSelectedDate(day)}
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
            <h3 className="font-bold text-gray-800 mb-4">
              {selectedDate.toLocaleDateString('zh-TW')} 的行程
            </h3>
            
            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">此日期沒有安排行程</p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{event.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                        <span className="capitalize">
                          {event.type === 'meeting' ? '會議' : event.type === 'call' ? '通話' : '信件'}
                        </span>
                      </div>
                    </div>
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
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
                {events.filter(e => e.type === 'meeting').length}
              </div>
              <div className="text-xs text-gray-600">會議</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.type === 'call').length}
              </div>
              <div className="text-xs text-gray-600">通話</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.type === 'email').length}
              </div>
              <div className="text-xs text-gray-600">信件</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
