import React, { useState } from 'react';
import { Plus, Calendar, Clock, Mic, Send, X, Trash2, Edit, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScheduleRecord } from './types';
import { useConversation } from '@11labs/react';
import VoiceInput from '../VoiceInput';

interface ScheduleRecordFormProps {
  customerId: number;
  customerName: string;
  scheduleRecords: ScheduleRecord[];
  onAddRecord: (record: Omit<ScheduleRecord, 'id' | 'createdAt'>) => void;
  onDeleteRecord?: (recordId: number) => void;
}

export const ScheduleRecordForm: React.FC<ScheduleRecordFormProps> = ({
  customerId,
  customerName,
  scheduleRecords,
  onAddRecord,
  onDeleteRecord
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
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Array<{id: string, name: string, company?: string}>>([]);
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualContactName, setManualContactName] = useState('');

  // 模擬名片夾聯絡人資料 (區分已註冊和未註冊)
  const mockContacts = [
    { id: '1', name: '張小明', company: 'ABC公司', phone: '0912-345-678', email: 'zhang@abc.com', hasCard: true },
    { id: '2', name: '李小華', company: 'ABC公司', phone: '0923-456-789', email: 'li@abc.com', hasCard: true },
    { id: '3', name: '王大成', company: 'XYZ企業', phone: '0934-567-890', email: 'wang@xyz.com', hasCard: false },
    { id: '4', name: '陳小美', company: '123科技', phone: '0945-678-901', email: 'chen@123tech.com', hasCard: true },
    { id: '5', name: '林志明', company: '123科技', phone: '0956-789-012', email: 'lin@123tech.com', hasCard: false },
    { id: '6', name: '黃大華', company: 'DEF集團', phone: '0967-890-123', email: 'huang@def.com', hasCard: true },
    { id: '7', name: '劉小琪', company: 'GHI公司', phone: '0978-901-234', email: 'liu@ghi.com', hasCard: false },
    { id: '8', name: '吳志偉', company: 'JKL企業', phone: '0989-012-345', email: 'wu@jkl.com', hasCard: true },
  ];

  // 過濾聯絡人
  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(contactSearchTerm.toLowerCase()))
  );

  // 處理手動新增聯絡人
  const handleAddManualContact = () => {
    if (!manualContactName.trim()) return;
    
    const newContact = {
      id: `manual-${Date.now()}`,
      name: manualContactName.trim(),
      company: undefined
    };
    
    setSelectedContacts(prev => [...prev, newContact]);
    setManualContactName('');
    setShowManualInput(false);
  };

  // 語音輸入聯絡人姓名
  const handleContactVoiceInput = (text: string) => {
    setContactSearchTerm(text);
  };

  const conversation = useConversation();

  const handleSubmit = () => {
    if (!description.trim()) return;

    // AI智能生成標題和類型
    const autoTitle = title || generateTitleFromDescription(description, customerName);
    const autoType = inferTypeFromDescription(description);
    
    // AI智能提取時間和地點
    const extractedDateTime = extractDateTimeFromDescription(description);
    const extractedLocation = extractLocationFromDescription(description);

    // 建構包含聯絡人資訊的描述
    let finalDescription = description.trim();
    if (selectedContacts.length > 0) {
      const contactsInfo = selectedContacts.map(contact => 
        `${contact.name}${contact.company ? ` (${contact.company})` : ''}`
      ).join('、');
      finalDescription = `${finalDescription}\n參與者：${contactsInfo}`;
    }
    if (extractedLocation) {
      finalDescription = `${finalDescription}\n地點：${extractedLocation}`;
    }

    const newRecord: Omit<ScheduleRecord, 'id' | 'createdAt'> = {
      customerId,
      title: autoTitle,
      description: finalDescription,
      date: extractedDateTime.date || date || new Date().toISOString().split('T')[0],
      time: extractedDateTime.time || time || undefined,
      type: autoType
    };

    onAddRecord(newRecord);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setType('meeting');
    setSelectedContacts([]);
    setShowContactSelector(false);
    setIsAdding(false);
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
    } else if (desc.includes('下個月')) {
      targetDate.setMonth(today.getMonth() + 1);
      result.date = targetDate.toISOString().split('T')[0];
    }
    
    // 提取具體日期
    const dateMatches = desc.match(/(\d{1,2})月(\d{1,2})[日號]/);
    if (dateMatches) {
      const month = parseInt(dateMatches[1]) - 1; // JavaScript月份從0開始
      const day = parseInt(dateMatches[2]);
      targetDate.setMonth(month);
      targetDate.setDate(day);
      result.date = targetDate.toISOString().split('T')[0];
    }
    
    // 提取時間 - 修正邏輯
    const timePatterns = [
      /(上午|早上)\s*(\d{1,2})[點時](\d{1,2})?分?/,  // 上午9點、早上9點30分
      /(下午|晚上)\s*(\d{1,2})[點時](\d{1,2})?分?/,  // 下午2點、晚上8點30分
      /中午\s*(\d{1,2})?[點時]?(\d{1,2})?分?/,       // 中午、中午12點
      /(\d{1,2})[點時](\d{1,2})?分?/,               // 4點、14點30分
      /(\d{1,2}):(\d{2})/,                        // 14:30
    ];
    
    for (const pattern of timePatterns) {
      const match = desc.match(pattern);
      if (match) {
        let hour = 0;
        let minute = 0;
        
        if (match[0].includes('上午') || match[0].includes('早上')) {
          hour = parseInt(match[2]);
          minute = parseInt(match[3] || '0');
          // 處理12點上午的情況
          if (hour === 12) hour = 0;
        } else if (match[0].includes('下午') || match[0].includes('晚上')) {
          hour = parseInt(match[2]);
          minute = parseInt(match[3] || '0');
          // 下午時間轉換為24小時制
          if (hour !== 12) hour += 12;
        } else if (match[0].includes('中午')) {
          hour = 12;
          minute = parseInt(match[2] || '0');
        } else if (match[2] && match[1]) {
          // 格式如 14:30
          hour = parseInt(match[1]);
          minute = parseInt(match[2]);
        } else {
          // 格式如 4點，需要判斷是上午還是下午
          hour = parseInt(match[1]);
          minute = parseInt(match[2] || '0');
          
          // 如果是1-6點且沒有明確指定上午，可能是下午
          if (hour >= 1 && hour <= 6 && !desc.includes('上午') && !desc.includes('早上')) {
            hour += 12;
          }
          // 如果是7-11點且沒有明確指定，保持原樣（可能是上午或晚上）
        }
        
        // 確保時間格式正確
        if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
          result.time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }
        break;
      }
    }
    
    return result;
  };

  // AI智能生成標題
  const generateTitleFromDescription = (desc: string, name: string): string => {
    const lowerDesc = desc.toLowerCase();
    
    // 提取關鍵詞和重點
    const keywords = extractKeywords(desc);
    const timeKeywords = extractTimeKeywords(desc);
    const topicKeywords = extractTopicKeywords(desc);
    
    // 根據內容類型和關鍵詞生成具體標題
    if (lowerDesc.includes('產品') || lowerDesc.includes('方案') || lowerDesc.includes('提案')) {
      const product = keywords.find(k => k.includes('產品') || k.includes('方案'));
      return product ? `${name}：${product}討論` : `與${name}討論產品方案`;
    } else if (lowerDesc.includes('合作') || lowerDesc.includes('合約') || lowerDesc.includes('簽約')) {
      return `與${name}的合作洽談`;
    } else if (lowerDesc.includes('報價') || lowerDesc.includes('價格') || lowerDesc.includes('費用')) {
      return `${name}報價討論會議`;
    } else if (lowerDesc.includes('技術') || lowerDesc.includes('開發') || lowerDesc.includes('系統')) {
      const tech = topicKeywords.find(k => k.includes('技術') || k.includes('系統'));
      return tech ? `${name}：${tech}技術會議` : `與${name}技術討論`;
    } else if (lowerDesc.includes('培訓') || lowerDesc.includes('教學') || lowerDesc.includes('訓練')) {
      return `${name}培訓會議`;
    } else if (lowerDesc.includes('回顧') || lowerDesc.includes('檢討') || lowerDesc.includes('總結')) {
      return `與${name}的項目回顧`;
    } else if (lowerDesc.includes('啟動') || lowerDesc.includes('開始') || lowerDesc.includes('開工')) {
      return `${name}項目啟動會議`;
    } else if (lowerDesc.includes('電話') || lowerDesc.includes('通話') || lowerDesc.includes('視訊')) {
      const topic = topicKeywords[0];
      return topic ? `${name}：${topic}電話會議` : `與${name}的電話會議`;
    } else if (lowerDesc.includes('拜訪') || lowerDesc.includes('見面') || lowerDesc.includes('會面')) {
      const purpose = topicKeywords[0];
      return purpose ? `拜訪${name}：${purpose}` : `拜訪${name}`;
    } else if (lowerDesc.includes('活動') || lowerDesc.includes('聚會') || lowerDesc.includes('餐會')) {
      const event = keywords.find(k => k.includes('活動') || k.includes('聚會'));
      return event ? `${name}：${event}` : `與${name}的活動聚會`;
    } else if (topicKeywords.length > 0) {
      // 如果有明確的主題關鍵詞，使用第一個作為標題重點
      return `與${name}討論${topicKeywords[0]}`;
    }
    
    // 預設標題，加上時間資訊讓它更具體
    const timeInfo = timeKeywords[0];
    return timeInfo ? `與${name}的${timeInfo}會議` : `與${name}的會面`;
  };

  // 提取關鍵詞
  const extractKeywords = (desc: string): string[] => {
    const keywords = [];
    const patterns = [
      /([^，,。!\n]{2,8}產品[^，,。!\n]{0,5})/g,
      /([^，,。!\n]{2,8}方案[^，,。!\n]{0,5})/g,
      /([^，,。!\n]{2,8}系統[^，,。!\n]{0,5})/g,
      /([^，,。!\n]{2,8}項目[^，,。!\n]{0,5})/g,
      /([^，,。!\n]{2,8}服務[^，,。!\n]{0,5})/g,
    ];
    
    patterns.forEach(pattern => {
      const matches = desc.match(pattern);
      if (matches) keywords.push(...matches.map(m => m.trim()));
    });
    
    return keywords;
  };

  // 提取時間相關關鍵詞
  const extractTimeKeywords = (desc: string): string[] => {
    const timeWords = ['早上', '上午', '中午', '下午', '晚上', '週一', '週二', '週三', '週四', '週五', '月底', '季度'];
    return timeWords.filter(word => desc.includes(word));
  };

  // 提取主題關鍵詞
  const extractTopicKeywords = (desc: string): string[] => {
    const topicPatterns = [
      /討論([^，,。!\n]{2,10})/g,
      /關於([^，,。!\n]{2,10})/g,
      /([^，,。!\n]{2,10})相關/g,
      /([^，,。!\n]{2,10})需求/g,
      /([^，,。!\n]{2,10})問題/g,
    ];
    
    const topics = [];
    topicPatterns.forEach(pattern => {
      const matches = desc.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const topic = match.replace(/討論|關於|相關|需求|問題/g, '').trim();
          if (topic.length > 1) topics.push(topic);
        });
      }
    });
    
    return topics;
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
      /在([^，,。!\n\s]+?)(會議|開會|見面|討論|聚會)/g,
      /([^，,。!\n\s]+?)(會議室|辦公室|餐廳|咖啡廳|公司|店)/g,
      /地點[:：]\s*([^，,。!\n]+)/g,
      /地址[:：]\s*([^，,。!\n]+)/g,
      /(台北|台中|台南|高雄|新北|桃園|新竹|嘉義|彰化|雲林|南投|苗栗|宜蘭|花蓮|台東|澎湖|金門|連江)([^，,。!\n\s]*)/g,
      /([^，,。!\n\s]+?)(大樓|廣場|中心|大廈|商場|飯店|酒店)/g,
    ];
    
    for (const pattern of locationPatterns) {
      const matches = desc.match(pattern);
      if (matches) {
        // 取第一個匹配的結果
        const match = matches[0];
        let location = '';
        
        if (match.includes('在') && pattern === locationPatterns[0]) {
          location = match.replace(/在|會議|開會|見面|討論|聚會/g, '').trim();
        } else if (match.includes('地點') || match.includes('地址')) {
          location = match.split(/[:：]/)[1]?.trim() || '';
        } else if (pattern === locationPatterns[4]) {
          // 城市匹配
          location = match;
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

  const handleDeleteRecord = (recordId: number) => {
    if (window.confirm('確定要刪除這筆行程記錄嗎？')) {
      onDeleteRecord?.(recordId);
    }
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
        <h4 className="font-medium text-sm text-gray-800">行程管理</h4>
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

            {/* 聯絡人選擇器 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">相關聯絡人</label>
                <Button
                  onClick={() => setShowContactSelector(!showContactSelector)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  {showContactSelector ? '關閉' : '選擇聯絡人'}
                </Button>
              </div>

              {/* 已選聯絡人 */}
              {selectedContacts.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedContacts.map((contact) => (
                    <Badge 
                      key={contact.id} 
                      variant="secondary" 
                      className="text-xs flex items-center gap-1"
                    >
                      <Users className="w-3 h-3" />
                      {contact.name}
                      {contact.company && (
                        <span className="text-gray-500">({contact.company})</span>
                      )}
                      <button 
                        onClick={() => setSelectedContacts(prev => 
                          prev.filter(c => c.id !== contact.id)
                        )}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* 聯絡人選擇選單 */}
              {showContactSelector && (
                <div className="bg-white border border-gray-200 rounded-lg">
                  {/* 搜尋和語音輸入 */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative mb-2">
                      <Input
                        placeholder="輸入姓名或公司名稱快速搜尋..."
                        value={contactSearchTerm}
                        onChange={(e) => setContactSearchTerm(e.target.value)}
                        className="text-sm pr-10"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <VoiceInput 
                          onResult={handleContactVoiceInput}
                          className="p-1"
                        />
                      </div>
                    </div>
                    
                    {/* 手動新增聯絡人 */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setShowManualInput(!showManualInput)}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        手動新增
                      </Button>
                      {showManualInput && (
                        <div className="flex-1 flex gap-1">
                          <Input
                            placeholder="輸入聯絡人姓名"
                            value={manualContactName}
                            onChange={(e) => setManualContactName(e.target.value)}
                            className="text-xs"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddManualContact();
                              }
                            }}
                          />
                          <Button
                            onClick={handleAddManualContact}
                            size="sm"
                            className="text-xs"
                          >
                            新增
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 聯絡人列表 */}
                  <div className="max-h-48 overflow-y-auto">
                    {/* 已註冊電子名片 */}
                    {filteredContacts.filter(contact => contact.hasCard && !selectedContacts.some(sc => sc.id === contact.id)).length > 0 && (
                      <div>
                        <div className="px-3 py-2 bg-green-50 border-b border-green-100">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-medium text-green-700">已註冊電子名片</span>
                          </div>
                        </div>
                        <div className="p-1">
                          {filteredContacts
                            .filter(contact => contact.hasCard && !selectedContacts.some(sc => sc.id === contact.id))
                            .map((contact) => (
                              <div
                                key={contact.id}
                                onClick={() => {
                                  setSelectedContacts(prev => [...prev, {
                                    id: contact.id,
                                    name: contact.name,
                                    company: contact.company
                                  }]);
                                }}
                                className="flex items-center space-x-2 p-2 hover:bg-green-50 rounded cursor-pointer border border-transparent hover:border-green-200"
                              >
                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {contact.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {contact.name}
                                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-1 rounded">電子名片</span>
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {contact.company} • {contact.phone}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* 未註冊聯絡人 */}
                    {filteredContacts.filter(contact => !contact.hasCard && !selectedContacts.some(sc => sc.id === contact.id)).length > 0 && (
                      <div>
                        <div className="px-3 py-2 bg-orange-50 border-b border-orange-100">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-xs font-medium text-orange-700">未註冊聯絡人</span>
                          </div>
                        </div>
                        <div className="p-1">
                          {filteredContacts
                            .filter(contact => !contact.hasCard && !selectedContacts.some(sc => sc.id === contact.id))
                            .map((contact) => (
                              <div
                                key={contact.id}
                                onClick={() => {
                                  setSelectedContacts(prev => [...prev, {
                                    id: contact.id,
                                    name: contact.name,
                                    company: contact.company
                                  }]);
                                }}
                                className="flex items-center space-x-2 p-2 hover:bg-orange-50 rounded cursor-pointer border border-transparent hover:border-orange-200"
                              >
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {contact.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {contact.name}
                                    <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1 rounded">一般聯絡人</span>
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {contact.company} • {contact.phone}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* 無搜尋結果 */}
                    {filteredContacts.length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        找不到相關聯絡人
                        {contactSearchTerm && (
                          <div className="mt-2">
                            <Button
                              onClick={() => {
                                setManualContactName(contactSearchTerm);
                                setShowManualInput(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              新增「{contactSearchTerm}」為聯絡人
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI處理狀態 */}
            {description.trim() && (
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  AI正在分析時間、地點並生成行程記錄...
                </div>
                
                {/* 預覽生成的記錄 */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">標題:</span>
                    <span className="text-gray-700">{generateTitleFromDescription(description, customerName)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">類型:</span>
                    <Badge className={`text-xs ${getTypeColor(inferTypeFromDescription(description))}`}>
                      {getTypeName(inferTypeFromDescription(description))}
                    </Badge>
                  </div>
                  {(() => {
                    const dateTime = extractDateTimeFromDescription(description);
                    const location = extractLocationFromDescription(description);
                    return (
                      <>
                        {dateTime.date && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">日期:</span>
                            <span className="text-gray-600">{new Date(dateTime.date).toLocaleDateString('zh-TW')}</span>
                          </div>
                        )}
                        {dateTime.time && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">時間:</span>
                            <span className="text-gray-600">{dateTime.time}</span>
                          </div>
                        )}
                        {location && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">地點:</span>
                            <span className="text-gray-600">{location}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">AI分析:</span>
                    <span className="text-gray-600">自動識別時間地點並設定行程資訊</span>
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
                <div key={record.id} className={`rounded-lg p-3 space-y-2 transition-colors border border-transparent group ${
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
                         {onDeleteRecord && (
                           <Button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleDeleteRecord(record.id);
                               handleCancelEdit();
                             }}
                             variant="outline"
                             size="sm"
                             className="text-xs text-red-500 hover:text-red-700 hover:border-red-300"
                           >
                             <Trash2 className="w-3 h-3" />
                           </Button>
                         )}
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
                        <div className="flex items-center gap-1">
                          {onDeleteRecord && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecord(record.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                         {isPast && (
                           <div className="text-xs text-gray-400">
                             記錄
                           </div>
                         )}
                       </div>
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