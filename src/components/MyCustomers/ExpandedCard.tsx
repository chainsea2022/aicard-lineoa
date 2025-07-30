
import React, { useState } from 'react';
import { 
  ChevronDown, 
  Phone, 
  Mail, 
  MessageSquare, 
  Globe, 
  Facebook, 
  Instagram, 
  Star, 
  StarOff, 
  Trash2, 
  Edit, 
  Calendar,
  MapPin,
  Building,
  Briefcase,
  Clock,
  User,
  X,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Customer } from './types';
import { InvitationSection } from './InvitationSection';
import { SmartRelationshipAnalysis } from './SmartRelationshipAnalysis';
import VoiceInput from '../VoiceInput';

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
  onScheduleManagement: (id: number) => void;
  invitationHistory?: Array<{type: 'sms' | 'email', date: string, status: 'sent' | 'joined'}>;
  cardRecognitionHistory?: Array<{date: string, action: string, details: string}>;
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
  onScheduleManagement,
  invitationHistory = [],
  cardRecognitionHistory = []
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(customer.notes || '');
  const [showSmartAnalysis, setShowSmartAnalysis] = useState(false);

  const handleSaveNotes = () => {
    onSaveCustomer(customer.id, { notes: editedNotes });
    setIsEditingNotes(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 如果顯示智慧分析，返回智慧分析組件
  if (showSmartAnalysis) {
    return (
      <SmartRelationshipAnalysis 
        customer={customer} 
        onClose={() => setShowSmartAnalysis(false)} 
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with collapse button */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base text-gray-800">{customer.name}</h3>
        <Button onClick={onCollapse} variant="ghost" size="sm">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Basic Info */}
      <div className="space-y-3">
        {(customer.company || customer.jobTitle) && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building className="w-4 h-4 flex-shrink-0" />
            <span>{customer.company} {customer.jobTitle && `· ${customer.jobTitle}`}</span>
          </div>
        )}

        {customer.addedDate && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>加入日期：{formatDate(customer.addedDate)}</span>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <h4 className="font-medium text-sm text-gray-800">聯絡資訊</h4>
        
        {customer.phone && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <Button
              onClick={() => onPhoneClick(customer.phone)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              撥打
            </Button>
          </div>
        )}

        {customer.email && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <Button
              onClick={() => window.open(`mailto:${customer.email}`)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              寄信
            </Button>
          </div>
        )}

        {customer.line && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm">LINE: {customer.line}</span>
            </div>
            <Button
              onClick={() => onLineClick(customer.line)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              開啟
            </Button>
          </div>
        )}

        {customer.website && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{customer.website}</span>
            </div>
            <Button
              onClick={() => window.open(customer.website, '_blank')}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              開啟
            </Button>
          </div>
        )}
      </div>

      {/* Smart Analysis Button - 只對有電子名片的聯絡人顯示 */}
      {customer.hasCard && (
        <div className="bg-purple-50 rounded-lg p-3">
          <Button 
            onClick={() => setShowSmartAnalysis(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            <Brain className="w-4 h-4 mr-2" />
            智慧人脈分析
          </Button>
          <p className="text-xs text-purple-600 text-center mt-1">
            分析關係脈絡，生成見面話題建議
          </p>
        </div>
      )}

      {/* For paper contacts (activeSection === 'contacts'), show invitation section */}
      {activeSection === 'contacts' && (
        <InvitationSection
          customer={customer}
          onSendInvitation={onSendInvitation}
          invitationHistory={invitationHistory}
        />
      )}

      {/* Tags */}
      {customer.tags && customer.tags.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-800">標籤</h4>
          <div className="flex flex-wrap gap-1">
            {customer.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-gray-800">備註</h4>
          {!isEditingNotes && (
            <Button
              onClick={() => setIsEditingNotes(true)}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              <Edit className="w-3 h-3 mr-1" />
              編輯
            </Button>
          )}
        </div>
        
        {isEditingNotes ? (
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="輸入備註..."
                rows={3}
                className="text-sm pr-10"
              />
              <div className="absolute top-2 right-2">
                <VoiceInput 
                  onResult={(text) => setEditedNotes(editedNotes + text)}
                  placeholder="語音輸入備註"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSaveNotes} size="sm" className="text-xs">
                儲存
              </Button>
              <Button
                onClick={() => {
                  setIsEditingNotes(false);
                  setEditedNotes(customer.notes || '');
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
          <p className="text-sm text-gray-600 bg-gray-50 rounded p-2 min-h-[2.5rem]">
            {customer.notes || '無備註'}
          </p>
        )}
      </div>

      {/* Card Recognition History */}
      {cardRecognitionHistory.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-800">名片辨識歷程</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            {cardRecognitionHistory.map((record, index) => (
              <div key={index} className="text-xs border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{record.action}</span>
                  <span className="text-gray-500">{formatDate(record.date)}</span>
                </div>
                <p className="text-gray-600 mt-1">{record.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2 border-t border-gray-200">
        <Button
          onClick={() => onToggleFavorite(customer.id)}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          {customer.isFavorite ? (
            <>
              <StarOff className="w-3 h-3 mr-1" />
              取消關注
            </>
          ) : (
            <>
              <Star className="w-3 h-3 mr-1" />
              關注
            </>
          )}
        </Button>
        
        <Button
          onClick={() => onScheduleManagement(customer.id)}
          variant="outline"
          size="sm"
          className="flex-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Calendar className="w-3 h-3 mr-1" />
          行程管理
        </Button>
        
        <Button
          onClick={() => onDeleteCustomer(customer.id)}
          variant="outline"
          size="sm"
          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          刪除
        </Button>
      </div>
    </div>
  );
};
