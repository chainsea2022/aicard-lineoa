
import React from 'react';
import { Bell, Users, Clock, MapPin, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  type: 'meeting' | 'call' | 'activity' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled';
  description?: string;
}

interface MeetingReminderProps {
  meeting: Meeting;
  onClose: () => void;
  onViewCard: (cardId: string) => void;
  onSendReminder: (attendeeId: string, type: 'email' | 'sms') => void;
}

const MeetingReminder: React.FC<MeetingReminderProps> = ({ 
  meeting, 
  onClose, 
  onViewCard, 
  onSendReminder 
}) => {
  const formatDateTime = (date: string, time: string) => {
    const meetingDate = new Date(`${date}T${time}`);
    return meetingDate.toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    });
  };

  const getTimeUntilMeeting = () => {
    const now = new Date();
    const meetingTime = new Date(`${meeting.date}T${meeting.time}`);
    const diffMs = meetingTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours < 0) return '會議已開始';
    if (diffHours === 0) return `${diffMinutes} 分鐘後開始`;
    if (diffHours < 24) return `${diffHours} 小時 ${diffMinutes} 分鐘後開始`;
    return `${Math.floor(diffHours / 24)} 天後開始`;
  };

  const getRelationshipSummary = () => {
    const relationships = meeting.attendees.reduce((acc, attendee) => {
      const rel = attendee.relationship || '聯絡人';
      acc[rel] = (acc[rel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(relationships).map(([rel, count]) => `${rel}: ${count}人`).join('、');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-orange-100 p-2 rounded-full">
            <Bell className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">會議提醒</h3>
            <p className="text-sm text-orange-600">{getTimeUntilMeeting()}</p>
          </div>
        </div>

        {/* Meeting Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-gray-800 mb-2">{meeting.title}</h4>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{formatDateTime(meeting.date, meeting.time)}</span>
            </div>
            
            {meeting.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{meeting.location}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{meeting.attendees.length} 位參與者</span>
            </div>
          </div>

          {meeting.description && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-700">{meeting.description}</p>
            </div>
          )}
        </div>

        {/* Relationship Summary */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <h5 className="font-medium text-blue-800 mb-1">關係摘要</h5>
          <p className="text-sm text-blue-700">{getRelationshipSummary()}</p>
        </div>

        {/* Attendees List */}
        <div className="mb-4">
          <h5 className="font-medium text-gray-800 mb-3">參與人員</h5>
          <div className="space-y-2">
            {meeting.attendees.map((attendee) => (
              <div key={attendee.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-800">{attendee.name}</div>
                    <div className="text-sm text-gray-600">{attendee.company}</div>
                    {attendee.relationship && (
                      <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block mt-1">
                        {attendee.relationship}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    {attendee.cardId && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => onViewCard(attendee.cardId!)}
                      >
                        <User className="w-3 h-3" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => onSendReminder(attendee.id, 'email')}
                    >
                      <Mail className="w-3 h-3" />
                    </Button>
                    {attendee.phone && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => onSendReminder(attendee.id, 'sms')}
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {attendee.email} {attendee.phone && `• ${attendee.phone}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            關閉
          </Button>
          <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600">
            開始會議
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingReminder;
