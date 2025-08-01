import React, { useState } from 'react';
import { Plus, Calendar, Clock, Mic, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScheduleRecord } from './types';
import { useConversation } from '@11labs/react';

interface ScheduleRecordFormProps {
  customerId: number;
  customerName: string;
  scheduleRecords: ScheduleRecord[];
  onAddRecord: (record: Omit<ScheduleRecord, 'id' | 'createdAt'>) => void;
}

export const ScheduleRecordForm: React.FC<ScheduleRecordFormProps> = ({
  customerId,
  customerName,
  scheduleRecords,
  onAddRecord
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<'meeting' | 'call' | 'event' | 'other'>('meeting');
  const [isListening, setIsListening] = useState(false);

  const conversation = useConversation();

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newRecord: Omit<ScheduleRecord, 'id' | 'createdAt'> = {
      customerId,
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: time || undefined,
      type
    };

    onAddRecord(newRecord);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setType('meeting');
    setIsAdding(false);
  };

  const handleVoiceInput = async () => {
    try {
      setIsListening(true);
      
      // 請求麥克風權限
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 使用語音識別API（簡化版本）
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'zh-TW';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setDescription(prev => prev + transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        // 備用方案：直接提示用戶手動輸入
        alert('您的瀏覽器不支援語音輸入，請手動輸入');
        setIsListening(false);
      }
    } catch (error) {
      console.error('語音輸入錯誤:', error);
      setIsListening(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (recordType: string) => {
    switch (recordType) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (recordType: string) => {
    switch (recordType) {
      case 'meeting': return '會議';
      case 'call': return '通話';
      case 'event': return '活動';
      default: return '其他';
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-gray-800">行程記錄</h4>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            新增
          </Button>
        )}
      </div>

      {/* Add New Record Form */}
      {isAdding && (
        <div className="bg-blue-50 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">新增行程記錄</span>
            <Button
              onClick={() => setIsAdding(false)}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="行程標題"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
            />

            <div className="flex gap-2">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-sm flex-1"
              />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-sm flex-1"
              />
            </div>

            <div className="flex gap-1">
              {(['meeting', 'call', 'event', 'other'] as const).map((t) => (
                <Button
                  key={t}
                  onClick={() => setType(t)}
                  variant={type === t ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {getTypeName(t)}
                </Button>
              ))}
            </div>

            <div className="relative">
              <Textarea
                placeholder="行程描述..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="text-sm pr-10"
              />
              <Button
                onClick={handleVoiceInput}
                variant="ghost"
                size="sm"
                className={`absolute top-2 right-2 p-1 ${isListening ? 'text-red-500' : 'text-gray-500'}`}
                disabled={isListening}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                size="sm"
                className="text-xs flex-1"
                disabled={!title.trim()}
              >
                <Send className="w-3 h-3 mr-1" />
                儲存
              </Button>
              <Button
                onClick={() => setIsAdding(false)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Records List */}
      {scheduleRecords.length > 0 && (
        <div className="space-y-2">
          {scheduleRecords
            .filter(record => record.customerId === customerId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((record) => (
              <div key={record.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-800">{record.title}</span>
                      <Badge className={`text-xs ${getTypeColor(record.type)}`}>
                        {getTypeName(record.type)}
                      </Badge>
                    </div>
                    
                    {record.description && (
                      <p className="text-xs text-gray-600 mb-2">{record.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {record.date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(record.date)}</span>
                        </div>
                      )}
                      {record.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{record.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {scheduleRecords.filter(record => record.customerId === customerId).length === 0 && !isAdding && (
        <div className="text-center py-4 text-gray-500 text-sm">
          尚無行程記錄
        </div>
      )}
    </div>
  );
};