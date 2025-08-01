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
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [editingRecord, setEditingRecord] = useState<ScheduleRecord | null>(null);

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

  // AI提取時間資訊
  const extractTimeFromDescription = (desc: string): string | null => {
    const timePatterns = [
      /(\d{1,2}):(\d{2})/g, // 14:30
      /(\d{1,2})點(\d{1,2})?分?/g, // 2點30分
      /(上午|下午)\s?(\d{1,2}):?(\d{2})?/g, // 上午9:30
      /(早上|中午|下午|晚上)\s?(\d{1,2}):?(\d{2})?/g, // 下午2:00
    ];
    
    for (const pattern of timePatterns) {
      const match = desc.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return null;
  };

  // AI提取地點資訊
  const extractLocationFromDescription = (desc: string): string | null => {
    const locationPatterns = [
      /在([^，,。!\n]+?)(舉行|進行|開會|見面)/g,
      /地點[:：]([^，,。!\n]+)/g,
      /地址[:：]([^，,。!\n]+)/g,
      /([^，,。!\n]*會議室[^，,。!\n]*)/g,
      /([^，,。!\n]*辦公室[^，,。!\n]*)/g,
      /([^，,。!\n]*餐廳[^，,。!\n]*)/g,
      /([^，,。!\n]*咖啡廳[^，,。!\n]*)/g,
    ];
    
    for (const pattern of locationPatterns) {
      const match = desc.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  };

  // 更新描述中的地點資訊
  const updateDescriptionWithLocation = (desc: string, location: string): string => {
    if (desc.includes(location)) {
      return desc;
    }
    return `${desc}\n地點：${location}`;
  };

  const handleEditRecord = (record: ScheduleRecord) => {
    setEditingRecordId(record.id);
    
    // AI智能分析現有記錄，自動提取資訊
    const autoAnalyzedRecord = { ...record };
    
    // 如果標題為空或是預設標題，自動生成新標題
    if (!record.title || record.title.includes('與' + customerName)) {
      autoAnalyzedRecord.title = generateTitleFromDescription(record.description || '', customerName);
    }
    
    // 自動重新推斷類型
    if (record.description) {
      autoAnalyzedRecord.type = inferTypeFromDescription(record.description);
    }
    
    // 從描述中提取時間資訊
    const extractedTime = extractTimeFromDescription(record.description || '');
    if (extractedTime && !record.time) {
      autoAnalyzedRecord.time = extractedTime;
    }
    
    // 從描述中提取地點資訊
    const extractedLocation = extractLocationFromDescription(record.description || '');
    if (extractedLocation) {
      autoAnalyzedRecord.description = updateDescriptionWithLocation(record.description || '', extractedLocation);
    }
    
    setEditingRecord(autoAnalyzedRecord);
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;
    
    // 呼叫更新記錄的API
    console.log('更新記錄:', editingRecord);
    
    // 這裡應該調用實際的API來更新記錄
    // await updateScheduleRecord(editingRecord);
    
    setEditingRecordId(null);
    setEditingRecord(null);
  };

  const handleCancelEdit = () => {
    setEditingRecordId(null);
    setEditingRecord(null);
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

  // 檢查日期是否為過去
  const isPastDate = (dateString: string): boolean => {
    const recordDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate < today;
  };

  // 檢查記錄是否可編輯
  const isRecordEditable = (record: ScheduleRecord): boolean => {
    return !isPastDate(record.date);
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
                <Plus className="w-3 h-3" />
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
            .map((record) => {
              const isEditable = isRecordEditable(record);
              const isPast = isPastDate(record.date);
              
              return (
                <div key={record.id} className={`rounded-lg p-3 space-y-2 transition-colors border border-transparent ${
                  isPast 
                    ? 'bg-gray-100 border-gray-200' 
                    : isEditable 
                      ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer hover:border-blue-200' 
                      : 'bg-gray-50'
                }`}>
                  {editingRecordId === record.id && isEditable ? (
                    // 編輯模式
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">AI智能編輯行程記錄</span>
                        <Button
                          onClick={handleCancelEdit}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* AI分析提示 */}
                      <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                        <div className="flex items-center gap-2 text-xs text-blue-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          AI已自動分析並提取標題、類型、時間和地點資訊
                        </div>
                      </div>
                      
                      <Input
                        value={editingRecord?.title || ''}
                        onChange={(e) => setEditingRecord(prev => prev ? {...prev, title: e.target.value} : null)}
                        className="text-sm"
                        placeholder="行程標題"
                      />
                      
                      <Textarea
                        value={editingRecord?.description || ''}
                        onChange={(e) => setEditingRecord(prev => prev ? {...prev, description: e.target.value} : null)}
                        className="text-sm"
                        placeholder="行程描述"
                        rows={2}
                      />
                      
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={editingRecord?.date || ''}
                          onChange={(e) => setEditingRecord(prev => prev ? {...prev, date: e.target.value} : null)}
                          className="text-sm flex-1"
                        />
                        <Input
                          type="time"
                          value={editingRecord?.time || ''}
                          onChange={(e) => setEditingRecord(prev => prev ? {...prev, time: e.target.value} : null)}
                          className="text-sm flex-1"
                        />
                      </div>
                      
                      <div className="flex gap-1">
                        {(['meeting', 'call', 'event', 'other'] as const).map((t) => (
                          <Button
                            key={t}
                            onClick={() => setEditingRecord(prev => prev ? {...prev, type: t} : null)}
                            variant={editingRecord?.type === t ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
                          >
                            {getTypeName(t)}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          className="text-xs flex-1"
                        >
                          儲存更改
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // 查看模式
                    <div 
                      onClick={isEditable ? () => handleEditRecord(record) : undefined}
                      className="flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium text-sm ${isPast ? 'text-gray-600' : 'text-gray-800'}`}>
                            {record.title}
                          </span>
                          <Badge className={`text-xs ${getTypeColor(record.type)} ${isPast ? 'opacity-60' : ''}`}>
                            {getTypeName(record.type)}
                          </Badge>
                          {isPast && (
                            <Badge className="text-xs bg-gray-200 text-gray-600">
                              已完成
                            </Badge>
                          )}
                        </div>
                        
                        {record.description && (
                          <p className={`text-xs mb-2 ${isPast ? 'text-gray-500' : 'text-gray-600'}`}>
                            {record.description}
                          </p>
                        )}
                        
                        <div className={`flex items-center gap-4 text-xs ${isPast ? 'text-gray-400' : 'text-gray-500'}`}>
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
                      {isEditable && (
                        <div className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          點擊編輯
                        </div>
                      )}
                      {isPast && (
                        <div className="text-xs text-gray-400">
                          記錄
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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