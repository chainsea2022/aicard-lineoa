
import React from 'react';
import { ChevronRight, MessageSquare, Phone, Mail, Smartphone, Edit, Globe, CheckCircle, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Customer } from './types';

interface ContactCardProps {
  customer: Customer;
  onClick: () => void;
  onSendInvitation: (id: number, type: 'sms' | 'email') => void;
  onEdit?: (customer: Customer) => void;
  onToggleFavorite?: (id: number) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  customer,
  onClick,
  onSendInvitation,
  onEdit,
  onToggleFavorite
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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(customer.id);
    }
  };

  const isInvited = customer.invitationSent || customer.emailInvitationSent;

  return (
    <Card className="mb-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md bg-white border border-gray-200" onClick={onClick}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {/* First line: Name and tags */}
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
                {/* Follow button */}
                {onToggleFavorite && (
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-1 rounded-full transition-colors ${
                      customer.isFavorite 
                        ? 'bg-yellow-100 hover:bg-yellow-200' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title={customer.isFavorite ? '取消關注' : '關注聯絡人'}
                  >
                    <Star className={`w-3 h-3 ${
                      customer.isFavorite ? 'text-yellow-600 fill-current' : 'text-gray-600'
                    }`} />
                  </button>
                )}

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
                
                {/* Invitation status symbols */}
                <div className="flex items-center space-x-1">
                  {customer.phone && !customer.invitationSent && (
                    <div className="p-1" title="可發送簡訊邀請">
                      <Smartphone className="w-3 h-3 text-blue-600" />
                    </div>
                  )}
                  {customer.email && !customer.emailInvitationSent && (
                    <div className="p-1" title="可發送Email邀請">
                      <Mail className="w-3 h-3 text-green-600" />
                    </div>
                  )}
                  {isInvited && (
                    <div className="p-1" title="已邀請">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                  )}
                </div>
                
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Second line: Company info and contact info */}
            <div className="text-xs text-gray-600 truncate">
              {customer.company && customer.jobTitle 
                ? `${customer.company} · ${customer.jobTitle}` 
                : customer.company || customer.jobTitle || '無公司資訊'
              }
              {(customer.phone || customer.email) && (
                <span className="ml-2 text-gray-400">
                  {customer.phone && <Phone className="inline w-3 h-3 mr-1" />}
                  {customer.email && <Mail className="inline w-3 h-3 mr-1" />}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
