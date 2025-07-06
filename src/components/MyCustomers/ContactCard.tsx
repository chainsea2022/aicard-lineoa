
import React from 'react';
import { ChevronRight, MessageSquare, Phone, Mail, Clock, Send } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Customer } from './types';
import { getRandomProfessionalAvatar } from './utils';

interface ContactCardProps {
  customer: Customer;
  onClick: () => void;
  onSendInvitation?: (customerId: number, type: 'sms' | 'email') => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  customer,
  onClick,
  onSendInvitation
}) => {
  const formatInvitationDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-TW');
  };

  const isInvited = customer.invitationSent || customer.emailInvitationSent;

  const handleInvitation = (e: React.MouseEvent, type: 'sms' | 'email') => {
    e.stopPropagation();
    if (onSendInvitation) {
      onSendInvitation(customer.id, type);
    }
  };

  return (
    <Card className="mb-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md bg-white border border-gray-200" onClick={onClick}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-10 h-10 flex-shrink-0 border border-gray-300">
              <AvatarImage src={customer.photo || getRandomProfessionalAvatar(customer.id)} alt={customer.name} />
              <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white font-bold text-sm">
                {customer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {/* 綠色圓圈表示已邀請 */}
            {isInvited && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-800 truncate">{customer.name}</h3>
                
                {/* 聯絡方式圖示 */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {customer.phone && (
                    <div className="p-1 rounded-full bg-blue-50" title="有電話">
                      <Phone className="w-3 h-3 text-blue-500" />
                    </div>
                  )}
                  {customer.email && (
                    <div className="p-1 rounded-full bg-gray-50" title="有Email">
                      <Mail className="w-3 h-3 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 flex-shrink-0">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="text-xs text-gray-600 truncate mb-1">
              {customer.company && customer.jobTitle 
                ? `${customer.company} · ${customer.jobTitle}` 
                : customer.company || customer.jobTitle || '無公司資訊'
              }
            </div>
            
            {/* 邀請狀態和按鈕 */}
            <div className="flex items-center justify-between">
              {isInvited ? (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <Clock className="w-3 h-3" />
                  <span>
                    {customer.invitationSent && customer.emailInvitationSent 
                      ? '已發送簡訊及Email邀請' 
                      : customer.invitationSent 
                        ? '已發送簡訊邀請' 
                        : '已發送Email邀請'
                    }
                  </span>
                  {(customer.invitationDate || customer.emailInvitationDate) && (
                    <span className="text-gray-400">
                      · {formatInvitationDate(customer.invitationDate || customer.emailInvitationDate)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={(e) => handleInvitation(e, 'sms')}
                    size="sm"
                    variant="outline"
                    className="text-xs h-6 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    簡訊邀請
                  </Button>
                  <Button
                    onClick={(e) => handleInvitation(e, 'email')}
                    size="sm"
                    variant="outline"
                    className="text-xs h-6 px-2 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Email邀請
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
