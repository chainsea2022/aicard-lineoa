
import React, { useState } from 'react';
import { Smartphone, Mail, CheckCircle, Clock, Calendar, User, Share2, Copy, MessageCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Customer } from './types';

interface InvitationSectionProps {
  customer: Customer;
  onSendInvitation: (id: number, type: 'sms' | 'email') => void;
  invitationHistory?: Array<{type: 'sms' | 'email', date: string, status: 'sent' | 'joined'}>;
}

export const InvitationSection: React.FC<InvitationSectionProps> = ({
  customer,
  onSendInvitation,
  invitationHistory = []
}) => {
  const [shareOpen, setShareOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendSMS = () => {
    if (customer.phone) {
      onSendInvitation(customer.id, 'sms');
    }
  };

  const handleSendEmail = () => {
    if (customer.email) {
      onSendInvitation(customer.id, 'email');
    }
  };

  const generateInviteLink = () => {
    // 生成含追蹤參數的邀請連結
    const baseUrl = window.location.origin;
    const trackingParams = `?ref=${customer.id}&type=invite`;
    return `${baseUrl}/register${trackingParams}`;
  };

  const handleLineShare = () => {
    const inviteLink = generateInviteLink();
    const text = `邀請您建立電子名片！${customer.name}想與您交換名片，點選連結立即建立：${inviteLink}`;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank');
    setShareOpen(false);
  };

  const handleMessengerShare = () => {
    const inviteLink = generateInviteLink();
    const text = `邀請您建立電子名片！${customer.name}想與您交換名片，點選連結立即建立：${inviteLink}`;
    const messengerUrl = `fb-messenger://share/?link=${encodeURIComponent(inviteLink)}&app_id=YOUR_APP_ID`;
    window.open(messengerUrl, '_blank');
    setShareOpen(false);
  };

  const handleFacebookShare = () => {
    const inviteLink = generateInviteLink();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`;
    window.open(facebookUrl, '_blank');
    setShareOpen(false);
  };

  const handleInstagramShare = () => {
    const inviteLink = generateInviteLink();
    const text = `邀請您建立電子名片！${customer.name}想與您交換名片，點選連結立即建立：${inviteLink}`;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('已複製，請貼上至 Instagram 限時動態、貼文或私訊中分享');
    });
    setShareOpen(false);
  };

  const handleCopyLink = () => {
    const inviteLink = generateInviteLink();
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('連結已複製，快貼給朋友建立人脈吧！');
    });
    setShareOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Invitation Actions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-sm text-gray-800 mb-3 flex items-center">
          <User className="w-4 h-4 mr-2" />
          邀請加入我的名片並建立電子名片
        </h4>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {/* SMS Invitation */}
          {customer.phone && (
            <div className="flex-1 min-w-0">
              {!customer.invitationSent ? (
                <Button
                  onClick={handleSendSMS}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs"
                  size="sm"
                >
                  <Smartphone className="w-4 h-4 mr-1" />
                  簡訊邀請
                </Button>
              ) : (
                <div className="w-full p-2 bg-green-100 rounded-md text-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-green-700">簡訊已發送</p>
                </div>
              )}
            </div>
          )}

          {/* Email Invitation */}
          {customer.email && (
            <div className="flex-1 min-w-0">
              {!customer.emailInvitationSent ? (
                <Button
                  onClick={handleSendEmail}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-xs"
                  size="sm"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email邀請
                </Button>
              ) : (
                <div className="w-full p-2 bg-green-100 rounded-md text-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-green-700">Email已發送</p>
                </div>
              )}
            </div>
          )}

          {/* Share Button */}
          <div className="flex-1 min-w-0">
            <Popover open={shareOpen} onOpenChange={setShareOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  分享邀請
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="center">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-800 text-center">選擇分享平台</h4>
                  
                  <div className="flex gap-1 justify-center flex-wrap">
                    {/* LINE */}
                    <Button
                      onClick={handleLineShare}
                      variant="outline"
                      size="sm"
                      className="flex flex-col h-auto py-2 px-1 text-center"
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-1">
                        <MessageCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs">LINE</span>
                    </Button>

                    {/* Messenger */}
                    <Button
                      onClick={handleMessengerShare}
                      variant="outline"
                      size="sm"
                      className="flex flex-col h-auto py-2 px-1 text-center"
                    >
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mb-1">
                        <MessageCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs">Messenger</span>
                    </Button>

                    {/* Facebook */}
                    <Button
                      onClick={handleFacebookShare}
                      variant="outline"
                      size="sm"
                      className="flex flex-col h-auto py-2 px-1 text-center"
                    >
                      <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center mb-1">
                        <span className="text-white font-bold text-xs">f</span>
                      </div>
                      <span className="text-xs">Facebook</span>
                    </Button>

                    {/* Instagram */}
                    <Button
                      onClick={handleInstagramShare}
                      variant="outline"
                      size="sm"
                      className="flex flex-col h-auto py-2 px-1 text-center"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-1">
                        <Camera className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs">Instagram</span>
                    </Button>

                    {/* Copy Link */}
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      size="sm"
                      className="flex flex-col h-auto py-2 px-1 text-center"
                    >
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center mb-1">
                        <Copy className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs">複製</span>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {(!customer.phone && !customer.email) && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">無聯絡方式，無法發送邀請</p>
            <p className="text-xs text-gray-400 mt-1">請先編輯聯絡人資料</p>
          </div>
        )}
      </div>

      {/* Invitation History */}
      {invitationHistory.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-sm text-gray-800 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            邀請紀錄
          </h4>
          
          <div className="space-y-2">
            {invitationHistory.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center space-x-2">
                  {record.type === 'sms' ? (
                    <Smartphone className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Mail className="w-4 h-4 text-green-600" />
                  )}
                  <span className="text-sm">
                    {record.type === 'sms' ? '簡訊邀請' : 'Email邀請'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={record.status === 'joined' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {record.status === 'joined' ? '已加入' : '已發送'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDate(record.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Info */}
      <div className="text-xs text-gray-500 bg-yellow-50 rounded-lg p-3">
        <p className="mb-1">💡 邀請說明：</p>
        <p>• 發送邀請後，對方建立電子名片會自動加入您的電子名片夾</p>
        <p>• 可透過邀請紀錄查看對方是否已完成建立</p>
      </div>
    </div>
  );
};
