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
interface Note {
  id: string;
  content: string;
  createdAt: string;
}

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
  const [notes, setNotes] = useState<Note[]>(() => {
    // Convert existing notes to note array format
    if (customer.notes && customer.notes.trim()) {
      return [{
        id: `note_${Date.now()}`,
        content: customer.notes,
        createdAt: new Date().toISOString()
      }];
    }
    return [];
  });
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');
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
  const [localInvitationSent, setLocalInvitationSent] = useState(customer.invitationSent || false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [localCustomer, setLocalCustomer] = useState<Customer>(customer);

  // Update local customer when props change
  useEffect(() => {
    setLocalCustomer(customer);
  }, [customer]);

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
    console.log('handleAddNewTag called', { newTagInput: newTagInput.trim(), customerId: customer.id });
    if (newTagInput.trim()) {
      console.log('Adding new tag:', newTagInput.trim());
      const newTag = newTagInput.trim();
      
      // Update local state immediately
      const updatedTags = [...(localCustomer.tags || []), newTag];
      setLocalCustomer(prev => ({ ...prev, tags: updatedTags }));
      
      onAddTag(customer.id, newTag);
      setNewTagInput('');
      setShowAddTag(false);
    }
  };

  const handleTagClick = (tag: string) => {
    console.log('handleTagClick called', { tag, customerId: customer.id });
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      console.log('Updated selected tags:', Array.from(newSet));
      return newSet;
    });
  };

  const handleRemoveSelectedTag = (tag: string) => {
    console.log('handleRemoveSelectedTag called', { tag, customerId: customer.id });
    
    // Update local state immediately
    const updatedTags = (localCustomer.tags || []).filter(t => t !== tag);
    setLocalCustomer(prev => ({ ...prev, tags: updatedTags }));
    
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      newSet.delete(tag);
      return newSet;
    });
    onRemoveTag(customer.id, tag);
  };

  const handleAITagClick = (tag: string) => {
    console.log('AI tag clicked:', tag, 'customer.id:', customer.id);
    
    // Update local state immediately
    const updatedTags = [...(localCustomer.tags || []), tag];
    setLocalCustomer(prev => ({ ...prev, tags: updatedTags }));
    
    onAddTag(customer.id, tag);
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

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      const newNote: Note = {
        id: `note_${Date.now()}`,
        content: newNoteText.trim(),
        createdAt: new Date().toISOString()
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      
      // Save to customer
      const notesString = updatedNotes.map(n => n.content).join('\n');
      onSaveCustomer(customer.id, { notes: notesString });
      
      setNewNoteText('');
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.content);
  };

  const handleSaveNote = (noteId: string) => {
    if (editingNoteText.trim()) {
      const updatedNotes = notes.map(note => 
        note.id === noteId ? { ...note, content: editingNoteText.trim() } : note
      );
      setNotes(updatedNotes);
      
      // Save to customer
      const notesString = updatedNotes.map(n => n.content).join('\n');
      onSaveCustomer(customer.id, { notes: notesString });
      
      setEditingNoteId(null);
      setEditingNoteText('');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    // Save to customer
    const notesString = updatedNotes.map(n => n.content).join('\n');
    onSaveCustomer(customer.id, { notes: notesString });
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
    const timestampedText = `[${timeStamp}語音] ${text}`;
    setNewNoteText(timestampedText);
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

      {/* Contact Information - Only show if LINE ID exists */}
      {customer.line && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-gray-800">聯絡資訊</h4>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm">LINE: {customer.line}</span>
            </div>
            <Button onClick={() => onLineClick(customer.line)} variant="outline" size="sm" className="text-xs">
              開啟
            </Button>
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-800">備註</h4>
        </div>
        
        {/* Add new note input */}
        <div className="relative">
          <Input 
            value={newNoteText} 
            onChange={e => setNewNoteText(e.target.value)}
            placeholder="快速新增備註..." 
            className="text-sm pr-20"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newNoteText.trim()) {
                handleAddNote();
              }
            }}
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center space-x-1">
            <VoiceInput 
              onResult={(text) => {
                setNewNoteText(text);
                setTimeout(() => handleAddNote(), 100);
              }}
              className="p-1"
            />
            <Button 
              onClick={handleAddNote}
              size="sm" 
              variant="ghost" 
              className="p-1 h-auto"
              disabled={!newNoteText.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notes list */}
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded p-2 group hover:bg-gray-50 transition-colors">
              {editingNoteId === note.id ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Textarea 
                      value={editingNoteText} 
                      onChange={e => setEditingNoteText(e.target.value)}
                      className="text-sm pr-10"
                      rows={2}
                    />
                    <div className="absolute top-2 right-2">
                      <VoiceInput 
                        onResult={(text) => setEditingNoteText(text)}
                        className="p-1"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleSaveNote(note.id)} size="sm" className="text-xs">
                      儲存
                    </Button>
                    <Button 
                      onClick={() => {
                        setEditingNoteId(null);
                        setEditingNoteText('');
                      }} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                    >
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-700 flex-1 cursor-pointer" onClick={() => handleEditNote(note)}>
                    {note.content}
                  </p>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={() => handleEditNote(note)}
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                    >
                      <Edit className="w-3 h-3 text-gray-400" />
                    </Button>
                    <Button 
                      onClick={() => handleDeleteNote(note.id)}
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {notes.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-2">尚無備註，點擊上方輸入框新增</p>
          )}
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
              
              <p className="text-sm text-gray-600 mb-4">
                Hi 👋 我想邀請你加入 AiCard 名片人脈圈，立即加入 AiCard 名片人脈圈，開始建立人脈關係👉 https://aicard.ai/invite?referral=甲的ID
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  // Update customer invitation status
                  onSaveCustomer(customer.id, { invitationSent: true, invitationDate: new Date().toISOString() });
                  
                  // Update local state immediately for UI feedback
                  setLocalInvitationSent(true);
                  
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
        {(localCustomer.tags && localCustomer.tags.length > 0) && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {localCustomer.tags.map((tag, index) => {
              const isSelected = selectedTags.has(tag);
              return (
                <div key={`selected-${index}`} className="relative flex-shrink-0 group">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs cursor-pointer px-3 py-1 rounded-full transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                  {isSelected && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSelectedTag(tag);
                      }}
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full transition-opacity"
                    >
                      <X className="w-2 h-2" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* AI 自動生成標籤 - 第二行 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {generateAutoTags().filter(tag => !localCustomer.tags?.includes(tag)).map((tag, index) => (
            <div key={`ai-${index}`} className="relative flex-shrink-0 group">
              <Badge 
                variant="outline" 
                className="text-xs bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 cursor-pointer px-3 py-1 rounded-full transition-colors"
                onClick={() => handleAITagClick(tag)}
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