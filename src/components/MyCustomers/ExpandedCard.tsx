
import React, { useState } from 'react';
import { Star, Edit, Save, X, ChevronDown, Phone, Bell, Plus, MessageSquare, Mail } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Customer } from './types';
import { getRandomProfessionalAvatar } from './utils';

interface ExpandedCardProps {
  customer: Customer;
  activeSection: 'cards' | 'contacts';
  onToggleFavorite: (customerId: number) => void;
  onAddFollower: (customerId: number) => void;
  onIgnoreFollower: (customerId: number) => void;
  onPhoneClick: (phoneNumber: string) => void;
  onLineClick: (lineId: string) => void;
  onSendInvitation: (customerId: number, type: 'sms' | 'email') => void;
  onAddTag: (customerId: number, tag: string) => void;
  onRemoveTag: (customerId: number, tag: string) => void;
  onSaveCustomer: (customer: Customer) => void;
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
  onCollapse
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newTag, setNewTag] = useState('');

  const startEditing = () => {
    setIsEditing(true);
    setEditingCustomer({ ...customer });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingCustomer(null);
  };

  const saveEditing = () => {
    if (!editingCustomer) return;
    onSaveCustomer(editingCustomer);
    setIsEditing(false);
    setEditingCustomer(null);
  };

  const displayCustomer = isEditing ? editingCustomer! : customer;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarImage 
                src={displayCustomer.photo || getRandomProfessionalAvatar(displayCustomer.id)} 
                alt={displayCustomer.name} 
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                {displayCustomer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {customer.isNewAddition && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-lg text-gray-800">
              {isEditing ? (
                <Input
                  value={displayCustomer.name}
                  onChange={(e) => setEditingCustomer({...editingCustomer!, name: e.target.value})}
                  className="text-lg font-bold"
                />
              ) : (
                displayCustomer.name
              )}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Button
                onClick={() => onToggleFavorite(customer.id)}
                variant="ghost"
                size="sm"
                className="p-0 h-auto"
              >
                <Star 
                  className={`w-4 h-4 ${customer.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                />
              </Button>
              {customer.hasPendingInvitation && (
                <div className="flex items-center space-x-1">
                  <Bell className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">待處理邀請</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          {isEditing ? (
            <>
              <Button onClick={saveEditing} size="sm" variant="default">
                <Save className="w-4 h-4" />
              </Button>
              <Button onClick={cancelEditing} size="sm" variant="outline">
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button onClick={startEditing} size="sm" variant="outline">
              <Edit className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={onCollapse}
            variant="ghost"
            size="sm"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {customer.relationshipStatus === 'addedMe' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-orange-800">
              <span className="font-medium">⚠️ 對方已加您</span>
              <p className="text-xs text-orange-600 mt-1">您可以加入已收藏或忽略此人</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => onAddFollower(customer.id)}
                size="sm"
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-xs"
              >
                加入
              </Button>
              <Button
                onClick={() => onIgnoreFollower(customer.id)}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                忽略
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500">公司</label>
            {isEditing ? (
              <Input
                value={displayCustomer.company || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer!, company: e.target.value})}
                placeholder="公司名稱"
              />
            ) : (
              <div className="text-sm">{displayCustomer.company || '-'}</div>
            )}
          </div>
          
          <div>
            <label className="text-xs text-gray-500">職稱</label>
            {isEditing ? (
              <Input
                value={displayCustomer.jobTitle || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer!, jobTitle: e.target.value})}
                placeholder="職稱"
              />
            ) : (
              <div className="text-sm">{displayCustomer.jobTitle || '-'}</div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500">電話</label>
            {isEditing ? (
              <Input
                value={displayCustomer.phone || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer!, phone: e.target.value})}
                placeholder="電話號碼"
              />
            ) : (
              <div className="text-sm">
                {displayCustomer.phone ? (
                  <button
                    onClick={() => onPhoneClick(displayCustomer.phone)}
                    className="text-blue-600 hover:text-blue-700 transition-colors underline flex items-center space-x-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{displayCustomer.phone}</span>
                  </button>
                ) : (
                  '-'
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500">Email</label>
            {isEditing ? (
              <Input
                value={displayCustomer.email || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer!, email: e.target.value})}
                placeholder="電子信箱"
              />
            ) : (
              <div className="text-sm">{displayCustomer.email || '-'}</div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500">LINE</label>
            {isEditing ? (
              <Input
                value={displayCustomer.line || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer!, line: e.target.value})}
                placeholder="LINE ID"
              />
            ) : (
              <div className="text-sm">
                {displayCustomer.line ? (
                  <button
                    onClick={() => onLineClick(displayCustomer.line!)}
                    className="text-green-600 hover:text-green-700 transition-colors underline"
                  >
                    {displayCustomer.line}
                  </button>
                ) : (
                  '-'
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500">網站</label>
            {isEditing ? (
              <Input
                value={displayCustomer.website || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer!, website: e.target.value})}
                placeholder="網站網址"
              />
            ) : (
              <div className="text-sm">{displayCustomer.website || '-'}</div>
            )}
          </div>
        </div>

        {activeSection === 'contacts' && (
          <div className="border-t pt-3 mt-3">
            <label className="text-xs text-gray-500 mb-2 block">邀請功能</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onSendInvitation(customer.id, 'sms')}
                size="sm"
                variant="outline"
                disabled={customer.invitationSent}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-3 h-3" />
                <span>{customer.invitationSent ? '簡訊已發送' : '發送簡訊'}</span>
              </Button>
              <Button
                onClick={() => onSendInvitation(customer.id, 'email')}
                size="sm"
                variant="outline"
                disabled={customer.emailInvitationSent}
                className="flex items-center space-x-2"
              >
                <Mail className="w-3 h-3" />
                <span>{customer.emailInvitationSent ? 'Email已發送' : '發送Email'}</span>
              </Button>
            </div>
          </div>
        )}

        <div className="border-t pt-3">
          <label className="text-xs text-gray-500 mb-2 block">標籤</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {displayCustomer.tags?.map(tag => (
              <span 
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {tag}
                {!isEditing && (
                  <button
                    onClick={() => onRemoveTag(customer.id, tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          
          {!isEditing && (
            <div className="flex space-x-2">
              <Input
                placeholder="新增標籤"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onAddTag(customer.id, newTag);
                    setNewTag('');
                  }
                }}
                className="text-xs"
              />
              <Button
                onClick={() => {
                  onAddTag(customer.id, newTag);
                  setNewTag('');
                }}
                size="sm"
                variant="outline"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="border-t pt-3">
          <label className="text-xs text-gray-500 mb-2 block">備註</label>
          {isEditing ? (
            <Textarea
              value={displayCustomer.notes || ''}
              onChange={(e) => setEditingCustomer({...editingCustomer!, notes: e.target.value})}
              placeholder="備註內容"
              rows={3}
            />
          ) : (
            <div className="text-sm text-gray-600 min-h-[60px] p-2 border rounded">
              {displayCustomer.notes || '無備註'}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400 border-t pt-2">
          加入時間: {new Date(customer.addedDate).toLocaleDateString('zh-TW')}
        </div>
      </div>
    </div>
  );
};
