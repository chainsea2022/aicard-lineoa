import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Plus, Mail, Users, Edit, Bell, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import EmailComposer from './EmailComposer';
import CalendarView from './CalendarView';
import AttendeeManager from './AttendeeManager';
import MeetingReminder from './MeetingReminder';

interface ScheduleProps {
  onClose: () => void;
}

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
  type: 'meeting' | 'call' | 'email';
  status: 'scheduled' | 'completed' | 'cancelled';
  description?: string;
  reminderSent?: boolean;
}

const Schedule: React.FC<ScheduleProps> = ({ onClose }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 1,
      title: '產品介紹會議',
      date: '2024-01-15',
      time: '14:00',
      location: '台北辦公室會議室A',
      attendees: [
        { id: '1', name: '張小明', email: 'zhang@example.com', company: 'ABC公司', relationship: '潛在客戶' },
        { id: '2', name: '李小華', email: 'li@example.com', company: 'ABC公司', relationship: '決策者' }
      ],
      type: 'meeting',
      status: 'scheduled',
      description: '向客戶介紹我們的新產品功能和優勢'
    },
    {
      id: 2,
      title: '客戶電話訪談',
      date: '2024-01-16',
      time: '10:30',
      attendees: [
        { id: '3', name: '王大成', email: 'wang@example.com', company: 'XYZ企業', relationship: '現有客戶' }
      ],
      type: 'call',
      status: 'scheduled',
      description: '了解客戶需求並討論合作方案'
    },
    {
      id: 3,
      title: '跟進信件發送',
      date: '2024-01-17',
      time: '09:00',
      attendees: [
        { id: '4', name: '陳小美', email: 'chen@example.com', company: '123科技', relationship: '聯絡人' },
        { id: '5', name: '林志明', email: 'lin@example.com', company: '123科技', relationship: '主管' }
      ],
      type: 'email',
      status: 'completed'
    }
  ]);

  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: [] as Attendee[],
    type: 'meeting' as Meeting['type'],
    description: ''
  });
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showReminder, setShowReminder] = useState<Meeting | null>(null);

  const handleCreateMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      if (editingMeeting) {
        // Update existing meeting
        const updatedMeeting: Meeting = {
          ...editingMeeting,
          title: newMeeting.title,
          date: newMeeting.date,
          time: newMeeting.time,
          location: newMeeting.location,
          attendees: newMeeting.attendees,
          type: newMeeting.type,
          description: newMeeting.description
        };
        
        setMeetings(prev => prev.map(meeting => 
          meeting.id === editingMeeting.id ? updatedMeeting : meeting
        ));
        
        toast({
          title: "會議已更新！",
          description: "行程已成功更新並同步至行事曆。",
        });
        
        setEditingMeeting(null);
      } else {
        // Create new meeting
        const meeting: Meeting = {
          id: meetings.length + 1,
          title: newMeeting.title,
          date: newMeeting.date,
          time: newMeeting.time,
          location: newMeeting.location,
          attendees: newMeeting.attendees,
          type: newMeeting.type,
          status: 'scheduled',
          description: newMeeting.description
        };
        
        setMeetings([...meetings, meeting]);
        
        toast({
          title: "會議已建立！",
          description: "新的行程已加入您的排程中。",
        });
      }
      
      setNewMeeting({ 
        title: '', 
        date: '', 
        time: '', 
        location: '', 
        attendees: [], 
        type: 'meeting',
        description: ''
      });
      setShowNewMeeting(false);
    }
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setNewMeeting({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      location: meeting.location || '',
      attendees: meeting.attendees,
      type: meeting.type,
      description: meeting.description || ''
    });
    setShowNewMeeting(true);
  };

  const handleCloseModal = () => {
    setShowNewMeeting(false);
    setEditingMeeting(null);
    setNewMeeting({ 
      title: '', 
      date: '', 
      time: '', 
      location: '', 
      attendees: [], 
      type: 'meeting',
      description: ''
    });
  };

  const handleShowReminder = (meeting: Meeting) => {
    setShowReminder(meeting);
  };

  const handleViewCard = (cardId: string) => {
    toast({
      title: "開啟電子名片",
      description: `查看 ${cardId} 的電子名片資訊`,
    });
    // Here you would navigate to the card view
  };

  const handleSendReminder = (attendeeId: string, type: 'email' | 'sms') => {
    toast({
      title: `已發送${type === 'email' ? '郵件' : '簡訊'}提醒`,
      description: "提醒已成功發送給參與者",
    });
  };

  const sendMeetingInvite = (meeting: Meeting) => {
    toast({
      title: "會議邀請已發送",
      description: `已向 ${meeting.attendees.length} 位參與者發送會議邀請`,
    });
  };

  const getTypeIcon = (type: Meeting['type']) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'call': return <Calendar className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Meeting['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-700';
      case 'call': return 'bg-green-100 text-green-700';
      case 'email': return 'bg-purple-100 text-purple-700';
    }
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
    }
  };

  if (showEmailComposer) {
    return <EmailComposer onClose={() => setShowEmailComposer(false)} />;
  }

  if (showCalendar) {
    return <CalendarView onClose={() => setShowCalendar(false)} />;
  }

  if (showReminder) {
    return (
      <MeetingReminder
        meeting={showReminder}
        onClose={() => setShowReminder(null)}
        onViewCard={handleViewCard}
        onSendReminder={handleSendReminder}
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 shadow-lg">
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
            <h1 className="font-bold text-lg">行程管理</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewMeeting(true)}
            className="text-white hover:bg-white/20"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Today's Schedule */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-indigo-800">今日行程</h3>
          </div>
          <div className="text-sm text-indigo-700">
            您今天有 2 個會議安排，下一個會議在 1 小時後開始。
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => setShowNewMeeting(true)}
            className="h-16 bg-blue-500 hover:bg-blue-600 flex flex-col items-center justify-center space-y-1"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">新增會議</span>
          </Button>
          <Button
            onClick={() => setShowEmailComposer(true)}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Mail className="w-5 h-5" />
            <span className="text-xs">發送信件</span>
          </Button>
          <Button
            onClick={() => setShowCalendar(true)}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">查看日曆</span>
          </Button>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">近期行程</h3>
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{meeting.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(meeting.date).toLocaleDateString('zh-TW')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.time}</span>
                    </div>
                  </div>
                  {meeting.location && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{meeting.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(meeting.type)}`}>
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(meeting.type)}
                      <span>{meeting.type === 'meeting' ? '會議' : meeting.type === 'call' ? '通話' : '信件'}</span>
                    </div>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                    {meeting.status === 'scheduled' ? '已安排' : meeting.status === 'completed' ? '已完成' : '已取消'}
                  </span>
                </div>
              </div>
              
              {meeting.attendees.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">參與者：</p>
                  <div className="flex flex-wrap gap-1">
                    {meeting.attendees.map((attendee, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                      >
                        <span>{attendee.name}</span>
                        {attendee.relationship && (
                          <span className="bg-blue-500 text-white px-1 rounded-full text-xs">
                            {attendee.relationship}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {meeting.description && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">會議描述：</p>
                  <p className="text-sm text-gray-700">{meeting.description}</p>
                </div>
              )}
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleShowReminder(meeting)}
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    提醒
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => sendMeetingInvite(meeting)}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    邀請
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditMeeting(meeting)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  編輯
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-bold text-gray-800 mb-3">本月統計</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs text-gray-600">已完成會議</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-xs text-gray-600">待進行會議</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">25</div>
              <div className="text-xs text-gray-600">發送信件</div>
            </div>
          </div>
        </div>
      </div>

      {/* New/Edit Meeting Modal */}
      {showNewMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingMeeting ? '編輯行程' : '新增行程'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  會議標題
                </label>
                <Input
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="輸入會議標題"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    日期
                  </label>
                  <Input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    時間
                  </label>
                  <Input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  地點 (選填)
                </label>
                <Input
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="會議地點或線上會議連結"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  會議描述 (選填)
                </label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述會議目的、議程等"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              </div>
              
              <AttendeeManager
                attendees={newMeeting.attendees}
                onAttendeesChange={(attendees) => setNewMeeting(prev => ({ ...prev, attendees }))}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  類型
                </label>
                <select
                  value={newMeeting.type}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, type: e.target.value as Meeting['type'] }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="meeting">會議</option>
                  <option value="call">通話</option>
                  <option value="email">信件</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handleCreateMeeting}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600"
              >
                {editingMeeting ? '更新' : '建立'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
