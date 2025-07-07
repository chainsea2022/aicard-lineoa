
import React from 'react';
import { ChevronRight, MessageSquare, Phone, Mail, Smartphone, Edit, Globe } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Customer } from './types';
import { getRandomProfessionalAvatar } from './utils';

interface ContactCardProps {
  customer: Customer;
  onClick: () => void;
  onSendInvitation: (id: number, type: 'sms' | 'email') => void;
  onEdit?: (customer: Customer) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  customer,
  onClick,
  onSendInvitation,
  onEdit
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(customer);
    }
  };

  const handleSendSMS = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (customer.phone) {
      onSendInvitation(customer.id, 'sms');
    }
  };

  const handleSendEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (customer.email) {
      onSendInvitation(customer.id, 'email');
    }
  };

  const isInvited = customer.invitationSent || customer.emailInvitationSent;

  return (
    <Card className="mb-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md bg-white border border-gray-200" onClick={onClick}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 flex-shrink-0 border border-gray-300">
            <AvatarImage src={customer.photo || getRandomProfessionalAvatar(customer.id)} alt={customer.name} />
            <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white font-bold text-sm">
              {customer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-800 truncate">{customer.name}</h3>
                
                {/* Tags */}
                {customer.tags && customer.tags.length > 0 && (
                  <div className="flex space-x-1 flex-shrink-0">
                    {customer.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-1 py-0 h-4">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1 flex-shrink-0">
                {/* Edit button */}
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="編輯聯絡人"
                  >
                    <Edit className="w-3 h-3 text-gray-600" />
                  </button>
                )}
                
                {/* Contact buttons */}
                <div className="flex items-center space-x-1">
                  {customer.website && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(customer.website, '_blank');
                      }} 
                      className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors" 
                      title="開啟官網"
                    >
                      <Globe className="w-3 h-3 text-purple-600" />
                    </button>
                  )}
                  {customer.line && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }} 
                      className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors" 
                      title="開啟 LINE"
                    >
                      <MessageSquare className="w-3 h-3 text-green-600" />
                    </button>
                  )}
                  {customer.phone && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }} 
                      className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" 
                      title="撥打電話"
                    >
                      <Phone className="w-3 h-3 text-blue-600" />
                    </button>
                  )}
                </div>
                
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="text-xs text-gray-600 truncate mb-2">
              {customer.company && customer.jobTitle 
                ? `${customer.company} · ${customer.jobTitle}` 
                : customer.company || customer.jobTitle || '無公司資訊'
              }
            </div>
            
            {/* Contact information */}
            <div className="space-y-1 mb-2">
              {customer.phone && (
                <div className="flex items-center text-xs text-gray-500">
                  <Phone className="w-3 h-3 mr-1" />
                  <span className="truncate">{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center text-xs text-gray-500">
                  <Mail className="w-3 h-3 mr-1" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
            </div>
            
            {/* Invitation buttons */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {customer.phone && !customer.invitationSent && (
                  <Button 
                    onClick={handleSendSMS}
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-6 px-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Smartphone className="w-3 h-3 mr-1" />
                    邀請簡訊
                  </Button>
                )}
                {customer.email && !customer.emailInvitationSent && (
                  <Button 
                    onClick={handleSendEmail}
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-6 px-2 border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    邀請Email
                  </Button>
                )}
              </div>
              
              {isInvited && (
                <Badge variant="secondary" className="text-xs px-2 py-0 h-5 bg-green-100 text-green-700">
                  已邀請
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
