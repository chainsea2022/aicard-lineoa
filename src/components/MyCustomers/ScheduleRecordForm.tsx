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
    if (!description.trim()) return;

    // AI智能生成標題和類型
    const autoTitle = title || generateTitleFromDescription(description, customerName);
    const autoType = inferTypeFromDescription(description);

    const newRecord: Omit<ScheduleRecord, 'id' | 'createdAt'> = {
      customerId,
      title: autoTitle,
      description: description.trim(),
      date: date || new Date().toISOString().split('T')[0], // 預設今天
      time: time || undefined,
      type: autoType
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

  // AI智能生成標題
  const generateTitleFromDescription = (desc: string, name: string): string => {
    const lowerDesc = desc.toLowerCase();
    if (lowerDesc.includes('會議') || lowerDesc.includes('討論')) {
      return `與${name}的會議討論`;
    } else if (lowerDesc.includes('電話') || lowerDesc.includes('通話')) {
      return `與${name}的電話會議`;
    } else if (lowerDesc.includes('拜訪') || lowerDesc.includes('見面')) {
      return `拜訪${name}`;
    } else if (lowerDesc.includes('活動') || lowerDesc.includes('聚會')) {
      return `與${name}的活動聚會`;
    }
    return `與${name}的會面`;
  };

  // AI推斷行程類型
  const inferTypeFromDescription = (desc: string): 'meeting' | 'call' | 'event' | 'other' => {
    const lowerDesc = desc.toLowerCase();
    if (lowerDesc.includes('電話') || lowerDesc.includes('通話') || lowerDesc.includes('視訊')) {
      return 'call';
    } else if (lowerDesc.includes('活動') || lowerDesc.includes('聚會') || lowerDesc.includes('餐會')) {
      return 'event';
    } else if (lowerDesc.includes('會議') || lowerDesc.includes('討論') || lowerDesc.includes('簡報')) {
      return 'meeting';
    }
    return 'other';
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
            <Mic className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Add New Record Form */}
      {isAdding && (
        <div className="bg-blue-50 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">AI智能行程記錄</span>
            <Button
              onClick={() => setIsAdding(false)}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* 簡要資訊輸入 */}
            <div className="relative">
              <Textarea
                placeholder="請輸入簡要資訊，AI將自動生成完整行程記錄..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-sm pr-10"
              />
              <Button
                onClick={handleVoiceInput}
                variant="ghost"
                size="sm"
                className={`absolute top-2 right-2 p-1 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}
                disabled={isListening}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>

            {/* AI處理狀態 */}
            {description.trim() && (
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  AI正在分析並生成行程記錄...
                </div>
                
                {/* 預覽生成的記錄 */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">標題:</span>
                    <span className="text-gray-700">{title || '與' + customerName + '的會議'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">類型:</span>
                    <Badge className={`text-xs ${getTypeColor(type)}`}>
                      {getTypeName(type)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">AI分析:</span>
                    <span className="text-gray-600">基於內容自動推斷會議性質和重要程度</span>
                  </div>
                </div>
              </div>
            )}

            {/* 操作按鈕 */}
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                size="sm"
                className="text-xs flex-1"
                disabled={!description.trim()}
              >
                <Send className="w-3 h-3 mr-1" />
                AI生成記錄
              </Button>
              <Button
                onClick={() => {
                  // TODO: 同步到行程管理
                  handleSubmit();
                  // 這裡可以調用行程管理的API
                }}
                variant="outline"
                size="sm"
                className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                disabled={!description.trim()}
              >
                <Calendar className="w-3 h-3 mr-1" />
                同步行程管理
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