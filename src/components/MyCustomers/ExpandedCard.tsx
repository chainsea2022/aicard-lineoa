import React, { useState, useEffect } from 'react';
import { ChevronDown, Phone, Mail, MessageSquare, Globe, Facebook, Instagram, Star, StarOff, Trash2, Edit, Calendar, MapPin, Building, Briefcase, Clock, User, X, Brain, Eye, CalendarPlus, Mic, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Customer } from './types';
import { InvitationSection } from './InvitationSection';
import { SmartRelationshipAnalysis } from './SmartRelationshipAnalysis';
import { ScheduleForm } from './ScheduleForm';
import { ScheduleRecordForm } from './ScheduleRecordForm';
import { ScheduleRecord } from './types';
import VoiceInput from '../VoiceInput';
import { CardEditForm } from './CardEditForm';
interface ExpandedCardProps {
  customer: Customer;
  activeSection: 'cards' | 'contacts';
  onToggleFavorite: (id: number) => void;
  onAddFollower: (id: number) => void;
  onIgnoreFollower: (id: number) => void;
  onPhoneClick: (phone: string) => void;
  onLineClick: (lineId: string) => void;
  onSendInvitation: (id: number, type: 'sms' | 'email') => void;
  onAddTag: (id: number, tag: string) => void;
  onRemoveTag: (id: number, tag: string) => void;
  onSaveCustomer: (id: number, updates: Partial<Customer>) => void;
  onDeleteCustomer: (id: number) => void;
  onCollapse: () => void;
  invitationHistory?: Array<{
    type: 'sms' | 'email';
    date: string;
    status: 'sent' | 'joined';
  }>;
}
export const ExpandedCard: React.FC<ExpandedCardProps> = ({
  customer,
  activeSection,
  onToggleFavorite,
  onAddFollower,
  onIgnoreFollower,
  onPhoneClick,
  onLineClick,
  onSendInvitation,
  onAddTag,
  onRemoveTag,
  onSaveCustomer,
  onDeleteCustomer,
  onCollapse,
  invitationHistory = []
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(customer.notes || '');
  const [showSmartAnalysis, setShowSmartAnalysis] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState({
    name: customer.name || '',
    company: customer.company || '',
    jobTitle: customer.jobTitle || '',
    phone: customer.phone || '',
    email: customer.email || '',
    website: customer.website || '',
    line: customer.line || '',
    facebook: customer.facebook || '',
    instagram: customer.instagram || ''
  });
  const [scheduleRecords, setScheduleRecords] = useState<ScheduleRecord[]>([]);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // 智能自動生成標籤
  const generateAutoTags = (): string[] => {
    const autoTags: string[] = [];
    
    // 公司名稱標籤
    if (customer.company) {
      autoTags.push(customer.company);
    }
    
    // 職稱標籤 - 拆分職稱，例如「業務經理」→「業務」、「經理」
    if (customer.jobTitle) {
      const jobParts = customer.jobTitle.split(/[·・\s]+/);
      jobParts.forEach(part => {
        if (part.includes('經理')) autoTags.push('經理');
        if (part.includes('業務')) autoTags.push('業務');
        if (part.includes('主管')) autoTags.push('主管');
        if (part.includes('專員')) autoTags.push('專員');
        if (part.includes('總監')) autoTags.push('總監');
        if (part.includes('副總')) autoTags.push('副總');
        if (part.includes('執行長') || part.includes('CEO')) autoTags.push('高階主管');
        if (part.includes('工程師')) autoTags.push('工程師');
        if (part.includes('設計師')) autoTags.push('設計師');
      });
    }
    
    // 事件標籤 (模擬，實際應從事件系統獲取)
    // 例如：從活動、會議、展覽等來源
    const eventTags = ['2024數位轉型論壇', 'AI科技展']; // 這應該從實際事件系統獲取
    autoTags.push(...eventTags);
    
    // 行程管理標籤 (模擬，實際應從行程系統獲取)
    if (scheduleRecords.length > 0) {
      scheduleRecords.forEach(record => {
        if (record.title) {
          autoTags.push(record.title);
        }
      });
    }
    
    return [...new Set(autoTags)]; // 去重
  };

  const allTags = [...new Set([...(customer.tags || []), ...generateAutoTags()])];

  const handleAddNewTag = () => {
    if (newTagInput.trim()) {
      onAddTag(customer.id, newTagInput.trim());
      setNewTagInput('');
      setShowAddTag(false);
    }
  };

  const handleTagClick = (tag: string) => {
    // TODO: 實現標籤篩選功能，這裡應該觸發父組件的篩選邏輯
    console.log('Filter by tag:', tag);
  };
  const handleAddScheduleRecord = (record: Omit<ScheduleRecord, 'id' | 'createdAt'>) => {
    const newRecord: ScheduleRecord = {
      ...record,
      id: Date.now(),
      // Simple ID generation
      createdAt: new Date().toISOString()
    };
    setScheduleRecords(prev => [...prev, newRecord]);
  };
  const handleSaveNotes = () => {
    onSaveCustomer(customer.id, {
      notes: editedNotes
    });
    setIsEditingNotes(false);
  };
  const handleVoiceInput = (text: string) => {
    const now = new Date();
    const timeStamp = now.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const timestampedText = `\n[${timeStamp}語音] ${text}`;
    setEditedNotes(editedNotes + timestampedText);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFieldEdit = (field: string) => {
    setEditingField(field);
    setIsEditingContact(true);
  };

  const handleFieldSave = (field: string) => {
    const updates = { [field]: editedValues[field as keyof typeof editedValues] };
    onSaveCustomer(customer.id, updates);
    setEditingField(null);
    setIsEditingContact(false);
  };

  const handleFieldCancel = () => {
    setEditedValues({
      name: customer.name || '',
      company: customer.company || '',
      jobTitle: customer.jobTitle || '',
      phone: customer.phone || '',
      email: customer.email || '',
      website: customer.website || '',
      line: customer.line || '',
      facebook: customer.facebook || '',
      instagram: customer.instagram || ''
    });
    setEditingField(null);
    setIsEditingContact(false);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 如果顯示智慧分析，返回智慧分析組件
  if (showSmartAnalysis) {
    return <SmartRelationshipAnalysis customer={customer} onClose={() => setShowSmartAnalysis(false)} />;
  }
  return <div className="space-y-4">
      {/* Header with collapse button */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base text-gray-800">{customer.name}</h3>
        <Button onClick={onCollapse} variant="ghost" size="sm">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Basic Info */}
      <div className="space-y-3">
        {(customer.company || customer.jobTitle) && <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building className="w-4 h-4 flex-shrink-0" />
            <span>{customer.company} {customer.jobTitle && `· ${customer.jobTitle}`}</span>
          </div>}

        {customer.addedDate && <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>加入日期：{formatDate(customer.addedDate)}</span>
          </div>}
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-800">聯絡資訊</h4>
          {/* 只有電子名片才顯示編輯按鈕 */}
          {customer.hasCard && customer.isDigitalCard && !isEditingContact && (
            <Button 
              onClick={() => setIsEditingContact(true)} 
              variant="ghost" 
              size="sm" 
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-3 h-3 mr-1" />
              編輯
            </Button>
          )}
          {isEditingContact && (
            <div className="flex space-x-1">
              <Button 
                onClick={() => setIsEditingContact(false)} 
                variant="ghost" 
                size="sm" 
                className="text-xs text-green-600 hover:text-green-700"
              >
                完成
              </Button>
            </div>
          )}
        </div>
        
        {customer.phone && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Phone className="w-4 h-4 text-gray-500" />
              {editingField === 'phone' ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={editedValues.phone}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, phone: e.target.value }))}
                    className="text-sm"
                    placeholder="手機號碼"
                  />
                  <Button onClick={() => handleFieldSave('phone')} size="sm" className="text-xs">儲存</Button>
                  <Button onClick={handleFieldCancel} variant="outline" size="sm" className="text-xs">取消</Button>
                </div>
              ) : (
                <span className="text-sm cursor-pointer" onClick={() => isEditingContact && handleFieldEdit('phone')}>
                  {customer.phone}
                </span>
              )}
            </div>
            {!isEditingContact && (
              <Button onClick={() => onPhoneClick(customer.phone)} variant="outline" size="sm" className="text-xs">
                撥打
              </Button>
            )}
          </div>}

        {customer.email && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Mail className="w-4 h-4 text-gray-500" />
              {editingField === 'email' ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={editedValues.email}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, email: e.target.value }))}
                    className="text-sm"
                    placeholder="電子信箱"
                  />
                  <Button onClick={() => handleFieldSave('email')} size="sm" className="text-xs">儲存</Button>
                  <Button onClick={handleFieldCancel} variant="outline" size="sm" className="text-xs">取消</Button>
                </div>
              ) : (
                <span className="text-sm cursor-pointer" onClick={() => isEditingContact && handleFieldEdit('email')}>
                  {customer.email}
                </span>
              )}
            </div>
            {!isEditingContact && (
              <Button onClick={() => window.open(`mailto:${customer.email}`)} variant="outline" size="sm" className="text-xs">
                寄信
              </Button>
            )}
          </div>}

        {customer.line && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              {editingField === 'line' ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={editedValues.line}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, line: e.target.value }))}
                    className="text-sm"
                    placeholder="LINE ID 或完整連結"
                  />
                  <Button onClick={() => handleFieldSave('line')} size="sm" className="text-xs">儲存</Button>
                  <Button onClick={handleFieldCancel} variant="outline" size="sm" className="text-xs">取消</Button>
                </div>
              ) : (
                <span className="text-sm cursor-pointer" onClick={() => isEditingContact && handleFieldEdit('line')}>
                  LINE: {customer.line}
                </span>
              )}
            </div>
            {!isEditingContact && (
              <Button onClick={() => onLineClick(customer.line)} variant="outline" size="sm" className="text-xs">
                開啟
              </Button>
            )}
          </div>}

        {customer.website && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Globe className="w-4 h-4 text-gray-500" />
              {editingField === 'website' ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={editedValues.website}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, website: e.target.value }))}
                    className="text-sm"
                    placeholder="網站"
                  />
                  <Button onClick={() => handleFieldSave('website')} size="sm" className="text-xs">儲存</Button>
                  <Button onClick={handleFieldCancel} variant="outline" size="sm" className="text-xs">取消</Button>
                </div>
              ) : (
                <span className="text-sm cursor-pointer" onClick={() => isEditingContact && handleFieldEdit('website')}>
                  {customer.website}
                </span>
              )}
            </div>
            {!isEditingContact && (
              <Button onClick={() => window.open(customer.website, '_blank')} variant="outline" size="sm" className="text-xs">
                開啟
              </Button>
            )}
          </div>}

        {customer.facebook && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Facebook className="w-4 h-4 text-gray-500" />
              {editingField === 'facebook' ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={editedValues.facebook}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, facebook: e.target.value }))}
                    className="text-sm"
                    placeholder="Facebook 連結或用戶名"
                  />
                  <Button onClick={() => handleFieldSave('facebook')} size="sm" className="text-xs">儲存</Button>
                  <Button onClick={handleFieldCancel} variant="outline" size="sm" className="text-xs">取消</Button>
                </div>
              ) : (
                <span className="text-sm cursor-pointer" onClick={() => isEditingContact && handleFieldEdit('facebook')}>
                  {customer.facebook}
                </span>
              )}
            </div>
            {!isEditingContact && (
              <Button 
                onClick={() => {
                  if (isValidUrl(customer.facebook)) {
                    window.open(customer.facebook, '_blank');
                  } else {
                    window.open(`https://facebook.com/${customer.facebook}`, '_blank');
                  }
                }} 
                variant="outline" 
                size="sm" 
                className="text-xs"
              >
                開啟
              </Button>
            )}
          </div>}

        {customer.instagram && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Instagram className="w-4 h-4 text-gray-500" />
              {editingField === 'instagram' ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={editedValues.instagram}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, instagram: e.target.value }))}
                    className="text-sm"
                    placeholder="Instagram 連結或用戶名"
                  />
                  <Button onClick={() => handleFieldSave('instagram')} size="sm" className="text-xs">儲存</Button>
                  <Button onClick={handleFieldCancel} variant="outline" size="sm" className="text-xs">取消</Button>
                </div>
              ) : (
                <span className="text-sm cursor-pointer" onClick={() => isEditingContact && handleFieldEdit('instagram')}>
                  {customer.instagram}
                </span>
              )}
            </div>
            {!isEditingContact && (
              <Button 
                onClick={() => {
                  if (isValidUrl(customer.instagram)) {
                    window.open(customer.instagram, '_blank');
                  } else {
                    window.open(`https://instagram.com/${customer.instagram}`, '_blank');
                  }
                }} 
                variant="outline" 
                size="sm" 
                className="text-xs"
              >
                開啟
              </Button>
            )}
          </div>}

        {/* Notes Section */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-sm text-gray-800">備註</h5>
            {!isEditingNotes && <Button onClick={() => setIsEditingNotes(true)} variant="ghost" size="sm" className="text-xs">
                <Mic className="w-3 h-3" />
              </Button>}
          </div>
          
          {isEditingNotes ? <div className="space-y-2">
              <div className="relative">
                <Textarea value={editedNotes} onChange={e => setEditedNotes(e.target.value)} placeholder="輸入備註..." rows={3} className="text-sm pr-10" />
                <div className="absolute top-2 right-2">
                  <VoiceInput onResult={handleVoiceInput} placeholder="語音輸入備註" />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveNotes} size="sm" className="text-xs">
                  儲存
                </Button>
                <Button onClick={() => {
              setIsEditingNotes(false);
              setEditedNotes(customer.notes || '');
            }} variant="outline" size="sm" className="text-xs">
                  取消
                </Button>
              </div>
            </div> : <p className="text-sm text-gray-600 bg-white rounded p-2 min-h-[2.5rem] cursor-pointer" onClick={() => setIsEditingNotes(true)}>
              {customer.notes || '點擊新增備註...'}
            </p>}
        </div>
      </div>

      {/* Smart Analysis Button - 只對有電子名片的聯絡人顯示 */}
      {customer.hasCard && <div className="bg-purple-50 rounded-lg p-3">
          <Button onClick={() => setShowSmartAnalysis(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            智慧人脈分析
          </Button>
          <p className="text-xs text-purple-600 text-center mt-1">
            分析關係脈絡，生成見面話題建議
          </p>
        </div>}

      {/* For paper contacts (activeSection === 'contacts'), show invitation section */}
      {activeSection === 'contacts' && <InvitationSection customer={customer} onSendInvitation={onSendInvitation} invitationHistory={invitationHistory} />}

      {/* Smart Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-800 flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            標籤
          </h4>
          <Button 
            onClick={() => setShowAddTag(true)} 
            variant="ghost" 
            size="sm" 
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            新增
          </Button>
        </div>
        
        {/* 標籤列表 - 支援水平滾動 */}
        {allTags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allTags.map((tag, index) => {
              const isManualTag = customer.tags?.includes(tag);
              return (
                <div key={index} className="relative flex-shrink-0 group">
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer px-3 py-1 rounded-full"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                  {/* 只有手動新增的標籤才顯示刪除按鈕 */}
                  {isManualTag && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTag(customer.id, tag);
                      }}
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2 h-2" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* 新增標籤輸入框 */}
        {showAddTag && (
          <div className="flex gap-2 items-center">
            <Input
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="輸入自訂標籤"
              className="text-sm flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddNewTag();
                }
              }}
              autoFocus
            />
            <Button onClick={handleAddNewTag} size="sm" className="text-xs">
              確定
            </Button>
            <Button 
              onClick={() => {
                setShowAddTag(false);
                setNewTagInput('');
              }} 
              variant="outline" 
              size="sm" 
              className="text-xs"
            >
              取消
            </Button>
          </div>
        )}
        
        {allTags.length === 0 && !showAddTag && (
          <p className="text-xs text-gray-500 text-center py-4">
            尚無標籤，點擊上方「新增」按鈕來添加標籤
          </p>
        )}
      </div>

      {/* Schedule Records */}
      <ScheduleRecordForm customerId={customer.id} customerName={customer.name} scheduleRecords={scheduleRecords} onAddRecord={handleAddScheduleRecord} />


      {/* Business Card Recognition History */}
      {customer.hasCard && <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-800">名片辨識歷程</h4>
          <div className="bg-blue-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-blue-700">
              <Eye className="w-3 h-3" />
              <span>2024/01/15 10:30 - 首次掃描辨識</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-blue-700">
              <Eye className="w-3 h-3" />
              <span>2024/01/20 14:20 - 資料同步更新</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-blue-700">
              <Eye className="w-3 h-3" />
              <span>2024/01/25 09:15 - 聯絡資訊驗證</span>
            </div>
          </div>
        </div>}

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-gray-200">
        <div className="flex space-x-2">
          <Button onClick={() => onToggleFavorite(customer.id)} variant="outline" size="sm" className="flex-1 text-xs">
            {customer.isFavorite ? <>
                <StarOff className="w-3 h-3 mr-1" />
                取消關注
              </> : <>
                <Star className="w-3 h-3 mr-1" />
                關注
              </>}
          </Button>
          
          <Button onClick={() => onDeleteCustomer(customer.id)} variant="outline" size="sm" className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-3 h-3 mr-1" />
            刪除
          </Button>
        </div>
        
        
      </div>

      {/* Schedule Form Dialog */}
      <ScheduleForm isOpen={showScheduleForm} onClose={() => setShowScheduleForm(false)} customer={customer} />
    </div>;
};