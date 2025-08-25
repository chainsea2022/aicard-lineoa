import React, { useState } from 'react';
import { ArrowLeft, X, MessageSquare, Send, Instagram, Copy, Mail, Phone, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ExpandedCard } from './ExpandedCard';
import { Customer } from './types';

interface CustomerDetailPageProps {
  customer: Customer;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
  onAddFollower: (id: number) => void;
  onPhoneClick: (phone: string) => void;
  onLineClick: (lineId: string) => void;
  onSendInvitation: (id: number, type: 'sms' | 'email') => void;
  onSaveCustomer: (customerId: number, updates: Partial<Customer>) => void;
  onDeleteCustomer: (id: number) => void;
  activeSection: 'cards' | 'contacts';
}

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  customer,
  onClose,
  onToggleFavorite,
  onAddFollower,
  onPhoneClick,
  onLineClick,
  onSendInvitation,
  onSaveCustomer,
  onDeleteCustomer,
  activeSection
}) => {
  const [sentInvitations, setSentInvitations] = useState<Record<string, boolean>>({});
  const [showInvitationHistory, setShowInvitationHistory] = useState(false);

  const handleInvitation = async (type: string) => {
    try {
      switch (type) {
        case 'line':
          // LINE分享邀請
          if (window.liff) {
            await window.liff.shareTargetPicker([
              {
                type: 'text',
                text: `嗨！我想邀請你使用電子名片，點擊連結註冊：https://example.com/invite?id=${customer.id}`
              }
            ]);
          } else {
            // 非LINE環境，複製連結
            await navigator.clipboard.writeText(`https://example.com/invite?id=${customer.id}`);
            toast.success('邀請連結已複製到剪貼簿');
          }
          break;
        
        case 'messenger':
          // Messenger分享
          const messengerUrl = `https://www.messenger.com/t/?link=${encodeURIComponent(`https://example.com/invite?id=${customer.id}`)}&app_id=YOUR_APP_ID`;
          window.open(messengerUrl, '_blank');
          break;
        
        case 'instagram':
          // Instagram分享（複製連結，用戶手動分享）
          await navigator.clipboard.writeText(`https://example.com/invite?id=${customer.id}`);
          toast.success('邀請連結已複製，請到Instagram分享給聯絡人');
          break;
        
        case 'copy':
          // 複製連結
          await navigator.clipboard.writeText(`https://example.com/invite?id=${customer.id}`);
          toast.success('邀請連結已複製到剪貼簿');
          break;
        
        case 'sms':
          // 簡訊邀請
          onSendInvitation(customer.id, 'sms');
          break;
        
        case 'email':
          // 郵件邀請
          onSendInvitation(customer.id, 'email');
          break;
      }
      
      // 標記為已發送
      setSentInvitations(prev => ({ ...prev, [type]: true }));
      
      // 更新客戶資料中的邀請狀態
      const invitationData = {
        [`${type}InvitationSent`]: true,
        [`${type}InvitationDate`]: new Date().toISOString()
      };
      onSaveCustomer(customer.id, invitationData);
      
    } catch (error) {
      console.error('發送邀請失敗:', error);
      toast.error('發送邀請失敗，請重試');
    }
  };

  const InvitationButton = ({ 
    type, 
    icon: Icon, 
    color, 
    onClick 
  }: { 
    type: string; 
    icon: React.ComponentType<any>; 
    color: string; 
    onClick: () => void; 
  }) => {
    const isSent = sentInvitations[type] || customer[`${type}InvitationSent` as keyof Customer];
    
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className={`w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full ${
            isSent ? 'bg-green-50' : ''
          }`}
          onClick={onClick}
        >
          <Icon className={`w-8 h-8 ${isSent ? 'text-green-600' : color}`} />
        </Button>
        {isSent && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header - LIFF style */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">名片詳情</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Invitation Section */}
        {!customer.isRegisteredUser && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 space-y-3 bg-white mb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-gray-800">邀請聯絡人</h4>
              <div className="flex items-center space-x-2">
                <Badge className="bg-orange-500 text-white text-xs">
                  未註冊
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 p-1"
                  onClick={() => setShowInvitationHistory(!showInvitationHistory)}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  紀錄
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              透過以下方式邀請 {customer.name} 註冊電子名片
            </p>
            
            {/* Invitation History */}
            {showInvitationHistory && (
              <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                <div className="font-medium text-gray-700">邀請紀錄：</div>
                {customer.lineInvitationDate && (
                  <div className="text-gray-600">LINE: {new Date(customer.lineInvitationDate).toLocaleDateString()}</div>
                )}
                {customer.messengerInvitationDate && (
                  <div className="text-gray-600">Messenger: {new Date(customer.messengerInvitationDate).toLocaleDateString()}</div>
                )}
                {customer.instagramInvitationDate && (
                  <div className="text-gray-600">Instagram: {new Date(customer.instagramInvitationDate).toLocaleDateString()}</div>
                )}
                {customer.copyInvitationDate && (
                  <div className="text-gray-600">複製連結: {new Date(customer.copyInvitationDate).toLocaleDateString()}</div>
                )}
                {customer.emailInvitationDate && (
                  <div className="text-gray-600">Email: {new Date(customer.emailInvitationDate).toLocaleDateString()}</div>
                )}
                {customer.invitationDate && (
                  <div className="text-gray-600">SMS: {new Date(customer.invitationDate).toLocaleDateString()}</div>
                )}
                {!customer.lineInvitationDate && !customer.messengerInvitationDate && !customer.instagramInvitationDate && 
                 !customer.copyInvitationDate && !customer.emailInvitationDate && !customer.invitationDate && (
                  <div className="text-gray-500">尚未發送邀請</div>
                )}
              </div>
            )}
            
            {/* Invitation Action Buttons */}
            <div className="flex justify-center space-x-4">
              {/* LINE */}
              <InvitationButton
                type="line"
                icon={MessageSquare}
                color="text-green-600"
                onClick={() => handleInvitation('line')}
              />
              
              {/* Messenger */}
              <InvitationButton
                type="messenger"
                icon={Send}
                color="text-blue-500"
                onClick={() => handleInvitation('messenger')}
              />
              
              {/* Instagram */}
              <InvitationButton
                type="instagram"
                icon={Instagram}
                color="text-pink-600"
                onClick={() => handleInvitation('instagram')}
              />
              
              {/* Copy Link */}
              <InvitationButton
                type="copy"
                icon={Copy}
                color="text-gray-600"
                onClick={() => handleInvitation('copy')}
              />
              
              {/* SMS and Email - only show for customers without LINE ID */}
              {!customer.lineId && (
                <>
                  {/* SMS */}
                  <InvitationButton
                    type="sms"
                    icon={Phone}
                    color="text-blue-600"
                    onClick={() => handleInvitation('sms')}
                  />
                  
                  {/* Email */}
                  <InvitationButton
                    type="email"
                    icon={Mail}
                    color="text-red-600"
                    onClick={() => handleInvitation('email')}
                  />
                </>
              )}
            </div>
          </div>
        )}
        
        <ExpandedCard
          customer={customer}
          activeSection={activeSection}
          onToggleFavorite={onToggleFavorite}
          onAddFollower={onAddFollower}
          onIgnoreFollower={() => {}}
          onPhoneClick={onPhoneClick}
          onLineClick={onLineClick}
          onSendInvitation={onSendInvitation}
          onAddTag={(id, tag) => {
            console.log('onAddTag callback called', { id, tag, currentTags: customer.tags });
            
            // Check if tag already exists to prevent duplicates
            if (customer.tags?.includes(tag)) {
              console.log('Tag already exists, skipping addition:', tag);
              return;
            }
            
            const updatedTags = [...(customer.tags || []), tag];
            console.log('Adding new tag, updated tags array:', updatedTags);
            onSaveCustomer(id, { tags: updatedTags });
          }}
          onRemoveTag={(id, tag) => {
            console.log('onRemoveTag callback called', { id, tag, currentTags: customer.tags });
            const updatedTags = (customer.tags || []).filter(t => t !== tag);
            console.log('Updated tags array after removal:', updatedTags);
            onSaveCustomer(id, { tags: updatedTags });
          }}
          onSaveCustomer={(id, updates) => {
            console.log('CustomerDetailPage onSaveCustomer called', { id, updates });
            onSaveCustomer(id, updates);
          }}
          onDeleteCustomer={onDeleteCustomer}
          onCollapse={onClose}
        />
      </div>
    </div>
  );
};