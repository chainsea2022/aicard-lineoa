import React, { useState, useEffect } from 'react';
import { ChevronDown, Phone, Mail, MessageSquare, Globe, Facebook, Instagram, Star, StarOff, Trash2, Edit, Calendar, MapPin, Building, Briefcase, Clock, User, X, Brain, Eye, CalendarPlus, Mic, Plus, Tag, Send, Copy, CheckCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  onCollapse
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
  const [invitationStatus, setInvitationStatus] = useState<Record<string, boolean>>({});
  const [showInvitationHistory, setShowInvitationHistory] = useState(false);
  const [invitationHistory, setInvitationHistory] = useState<Record<string, string>>({});
  const [showInvitationDialog, setShowInvitationDialog] = useState(false);

  // Handle invitation actions
  const handleInvitationAction = async (type: 'sms' | 'email' | 'line' | 'messenger' | 'instagram' | 'copy') => {
    const inviteText = `您好！邀請您註冊 AiCard 電子名片，一起建立更便利的名片交換體驗。立即下載：https://aicard.app/download`;
    const currentTime = new Date().toLocaleString('zh-TW');
    
    switch (type) {
      case 'sms':
        if (customer.phone) {
          window.open(`sms:${customer.phone}?body=${encodeURIComponent(inviteText)}`, '_blank');
          setInvitationStatus(prev => ({ ...prev, sms: true }));
          setInvitationHistory(prev => ({ ...prev, sms: currentTime }));
          toast({
            title: "簡訊邀請",
            description: "已開啟簡訊應用程式",
            className: "max-w-[280px] mx-auto"
          });
        }
        break;
      case 'email':
        if (customer.email) {
          const subject = "邀請您加入 AiCard 電子名片";
          const body = `${customer.name} 您好！\n\n${inviteText}\n\n期待與您在數位名片平台相見！`;
          window.open(`mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
          setInvitationStatus(prev => ({ ...prev, email: true }));
          setInvitationHistory(prev => ({ ...prev, email: currentTime }));
          toast({
            title: "Email 邀請",
            description: "已開啟郵件應用程式",
            className: "max-w-[280px] mx-auto"
          });
        }
        break;
      case 'line':
        const lineMessage = `${inviteText}`;
        window.open(`https://line.me/R/share?text=${encodeURIComponent(lineMessage)}`, '_blank');
        setInvitationStatus(prev => ({ ...prev, line: true }));
        setInvitationHistory(prev => ({ ...prev, line: currentTime }));
        toast({
          title: "LINE 邀請",
          description: "已開啟 LINE 應用程式",
          className: "max-w-[280px] mx-auto"
        });
        break;
      case 'messenger':
        window.open(`https://m.me/`, '_blank');
        setInvitationStatus(prev => ({ ...prev, messenger: true }));
        setInvitationHistory(prev => ({ ...prev, messenger: currentTime }));
        toast({
          title: "Messenger 邀請",
          description: "已開啟 Messenger 應用程式",
          className: "max-w-[280px] mx-auto"
        });
        break;
      case 'instagram':
        await navigator.clipboard.writeText(`https://aicard.app/download`);
        setInvitationStatus(prev => ({ ...prev, instagram: true }));
        setInvitationHistory(prev => ({ ...prev, instagram: currentTime }));
        toast({
          title: "連結已複製",
          description: "請貼至限時動態 / 貼文 / 私訊",
          className: "max-w-[280px] mx-auto"
        });
        break;
      case 'copy':
        await navigator.clipboard.writeText(`https://aicard.app/download`);
        setInvitationStatus(prev => ({ ...prev, copy: true }));
        setInvitationHistory(prev => ({ ...prev, copy: currentTime }));
        toast({
          title: "連結已複製",
          description: "邀請連結已複製到剪貼簿",
          className: "max-w-[280px] mx-auto"
        });
        break;
    }
  };

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
      {/* Top Invitation Box - Always visible */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 bg-white">
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 hover:bg-gray-50"
            onClick={() => {
              if (customer.invitationSent) {
                setShowInvitationHistory(true);
              } else {
                setShowInvitationDialog(true);
              }
            }}
          >
            {customer.invitationSent ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600">已邀請</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">邀請建立電子名片</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Invitation Section for Unregistered Paper Card Users */}
      {!customer.isRegisteredUser && !customer.lineId && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-800">邀請聯絡人</h4>
            <Badge className="bg-orange-500 text-white text-xs">
              未註冊
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600">
            透過以下方式邀請 {customer.name} 註冊電子名片
          </p>
          
          {/* Invitation Action Buttons - Row Layout */}
          <TooltipProvider>
            <div className="flex justify-center space-x-4">
              {/* SMS */}
              {customer.phone && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      {invitationStatus.sms && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                        onClick={() => invitationStatus.sms ? setShowInvitationHistory(true) : handleInvitationAction('sms')}
                      >
                        <Phone className="w-8 h-8 text-blue-600" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>簡訊 SMS</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Email */}
              {customer.email && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      {invitationStatus.email && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                        onClick={() => invitationStatus.email ? setShowInvitationHistory(true) : handleInvitationAction('email')}
                      >
                        <Mail className="w-8 h-8 text-red-600" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>電子郵件</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* LINE */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    {invitationStatus.line && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                      onClick={() => invitationStatus.line ? setShowInvitationHistory(true) : handleInvitationAction('line')}
                    >
                      <MessageSquare className="w-8 h-8 text-green-600" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>LINE</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Messenger */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    {invitationStatus.messenger && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                      onClick={() => invitationStatus.messenger ? setShowInvitationHistory(true) : handleInvitationAction('messenger')}
                    >
                      <Send className="w-8 h-8 text-blue-500" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Messenger</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Instagram */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    {invitationStatus.instagram && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                      onClick={() => invitationStatus.instagram ? setShowInvitationHistory(true) : handleInvitationAction('instagram')}
                    >
                      <Instagram className="w-8 h-8 text-pink-600" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Instagram</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Copy Link */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    {invitationStatus.copy && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                      onClick={() => invitationStatus.copy ? setShowInvitationHistory(true) : handleInvitationAction('copy')}
                    >
                      <Copy className="w-8 h-8 text-gray-600" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>複製連結</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      )}

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
        </div>
        
        {customer.phone && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <Button onClick={() => onPhoneClick(customer.phone)} variant="outline" size="sm" className="text-xs">
              撥打
            </Button>
          </div>}

        {customer.email && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <Button onClick={() => window.open(`mailto:${customer.email}`)} variant="outline" size="sm" className="text-xs">
              寄信
            </Button>
          </div>}

        {customer.line && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm">LINE: {customer.line}</span>
            </div>
            <Button onClick={() => onLineClick(customer.line)} variant="outline" size="sm" className="text-xs">
              開啟
            </Button>
          </div>}

        {customer.website && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm truncate">{customer.website}</span>
            </div>
            <Button onClick={() => window.open(customer.website, '_blank')} variant="outline" size="sm" className="text-xs flex-shrink-0">
              開啟
            </Button>
          </div>}

        {customer.facebook && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Facebook className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{customer.facebook}</span>
            </div>
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
          </div>}

        {customer.instagram && <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Instagram className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{customer.instagram}</span>
            </div>
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
          </div>}

        {/* Notes Section */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-sm text-gray-800">備註</h5>
            {!isEditingNotes && <Button onClick={() => setIsEditingNotes(true)} variant="ghost" size="sm" className="p-1">
                <Edit className="w-4 h-4 text-gray-600" />
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


      {/* LIFF Invitation Dialog */}
      <Dialog open={showInvitationDialog} onOpenChange={setShowInvitationDialog}>
        <DialogContent className="max-w-[300px] mx-auto">
          <DialogHeader>
            <DialogTitle>邀請您建立電子名片</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">{customer.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                邀請您建立電子名片，享受更便利的名片交換體驗
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  // Update customer invitation status
                  onSaveCustomer(customer.id, { invitationSent: true, invitationDate: new Date().toISOString() });
                  
                  // Add to invitation history
                  const currentTime = new Date().toLocaleString('zh-TW', {
                    month: '2-digit',
                    day: '2-digit', 
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  setInvitationHistory(prev => ({
                    ...prev,
                    'liff': currentTime
                  }));
                  
                  setShowInvitationDialog(false);
                  toast({
                    title: "邀請已發送",
                    description: "已成功邀請聯絡人建立電子名片",
                    className: "max-w-[280px] mx-auto"
                  });
                }}
              >
                發送邀請
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowInvitationDialog(false)}
              >
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invitation History Dialog */}
      <Dialog open={showInvitationHistory} onOpenChange={setShowInvitationHistory}>
        <DialogContent className="max-w-[300px] mx-auto">
          <DialogHeader>
            <DialogTitle>邀請紀錄</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {Object.entries(invitationHistory).map(([platform, time]) => (
              <div key={platform} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {platform === 'sms' && <Phone className="w-4 h-4 text-blue-600" />}
                  {platform === 'email' && <Mail className="w-4 h-4 text-red-600" />}
                  {platform === 'line' && <MessageSquare className="w-4 h-4 text-green-600" />}
                  {platform === 'messenger' && <Send className="w-4 h-4 text-blue-500" />}
                  {platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-600" />}
                  {platform === 'copy' && <Copy className="w-4 h-4 text-gray-600" />}
                  {platform === 'liff' && <UserPlus className="w-4 h-4 text-blue-600" />}
                  <span className="text-sm font-medium">
                    {platform === 'sms' && '簡訊'}
                    {platform === 'email' && 'Email'}
                    {platform === 'line' && 'LINE'}
                    {platform === 'messenger' && 'Messenger'}
                    {platform === 'instagram' && 'Instagram'}
                    {platform === 'copy' && '複製連結'}
                    {platform === 'liff' && '電子名片邀請'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{time}</span>
              </div>
            ))}
            {Object.keys(invitationHistory).length === 0 && (
              <p className="text-center text-gray-500 text-sm">尚無邀請紀錄</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
      {activeSection === 'contacts' && <InvitationSection customer={customer} onSendInvitation={onSendInvitation} invitationHistory={[]} />}

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
        
        {/* 已選擇的標籤 - 第一行 */}
        {(customer.tags && customer.tags.length > 0) && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {customer.tags.map((tag, index) => (
              <div key={`selected-${index}`} className="relative flex-shrink-0 group">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer px-3 py-1 rounded-full"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
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
              </div>
            ))}
          </div>
        )}

        {/* AI 自動生成標籤 - 第二行 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {generateAutoTags().filter(tag => !customer.tags?.includes(tag)).map((tag, index) => (
            <div key={`ai-${index}`} className="relative flex-shrink-0 group">
              <Badge 
                variant="outline" 
                className="text-xs bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 cursor-pointer px-3 py-1 rounded-full transition-colors"
                onClick={() => onAddTag(customer.id, tag)}
              >
                {tag}
              </Badge>
            </div>
          ))}
        </div>
        
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