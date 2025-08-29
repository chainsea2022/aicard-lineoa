import React, { useState } from 'react';
import { ArrowLeft, X, MessageSquare, Send, Instagram, Copy, Mail, Phone, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
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
      const inviteUrl = `https://example.com/invite?id=${customer.id}`;
      const inviteMessage = `嗨！我想邀請你使用電子名片，點擊連結註冊：${inviteUrl}`;
      
      switch (type) {
        case 'line':
          // LINE分享邀請 - 開啟LINE App選擇好友或群組
          if (window.liff) {
            await window.liff.shareTargetPicker([
              {
                type: 'text',
                text: inviteMessage
              }
            ]);
            toast({ description: 'LINE 邀請已發送' });
          } else {
            // 非LINE環境，使用LINE URL scheme
            const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(inviteMessage)}`;
            window.open(lineUrl, '_blank');
            toast({ description: '正在開啟 LINE App' });
          }
          break;
        
        case 'messenger':
          // Messenger分享 - 跳轉至Messenger App
          const messengerUrl = `fb-messenger://share/?link=${encodeURIComponent(inviteUrl)}&app_id=YOUR_APP_ID`;
          try {
            window.location.href = messengerUrl;
            // 如果無法開啟App，則使用web版本
            setTimeout(() => {
              const webMessengerUrl = `https://www.messenger.com/t/?link=${encodeURIComponent(inviteUrl)}`;
              window.open(webMessengerUrl, '_blank');
            }, 1000);
            toast({ description: '正在開啟 Messenger App' });
          } catch (error) {
            const webMessengerUrl = `https://www.messenger.com/t/?link=${encodeURIComponent(inviteUrl)}`;
            window.open(webMessengerUrl, '_blank');
            toast({ description: '正在開啟 Messenger' });
          }
          break;
        
        case 'instagram':
          // Instagram分享 - 自動複製連結，提示用戶貼至限時動態、貼文或私訊
          await navigator.clipboard.writeText(inviteUrl);
          toast({ description: '邀請連結已複製！請到 Instagram 貼至限時動態、貼文或私訊中分享給朋友' });
          break;
        
        case 'copy':
          // 複製連結 - 自動複製邀請連結，系統提示「連結已複製」
          await navigator.clipboard.writeText(inviteUrl);
          toast({ description: '連結已複製' });
          break;
        
        case 'sms':
          // 簡訊邀請 - 開啟簡訊App，帶入預設邀請內容與連結
          const smsUrl = `sms:${customer.phone}?body=${encodeURIComponent(inviteMessage)}`;
          window.location.href = smsUrl;
          toast({ description: '正在開啟簡訊 App' });
          onSendInvitation(customer.id, 'sms');
          break;
        
        case 'email':
          // Email邀請 - 開啟內建Email App，建立邀請信草稿
          const emailSubject = '邀請您註冊電子名片';
          const emailBody = `親愛的 ${customer.name}，\n\n我想邀請您使用電子名片服務，透過數位化名片讓聯繫更便利！\n\n請點擊以下連結註冊：\n${inviteUrl}\n\n期待與您在數位名片上相會！\n\n祝好`;
          const mailtoUrl = `mailto:${customer.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
          window.location.href = mailtoUrl;
          toast({ description: '正在開啟 Email App' });
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
      toast({ description: '發送邀請失敗，請重試', variant: 'destructive' });
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
        {/* Invitation Section - 排除有LINE頭圖暱稱的用戶 */}
        {!customer.isRegisteredUser && !((customer.lineId || customer.line) && customer.photo) && (
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
                  <Clock className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              透過以下方式邀請 {customer.name} 註冊電子名片
            </p>
            
            {/* Invitation History */}
            {showInvitationHistory && (
              <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                <div className="font-medium text-gray-700">分享紀錄：</div>
                {customer.lineInvitationDate && (
                  <div className="text-gray-600">
                    <MessageSquare className="w-3 h-3 inline mr-1 text-green-600" />
                    LINE: {new Date(customer.lineInvitationDate).toLocaleDateString()}
                  </div>
                )}
                {customer.messengerInvitationDate && (
                  <div className="text-gray-600">
                    <Send className="w-3 h-3 inline mr-1 text-blue-500" />
                    Messenger: {new Date(customer.messengerInvitationDate).toLocaleDateString()}
                  </div>
                )}
                {customer.instagramInvitationDate && (
                  <div className="text-gray-600">
                    <Instagram className="w-3 h-3 inline mr-1 text-pink-600" />
                    Instagram: {new Date(customer.instagramInvitationDate).toLocaleDateString()}
                  </div>
                )}
                {customer.copyInvitationDate && (
                  <div className="text-gray-600">
                    <Copy className="w-3 h-3 inline mr-1 text-gray-600" />
                    複製連結: {new Date(customer.copyInvitationDate).toLocaleDateString()}
                  </div>
                )}
                {customer.emailInvitationDate && (
                  <div className="text-gray-600">
                    <Mail className="w-3 h-3 inline mr-1 text-red-600" />
                    Email: {new Date(customer.emailInvitationDate).toLocaleDateString()}
                  </div>
                )}
                {customer.invitationDate && (
                  <div className="text-gray-600">
                    <Phone className="w-3 h-3 inline mr-1 text-blue-600" />
                    SMS: {new Date(customer.invitationDate).toLocaleDateString()}
                  </div>
                )}
                {!customer.lineInvitationDate && !customer.messengerInvitationDate && !customer.instagramInvitationDate && 
                 !customer.copyInvitationDate && !customer.emailInvitationDate && !customer.invitationDate && (
                  <div className="text-gray-500">尚未有分享紀錄</div>
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