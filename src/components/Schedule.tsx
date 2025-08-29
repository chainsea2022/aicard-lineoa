import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Plus, Mail, Users, Edit, Bell, MapPin, Mic, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import EmailComposer from './EmailComposer';
import CalendarView from './CalendarView';
import AttendeeManager from './AttendeeManager';
import MeetingReminder from './MeetingReminder';
import RecipientSelector from './RecipientSelector';
import VoiceInput from './VoiceInput';

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

interface Recipient {
  id: string;
  name: string;
  email: string;
  company?: string;
  relationship?: string;
  source: 'customer' | 'contact' | 'manual';
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees: Attendee[];
  type: 'meeting' | 'call' | 'activity' | 'other';
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
      type: 'activity',
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
      type: 'other',
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
  const [isListening, setIsListening] = useState(false);
  const [showAIInput, setShowAIInput] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    type?: Meeting['type'];
    attendees?: Attendee[];
    confidence?: number;
  } | null>(null);
  const [aiInputText, setAiInputText] = useState('');
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [showRecipientSelector, setShowRecipientSelector] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showReminder, setShowReminder] = useState<Meeting | null>(null);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<string>('');
  const [selectedEmailRecipients, setSelectedEmailRecipients] = useState<Recipient[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<'completed' | 'upcoming' | 'emails' | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);

  const handleHistoryItemClick = (item: any, type: 'meeting' | 'email') => {
    setSelectedHistoryItem({ ...item, type });
    
    if (type === 'meeting') {
      // 觸發會議相關事件
      toast({
        title: `會議詳情 - ${item.title}`,
        description: `日期: ${item.date} ${item.time || ''}`,
      });
      
      // 可以在這裡添加更多邏輯，例如跳轉到詳細頁面或編輯
      if (item.status === 'scheduled') {
        // 待進行會議的額外處理
        console.log('處理待進行會議:', item);
      } else if (item.status === 'completed') {
        // 已完成會議的額外處理  
        console.log('處理已完成會議:', item);
      }
    } else if (type === 'email') {
      // 觸發郵件相關事件
      toast({
        title: `信件詳情 - ${item.title}`,
        description: `發送時間: ${item.time}`,
      });
    }
  };

  const generateMeetingSuggestions = (attendees: Attendee[]) => {
    if (attendees.length === 0) return { title: '', description: '' };

    const companies = [...new Set(attendees.map(a => a.company).filter(Boolean))];
    const relationships = [...new Set(attendees.map(a => a.relationship).filter(Boolean))];
    
    let suggestedTitle = '';
    let suggestedDescription = '';

    if (companies.length === 1) {
      suggestedTitle = `與 ${companies[0]} 的會議`;
    } else if (attendees.length === 1) {
      suggestedTitle = `與 ${attendees[0].name} 的會議`;
    } else {
      suggestedTitle = `多方會議 (${attendees.length} 位參與者)`;
    }

    if (relationships.includes('潛在客戶')) {
      suggestedDescription = '產品介紹與需求了解會議';
    } else if (relationships.includes('現有客戶')) {
      suggestedDescription = '客戶關係維護與服務討論';
    } else if (relationships.includes('決策者')) {
      suggestedDescription = '重要決策討論會議';
    } else {
      suggestedDescription = `與 ${attendees.map(a => a.name).join('、')} 的商務會議`;
    }

    return { title: suggestedTitle, description: suggestedDescription };
  };

  const handleAttendeesChange = (attendees: Attendee[]) => {
    setNewMeeting(prev => ({ ...prev, attendees }));
    
    if (!newMeeting.title && !newMeeting.description) {
      const suggestions = generateMeetingSuggestions(attendees);
      setNewMeeting(prev => ({
        ...prev,
        attendees,
        title: suggestions.title,
        description: suggestions.description
      }));
    } else {
      setNewMeeting(prev => ({ ...prev, attendees }));
    }
  };

  const handleCreateMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      if (editingMeeting) {
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

  const handleDeleteMeeting = (meetingId: number) => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
    toast({
      title: "行程已刪除",
      description: "行程已從您的排程中移除。",
    });
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

  const handleCalendarDateSelect = (date: string) => {
    setCalendarSelectedDate(date);
    setNewMeeting(prev => ({ ...prev, date }));
    setShowCalendar(false);
    setShowNewMeeting(true);
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
      case 'call': return <Bell className="w-4 h-4" />;
      case 'activity': return <Calendar className="w-4 h-4" />;
      case 'other': return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Meeting['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-700';
      case 'call': return 'bg-green-100 text-green-700';
      case 'activity': return 'bg-purple-100 text-purple-700';
      case 'other': return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
    }
  };

  // AI智能分析描述並生成分析結果
  const handleAIAnalysis = (description: string) => {
    if (!description.trim()) {
      setAiAnalysisResult(null);
      return;
    }

    // 提取日期時間
    const dateTime = extractDateTimeFromDescription(description);
    
    // 提取地點
    const location = extractLocationFromDescription(description);
    
    // 推斷會議類型
    const type = inferTypeFromDescription(description);
    
    // 從名片夾中尋找匹配的聯絡人
    const attendees = extractAttendeesFromDescription(description);
    
    // 生成會議標題
    let title = generateTitleFromDescription(description, attendees);
    
    // 如果沒有標題，使用預設標題
    if (!title) {
      title = '智能行程';
    }

    // 如果沒有日期，設定為今天
    let finalDate = dateTime.date;
    if (!finalDate) {
      const today = new Date();
      finalDate = today.toISOString().split('T')[0];
    }

    // 如果沒有時間，設定為現在時間的下一個小時
    let finalTime = dateTime.time;
    if (!finalTime) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
      finalTime = `${now.getHours().toString().padStart(2, '0')}:00`;
    }

    // 計算分析信心度
    let confidence = 0.5; // 基礎信心度
    if (dateTime.date) confidence += 0.2;
    if (dateTime.time) confidence += 0.2;
    if (location) confidence += 0.1;
    if (attendees.length > 0) confidence += 0.2;
    if (title && !title.includes('商務會議')) confidence += 0.1;

    const analysisResult = {
      title,
      description,
      date: finalDate,
      time: finalTime,
      location,
      type,
      attendees,
      confidence: Math.min(confidence, 1.0)
    };

    setAiAnalysisResult(analysisResult);
  };

  // 確認並套用AI分析結果
  const handleApplyAIAnalysis = () => {
    if (!aiAnalysisResult) return;

    setNewMeeting(prev => ({
      ...prev,
      title: aiAnalysisResult.title || prev.title,
      description: aiAnalysisResult.description || prev.description,
      date: aiAnalysisResult.date || prev.date,
      time: aiAnalysisResult.time || prev.time,
      location: aiAnalysisResult.location || prev.location,
      type: aiAnalysisResult.type || prev.type,
      attendees: aiAnalysisResult.attendees || prev.attendees
    }));

    // 顯示成功提示
    toast({
      title: "AI 分析完成！",
      description: `信心度 ${Math.round((aiAnalysisResult.confidence || 0) * 100)}% - 已自動填入表單`,
    });

    // 清除分析結果並關閉AI輸入
    setAiAnalysisResult(null);
    setAiInputText('');
    setShowAIInput(false);
  };

  // AI智能提取日期時間
  const extractDateTimeFromDescription = (desc: string): { date?: string; time?: string } => {
    const result: { date?: string; time?: string } = {};
    
    // 提取相對日期
    const today = new Date();
    let targetDate = new Date(today);
    
    if (desc.includes('明天') || desc.includes('明日')) {
      targetDate.setDate(today.getDate() + 1);
      result.date = targetDate.toISOString().split('T')[0];
    } else if (desc.includes('後天')) {
      targetDate.setDate(today.getDate() + 2);
      result.date = targetDate.toISOString().split('T')[0];
    } else if (desc.includes('下週')) {
      targetDate.setDate(today.getDate() + 7);
      result.date = targetDate.toISOString().split('T')[0];
    }
    
    // 提取具體日期
    const dateMatches = desc.match(/(\d{1,2})月(\d{1,2})[日號]/);
    if (dateMatches) {
      const month = parseInt(dateMatches[1]) - 1;
      const day = parseInt(dateMatches[2]);
      targetDate.setMonth(month);
      targetDate.setDate(day);
      result.date = targetDate.toISOString().split('T')[0];
    }
    
    // 提取時間
    const timePatterns = [
      /(上午|早上)\s*(\d{1,2})[點時](\d{1,2})?分?/,
      /(下午|晚上)\s*(\d{1,2})[點時](\d{1,2})?分?/,
      /中午\s*(\d{1,2})?[點時]?(\d{1,2})?分?/,
      /(\d{1,2})[點時](\d{1,2})?分?/,
      /(\d{1,2}):(\d{2})/,
    ];
    
    for (const pattern of timePatterns) {
      const match = desc.match(pattern);
      if (match) {
        let hour = 0;
        let minute = 0;
        
        if (match[0].includes('上午') || match[0].includes('早上')) {
          hour = parseInt(match[2]);
          minute = parseInt(match[3] || '0');
          if (hour === 12) hour = 0;
        } else if (match[0].includes('下午') || match[0].includes('晚上')) {
          hour = parseInt(match[2]);
          minute = parseInt(match[3] || '0');
          if (hour !== 12) hour += 12;
        } else if (match[0].includes('中午')) {
          hour = 12;
          minute = parseInt(match[2] || '0');
        } else if (match[2] && match[1]) {
          hour = parseInt(match[1]);
          minute = parseInt(match[2]);
        } else {
          hour = parseInt(match[1]);
          minute = parseInt(match[2] || '0');
        }
        
        if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
          result.time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }
        break;
      }
    }
    
    return result;
  };

  // AI提取地點資訊
  const extractLocationFromDescription = (desc: string): string | null => {
    const locationPatterns = [
      /在([^，,。!\n\s]+?)(會議|開會|見面|討論|聚會)/g,
      /([^，,。!\n\s]+?)(會議室|辦公室|餐廳|咖啡廳|公司|店)/g,
      /地點[:：]\s*([^，,。!\n]+)/g,
      /(台北|台中|台南|高雄|新北|桃園|新竹)([^，,。!\n\s]*)/g,
    ];
    
    for (const pattern of locationPatterns) {
      const matches = desc.match(pattern);
      if (matches) {
        const match = matches[0];
        let location = '';
        
        if (match.includes('在') && pattern === locationPatterns[0]) {
          location = match.replace(/在|會議|開會|見面|討論|聚會/g, '').trim();
        } else if (match.includes('地點')) {
          location = match.split(/[:：]/)[1]?.trim() || '';
        } else {
          location = match;
        }
        
        if (location && location.length > 0) {
          return location;
        }
      }
    }
    return null;
  };

  // AI推斷行程類型
  const inferTypeFromDescription = (desc: string): 'meeting' | 'call' | 'activity' | 'other' => {
    const lowerDesc = desc.toLowerCase();
    if (lowerDesc.includes('電話') || lowerDesc.includes('通話') || lowerDesc.includes('視訊')) {
      return 'call';
    } else if (lowerDesc.includes('活動') || lowerDesc.includes('聚會') || lowerDesc.includes('餐會')) {
      return 'activity';
    } else if (lowerDesc.includes('會議') || lowerDesc.includes('討論') || lowerDesc.includes('簡報')) {
      return 'meeting';
    }
    return 'other';
  };

  // 從名片夾中提取參與者（模擬名片夾資料）
  const extractAttendeesFromDescription = (desc: string): Attendee[] => {
    // 模擬名片夾中的聯絡人資料
    const mockContacts = [
      { id: '1', name: '張小明', email: 'zhang@example.com', company: 'ABC公司', relationship: '潛在客戶' },
      { id: '2', name: '李小華', email: 'li@example.com', company: 'ABC公司', relationship: '決策者' },
      { id: '3', name: '王大成', email: 'wang@example.com', company: 'XYZ企業', relationship: '現有客戶' },
      { id: '4', name: '陳小美', email: 'chen@example.com', company: '123科技', relationship: '聯絡人' },
      { id: '5', name: '林志明', email: 'lin@example.com', company: '123科技', relationship: '主管' },
      { id: '6', name: '黃大華', email: 'huang@example.com', company: 'DEF集團', relationship: '合作夥伴' },
    ];

    const foundAttendees: Attendee[] = [];
    
    // 尋找姓名匹配
    mockContacts.forEach(contact => {
      if (desc.includes(contact.name)) {
        foundAttendees.push(contact);
      }
    });
    
    // 尋找公司匹配
    if (foundAttendees.length === 0) {
      mockContacts.forEach(contact => {
        if (contact.company && desc.includes(contact.company)) {
          foundAttendees.push(contact);
        }
      });
    }
    
    return foundAttendees;
  };

  // 生成會議標題
  const generateTitleFromDescription = (desc: string, attendees: Attendee[]): string => {
    const lowerDesc = desc.toLowerCase();
    
    if (attendees.length > 0) {
      if (attendees.length === 1) {
        const attendee = attendees[0];
        if (lowerDesc.includes('產品') || lowerDesc.includes('報價')) {
          return `與${attendee.name}討論產品報價`;
        } else if (lowerDesc.includes('合作') || lowerDesc.includes('合約')) {
          return `與${attendee.name}的合作洽談`;
        } else if (lowerDesc.includes('技術') || lowerDesc.includes('系統')) {
          return `${attendee.name}技術會議`;
        } else {
          return `與${attendee.name}的會議`;
        }
      } else {
        return `多方會議 (${attendees.length} 位參與者)`;
      }
    }
    
    if (lowerDesc.includes('產品') || lowerDesc.includes('報價')) {
      return '產品報價討論會議';
    } else if (lowerDesc.includes('技術') || lowerDesc.includes('系統')) {
      return '技術討論會議';
    } else if (lowerDesc.includes('合作') || lowerDesc.includes('合約')) {
      return '合作洽談會議';
    }
    
    return '商務會議';
  };

  if (showEmailComposer) {
    return (
      <EmailComposer 
        onClose={() => setShowEmailComposer(false)} 
        selectedRecipients={selectedEmailRecipients}
      />
    );
  }

  if (showRecipientSelector) {
    return (
      <RecipientSelector 
        onClose={() => setShowRecipientSelector(false)}
        onRecipientsSelected={(recipients) => {
          setSelectedEmailRecipients(recipients);
          setShowRecipientSelector(false);
          setShowEmailComposer(true);
        }}
      />
    );
  }

  if (showCalendar) {
    return (
      <CalendarView 
        onClose={() => setShowCalendar(false)} 
        meetings={meetings}
        onDateSelect={handleCalendarDateSelect}
        onEditMeeting={handleEditMeeting}
      />
    );
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
            <span className="text-xs">新增行程</span>
          </Button>
          <Button
            onClick={() => setShowRecipientSelector(true)}
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
                      <span>{meeting.type === 'meeting' ? '會議' : meeting.type === 'call' ? '通話' : meeting.type === 'activity' ? '活動' : '其他'}</span>
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
                    className="h-8 w-8 p-0"
                    title="提醒"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => sendMeetingInvite(meeting)}
                    className="h-8 w-8 p-0"
                    title="邀請"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditMeeting(meeting)}
                    className="h-8 w-8 p-0"
                    title="編輯"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteMeeting(meeting.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:border-red-300"
                    title="刪除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-bold text-gray-800 mb-3">本月統計</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div 
              className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
              onClick={() => setShowHistoryModal('completed')}
            >
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs text-gray-600">已完成會議</div>
            </div>
            <div 
              className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
              onClick={() => setShowHistoryModal('upcoming')}
            >
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-xs text-gray-600">待進行會議</div>
            </div>
            <div 
              className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
              onClick={() => setShowHistoryModal('emails')}
            >
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
              {/* AI 智能輸入 */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium text-purple-800">AI 智能輸入</h4>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAIInput(!showAIInput)}
                    className="text-xs"
                  >
                    {showAIInput ? '關閉' : '開始'}
                  </Button>
                </div>
                
                {showAIInput && (
                  <div className="space-y-3">
                    <p className="text-sm text-purple-700">
                      💡 您可以說：「明天下午2點和張小明討論產品報價，在台北辦公室」
                    </p>
                    <div className="relative">
                      <Textarea
                        placeholder="請描述您的行程安排，AI會自動解析時間、地點、參與者等資訊..."
                        className="pr-10"
                        rows={3}
                        value={aiInputText}
                        onChange={(e) => {
                          setAiInputText(e.target.value);
                          handleAIAnalysis(e.target.value);
                        }}
                      />
                      <div className="absolute right-2 top-2">
                        <VoiceInput 
                          onResult={(text) => {
                            setAiInputText(text);
                            handleAIAnalysis(text);
                          }}
                        />
                      </div>
                    </div>

                    {/* AI 分析結果預覽 */}
                    {aiAnalysisResult && (
                      <div className="bg-white border border-purple-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-purple-800">AI 分析結果</span>
                            <Badge variant="secondary" className="text-xs">
                              信心度 {Math.round((aiAnalysisResult.confidence || 0) * 100)}%
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setAiAnalysisResult(null);
                                setAiInputText('');
                              }}
                              className="text-xs"
                            >
                              重新分析
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleApplyAIAnalysis}
                              className="text-xs bg-purple-600 hover:bg-purple-700"
                            >
                              套用結果
                            </Button>
                          </div>
                        </div>

                        {/* 分析結果詳情 */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {aiAnalysisResult.title && (
                            <div className="col-span-2">
                              <span className="font-medium text-gray-700">標題：</span>
                              <span className="text-gray-600">{aiAnalysisResult.title}</span>
                            </div>
                          )}
                          {aiAnalysisResult.type && (
                            <div>
                              <span className="font-medium text-gray-700">類型：</span>
                              <Badge className="ml-1 text-xs">
                                {aiAnalysisResult.type === 'meeting' ? '會議' : 
                                 aiAnalysisResult.type === 'activity' ? '活動' : '事件'}
                              </Badge>
                            </div>
                          )}
                          {aiAnalysisResult.date && (
                            <div>
                              <span className="font-medium text-gray-700">日期：</span>
                              <span className="text-gray-600">{new Date(aiAnalysisResult.date).toLocaleDateString('zh-TW')}</span>
                            </div>
                          )}
                          {aiAnalysisResult.time && (
                            <div>
                              <span className="font-medium text-gray-700">時間：</span>
                              <span className="text-gray-600">{aiAnalysisResult.time}</span>
                            </div>
                          )}
                          {aiAnalysisResult.location && (
                            <div>
                              <span className="font-medium text-gray-700">地點：</span>
                              <span className="text-gray-600">{aiAnalysisResult.location}</span>
                            </div>
                          )}
                          {aiAnalysisResult.attendees && aiAnalysisResult.attendees.length > 0 && (
                            <div className="col-span-2">
                              <span className="font-medium text-gray-700">參與者：</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {aiAnalysisResult.attendees.map((attendee, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {attendee.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 類型快捷選擇 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  類型
                </label>
                <div className="flex space-x-2">
                  {[
                    { value: 'meeting', label: '會議', icon: Users },
                    { value: 'call', label: '通話', icon: Bell },
                    { value: 'activity', label: '活動', icon: Calendar },
                    { value: 'other', label: '其他', icon: Clock }
                  ].map(({ value, label, icon: Icon }) => (
                    <Button
                      key={value}
                      type="button"
                      variant={newMeeting.type === value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewMeeting(prev => ({ ...prev, type: value as Meeting['type'] }))}
                      className="flex items-center space-x-1"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <AttendeeManager
                attendees={newMeeting.attendees}
                onAttendeesChange={handleAttendeesChange}
              />

              {newMeeting.attendees.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 mb-2">💡 根據參與者建議：</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const suggestions = generateMeetingSuggestions(newMeeting.attendees);
                      setNewMeeting(prev => ({
                        ...prev,
                        title: suggestions.title,
                        description: suggestions.description
                      }));
                    }}
                    className="text-xs"
                  >
                    使用建議標題與描述
                  </Button>
                </div>
              )}
              
              <div>
                <div className="relative">
                  <Input
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="輸入會議標題"
                    className="pr-10"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <VoiceInput 
                      onResult={(text) => setNewMeeting(prev => ({ ...prev, title: text }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="relative">
                  <textarea
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="描述會議目的、議程等"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm pr-10"
                    rows={3}
                  />
                  <div className="absolute right-2 top-2">
                    <VoiceInput 
                      onResult={(text) => setNewMeeting(prev => ({ ...prev, description: text }))}
                    />
                  </div>
                </div>
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
                <div className="relative">
                  <Input
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="會議地點或線上會議連結"
                    className="pr-10"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <VoiceInput 
                      onResult={(text) => setNewMeeting(prev => ({ ...prev, location: text }))}
                    />
                  </div>
                </div>
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

      {/* History Modals */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white w-full h-full overflow-y-auto">{/* LINE OA 聊天室尺寸 */}
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0">
              <h3 className="text-lg font-bold text-gray-800">
                {showHistoryModal === 'completed' && '已完成會議列表'}
                {showHistoryModal === 'upcoming' && '待進行會議列表'}
                {showHistoryModal === 'emails' && '發送信件列表'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistoryModal(null)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3">
              {showHistoryModal === 'completed' && (
                <>
                  <div className="text-sm text-gray-600 mb-3">
                    本月完成 12 場會議
                  </div>
                  {meetings.filter(m => m.status === 'completed').map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleHistoryItemClick(meeting, 'meeting')}
                    >
                      <div className="font-medium text-gray-800">{meeting.title}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(meeting.date).toLocaleDateString('zh-TW')} {meeting.time}
                      </div>
                      <div className="text-xs text-green-600 mt-1">✓ 已完成</div>
                    </div>
                  ))}
                  {/* 補充一些模擬的已完成會議 */}
                  <div 
                    className="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleHistoryItemClick({
                      title: '與ABC公司產品討論',
                      date: '2024-01-10',
                      time: '14:00',
                      status: 'completed'
                    }, 'meeting')}
                  >
                    <div className="font-medium text-gray-800">與ABC公司產品討論</div>
                    <div className="text-sm text-gray-600">2024/01/10 14:00</div>
                    <div className="text-xs text-green-600 mt-1">✓ 已完成</div>
                  </div>
                  <div 
                    className="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleHistoryItemClick({
                      title: '技術團隊月會',
                      date: '2024-01-08',
                      time: '10:00',
                      status: 'completed'
                    }, 'meeting')}
                  >
                    <div className="font-medium text-gray-800">技術團隊月會</div>
                    <div className="text-sm text-gray-600">2024/01/08 10:00</div>
                    <div className="text-xs text-green-600 mt-1">✓ 已完成</div>
                  </div>
                </>
              )}

              {showHistoryModal === 'upcoming' && (
                <>
                  <div className="text-sm text-gray-600 mb-3">
                    即將進行 8 場會議
                  </div>
                  {meetings.filter(m => m.status === 'scheduled').map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleHistoryItemClick(meeting, 'meeting')}
                    >
                      <div className="font-medium text-gray-800">{meeting.title}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(meeting.date).toLocaleDateString('zh-TW')} {meeting.time}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">⏱ 待進行</div>
                    </div>
                  ))}
                  {/* 補充一些模擬的待進行會議 */}
                  <div 
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleHistoryItemClick({
                      title: '季度業績檢討',
                      date: '2024-01-20',
                      time: '15:00',
                      status: 'scheduled'
                    }, 'meeting')}
                  >
                    <div className="font-medium text-gray-800">季度業績檢討</div>
                    <div className="text-sm text-gray-600">2024/01/20 15:00</div>
                    <div className="text-xs text-blue-600 mt-1">⏱ 待進行</div>
                  </div>
                </>
              )}

              {showHistoryModal === 'emails' && (
                <>
                  <div className="text-sm text-gray-600 mb-3">
                    本月發送 25 封信件
                  </div>
                  <div 
                    className="bg-purple-50 border border-purple-200 rounded-lg p-3 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleHistoryItemClick({
                      title: '會議邀請 - 產品介紹會議',
                      recipients: 'zhang@example.com, li@example.com',
                      time: '今天 09:30'
                    }, 'email')}
                  >
                    <div className="font-medium text-gray-800">會議邀請 - 產品介紹會議</div>
                    <div className="text-sm text-gray-600">發送至: zhang@example.com, li@example.com</div>
                    <div className="text-xs text-purple-600 mt-1">📧 今天 09:30</div>
                  </div>
                  <div 
                    className="bg-purple-50 border border-purple-200 rounded-lg p-3 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleHistoryItemClick({
                      title: '跟進信件 - 合作提案',
                      recipients: 'wang@example.com',
                      time: '昨天 16:45'
                    }, 'email')}
                  >
                    <div className="font-medium text-gray-800">跟進信件 - 合作提案</div>
                    <div className="text-sm text-gray-600">發送至: wang@example.com</div>
                    <div className="text-xs text-purple-600 mt-1">📧 昨天 16:45</div>
                  </div>
                  <div 
                    className="bg-purple-50 border border-purple-200 rounded-lg p-3 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleHistoryItemClick({
                      title: '會議提醒',
                      recipients: 'chen@example.com, lin@example.com',
                      time: '2024/01/12 14:20'
                    }, 'email')}
                  >
                    <div className="font-medium text-gray-800">會議提醒</div>
                    <div className="text-sm text-gray-600">發送至: chen@example.com, lin@example.com</div>
                    <div className="text-xs text-purple-600 mt-1">📧 2024/01/12 14:20</div>
                  </div>
                </>
              )}
              
              {/* 沒有記錄時的提示 */}
              {((showHistoryModal === 'completed' && meetings.filter(m => m.status === 'completed').length === 0) ||
                (showHistoryModal === 'upcoming' && meetings.filter(m => m.status === 'scheduled').length === 0)) && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📅</div>
                  <div>暫無相關記錄</div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t bg-white p-4 sticky bottom-0">
              <Button
                onClick={() => setShowHistoryModal(null)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white"
                size="lg"
              >
                關閉
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
