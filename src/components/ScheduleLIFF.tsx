import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Clock, MapPin, Users, Edit, Trash2, Bell, Video, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ScheduleLIFFProps {
  onClose: () => void;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  attendees: string[];
  type: 'meeting' | 'call' | 'event' | 'reminder';
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const ScheduleLIFF: React.FC<ScheduleLIFFProps> = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: '客戶會議 - 張先生',
      description: '討論新產品合作案',
      date: '2024-07-24',
      time: '14:00',
      duration: 60,
      location: '台北市信義區信義路五段7號',
      attendees: ['張先生', '李小姐'],
      type: 'meeting',
      priority: 'high',
      status: 'upcoming'
    },
    {
      id: '2',
      title: '產品展示會議',
      description: '向潛在客戶展示最新產品功能',
      date: '2024-07-24',
      time: '16:30',
      duration: 90,
      location: '線上會議',
      attendees: ['王經理', '陳主任'],
      type: 'call',
      priority: 'medium',
      status: 'upcoming'
    },
    {
      id: '3',
      title: '團隊月會',
      description: '檢討本月業績與下月計劃',
      date: '2024-07-25',
      time: '10:00',
      duration: 120,
      location: '會議室A',
      attendees: ['團隊成員'],
      type: 'meeting',
      priority: 'medium',
      status: 'upcoming'
    }
  ]);
  
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    date: selectedDate.toISOString().split('T')[0],
    time: '',
    duration: 60,
    location: '',
    attendees: [],
    type: 'meeting',
    priority: 'medium'
  });

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

  useEffect(() => {
    setNewEvent(prev => ({
      ...prev,
      date: selectedDate.toISOString().split('T')[0]
    }));
  }, [selectedDate]);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'call': return <Video className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'reminder': return <Bell className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({
        title: "請填寫必要資訊",
        description: "標題、日期和時間為必填欄位"
      });
      return;
    }

    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...newEvent as Event }
          : event
      ));
      toast({
        title: "行程已更新",
        description: "您的行程已成功更新"
      });
    } else {
      const event: Event = {
        ...newEvent as Event,
        id: Date.now().toString(),
        attendees: newEvent.attendees || [],
        status: 'upcoming'
      };
      setEvents(prev => [...prev, event]);
      toast({
        title: "行程已新增",
        description: "新的行程已成功加入您的日程"
      });
    }

    setShowEventDialog(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      date: selectedDate.toISOString().split('T')[0],
      time: '',
      duration: 60,
      location: '',
      attendees: [],
      type: 'meeting',
      priority: 'medium'
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent(event);
    setShowEventDialog(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "行程已刪除",
      description: "該行程已從您的日程中移除"
    });
  };

  const todayEvents = getEventsForDate(new Date());
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date() && event.status === 'upcoming')
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
    .slice(0, 5);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">行程管理</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              行程列表
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              日曆檢視
            </Button>
          </div>
          
          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                新增行程
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? '編輯行程' : '新增行程'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">行程標題 *</Label>
                  <Input
                    id="title"
                    value={newEvent.title || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="請輸入行程標題"
                  />
                </div>

                <div>
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="請輸入行程描述"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">日期 *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date || ''}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">時間 *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time || ''}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">持續時間 (分鐘)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newEvent.duration || 60}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    min="15"
                    step="15"
                  />
                </div>

                <div>
                  <Label htmlFor="location">地點</Label>
                  <Input
                    id="location"
                    value={newEvent.location || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="請輸入會議地點或線上連結"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">類型</Label>
                    <Select 
                      value={newEvent.type || 'meeting'} 
                      onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">會議</SelectItem>
                        <SelectItem value="call">通話</SelectItem>
                        <SelectItem value="event">活動</SelectItem>
                        <SelectItem value="reminder">提醒</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">優先級</Label>
                    <Select 
                      value={newEvent.priority || 'medium'} 
                      onValueChange={(value) => setNewEvent(prev => ({ ...prev, priority: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSaveEvent} className="flex-1">
                    {editingEvent ? '更新' : '新增'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowEventDialog(false);
                      setEditingEvent(null);
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 今日行程概覽 */}
        <Card className="border-indigo-200 bg-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-indigo-800">
              <Clock className="w-5 h-5 mr-2" />
              今日行程 ({todayEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayEvents.length === 0 ? (
              <p className="text-indigo-600 text-center py-4">今日暫無安排行程</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.id} className="bg-white p-3 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-full">
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-gray-600">
                            {formatTime(event.time)} • {event.duration}分鐘
                          </p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(event.priority)}>
                        {event.priority === 'high' ? '高' : event.priority === 'medium' ? '中' : '低'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 即將到來的行程 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              即將到來的行程
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-gray-100 rounded">
                          {getEventTypeIcon(event.type)}
                        </div>
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge className={getPriorityColor(event.priority)}>
                          {event.priority === 'high' ? '高' : event.priority === 'medium' ? '中' : '低'}
                        </Badge>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      )}
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.date} {formatTime(event.time)}</span>
                          </span>
                          <span>持續 {event.duration} 分鐘</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.attendees.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>參與者: {event.attendees.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEvent(event)}
                        className="p-1 h-auto"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-1 h-auto text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暫無即將到來的行程</p>
                  <p className="text-sm">點擊上方「新增行程」開始安排您的日程</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 統計資訊 */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-xs text-gray-600">總行程數</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'upcoming').length}
              </div>
              <div className="text-xs text-gray-600">待辦行程</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-600">已完成</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleLIFF;