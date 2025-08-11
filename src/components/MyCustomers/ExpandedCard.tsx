import React, { useState } from 'react';
import { ChevronDown, Phone, Mail, MessageSquare, Globe, Facebook, Instagram, Star, StarOff, Trash2, Edit, Calendar, MapPin, Building, Briefcase, Clock, User, X, Brain, Eye, CalendarPlus, Mic } from 'lucide-react';
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

      {/* Tags */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-800">標籤</h4>
        
        {/* 現有標籤 */}
        {customer.tags && customer.tags.length > 0 && <div className="flex flex-wrap gap-1">
            {customer.tags.map((tag, index) => <Badge key={index} variant="secondary" className="text-xs cursor-pointer hover:bg-destructive/10" onClick={() => onRemoveTag(customer.id, tag)}>
                {tag} ×
              </Badge>)}
          </div>}
        
        {/* 新增標籤 */}
        <input type="text" placeholder="輸入標籤後按 Enter" className="w-full text-sm px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" onKeyPress={e => {
        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
          onAddTag(customer.id, e.currentTarget.value.trim());
          e.currentTarget.value = '';
        }
      }} />
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