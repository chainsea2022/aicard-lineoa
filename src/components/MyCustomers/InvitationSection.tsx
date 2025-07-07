
import React from 'react';
import { Smartphone, Mail, CheckCircle, Clock, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  return (
    <div className="space-y-4">
      {/* Invitation Actions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-sm text-gray-800 mb-3 flex items-center">
          <User className="w-4 h-4 mr-2" />
          邀請加入我的名片並建立電子名片
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {/* SMS Invitation */}
          {customer.phone && (
            <div className="space-y-2">
              {!customer.invitationSent ? (
                <Button
                  onClick={handleSendSMS}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
                  size="sm"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  發送簡訊邀請
                </Button>
              ) : (
                <div className="w-full p-2 bg-green-100 rounded-md text-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-green-700">簡訊已發送</p>
                  {customer.invitationDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(customer.invitationDate)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Email Invitation */}
          {customer.email && (
            <div className="space-y-2">
              {!customer.emailInvitationSent ? (
                <Button
                  onClick={handleSendEmail}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm"
                  size="sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  發送Email邀請
                </Button>
              ) : (
                <div className="w-full p-2 bg-green-100 rounded-md text-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-green-700">Email已發送</p>
                  {customer.emailInvitationDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(customer.emailInvitationDate)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
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
