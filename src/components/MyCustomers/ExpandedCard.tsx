import React, { useState } from 'react';
import { ChevronUp, Phone, MessageSquare, Mail, Trash2, Save, Plus, X, Star, UserCheck, UserX, Tag as TagIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Customer } from './types';
import { getRandomProfessionalAvatar } from './utils';
import { toast } from '@/hooks/use-toast';

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
  onSaveCustomer: (customerId: number, updates: Partial<Customer>) => void;
  onDeleteCustomer?: (customerId: number) => void;
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
  const [editedCustomer, setEditedCustomer] = useState<Customer>(customer);
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSaveCustomer(customer.id, editedCustomer);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`確定要刪除 ${customer.name} 的資料嗎？`)) {
      if (onDeleteCustomer) {
        onDeleteCustomer(customer.id);
      }
      toast({
        title: "已刪除",
        description: `${customer.name} 的資料已被刪除`
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(customer.id, newTag.trim());
      setNewTag('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW') + ' ' + date.toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="mb-2 shadow-md bg-white border-2 border-blue-200">
      <CardContent className="p-4">
        {/* 頂部操作區 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onToggleFavorite(customer.id)}
              variant="ghost"
              size="sm"
              className={`p-2 ${customer.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              <Star className={`w-4 h-4 ${customer.isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <h3 className="font-bold text-lg text-gray-800">{customer.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {isEditing ? '取消編輯' : '編輯'}
            </Button>
            {onDeleteCustomer && (
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
            <Button
              onClick={onCollapse}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 頭像和基本信息 */}
        <div className="flex items-start space-x-4 mb-4">
          <Avatar className="w-16 h-16 border-2 border-blue-300">
            <AvatarImage src={customer.photo || getRandomProfessionalAvatar(customer.id)} alt={customer.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
              {customer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <>
                <Input
                  value={editedCustomer.name}
                  onChange={(e) => setEditedCustomer({...editedCustomer, name: e.target.value})}
                  placeholder="姓名"
                  className="text-sm"
                />
                <Input
                  value={editedCustomer.company || ''}
                  onChange={(e) => setEditedCustomer({...editedCustomer, company: e.target.value})}
                  placeholder="公司"
                  className="text-sm"
                />
                <Input
                  value={editedCustomer.jobTitle || ''}
                  onChange={(e) => setEditedCustomer({...editedCustomer, jobTitle: e.target.value})}
                  placeholder="職稱"
                  className="text-sm"
                />
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">{customer.company}</p>
                <p className="text-sm text-gray-600">{customer.jobTitle}</p>
              </>
            )}
          </div>
        </div>

        {/* 聯絡信息 */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-blue-600" />
            {isEditing ? (
              <Input
                value={editedCustomer.phone}
                onChange={(e) => setEditedCustomer({...editedCustomer, phone: e.target.value})}
                placeholder="電話號碼"
                className="text-sm flex-1"
              />
            ) : (
              <>
                <span className="text-sm text-gray-700">{customer.phone}</span>
                {customer.phone && (
                  <Button
                    onClick={() => onPhoneClick(customer.phone)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 p-1"
                  >
                    撥打
                  </Button>
                )}
              </>
            )}
          </div>

          {customer.line && (
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">{customer.line}</span>
              <Button
                onClick={() => onLineClick(customer.line!)}
                variant="ghost"
                size="sm"
                className="text-green-600 hover:bg-green-50 p-1"
              >
                開啟 LINE
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-600" />
            {isEditing ? (
              <Input
                value={editedCustomer.email}
                onChange={(e) => setEditedCustomer({...editedCustomer, email: e.target.value})}
                placeholder="Email"
                className="text-sm flex-1"
              />
            ) : (
              <span className="text-sm text-gray-700">{customer.email}</span>
            )}
          </div>
        </div>

        {/* 標籤管理 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <TagIcon className="w-4 h-4 mr-1" />
            標籤
          </h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {customer.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <button
                  onClick={() => onRemoveTag(customer.id, tag)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="新增標籤"
              className="text-xs flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} size="sm" variant="outline" className="text-xs">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* 備註 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">備註</h4>
          {isEditing ? (
            <Textarea
              value={editedCustomer.notes || ''}
              onChange={(e) => setEditedCustomer({...editedCustomer, notes: e.target.value})}
              placeholder="輸入備註..."
              className="text-sm resize-none"
              rows={3}
            />
          ) : (
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {customer.notes || '無備註'}
            </p>
          )}
        </div>

        {/* 操作按鈕區 */}
        <div className="space-y-3">
          {/* 保存按鈕 */}
          {isEditing && (
            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
              <Save className="w-4 h-4 mr-2" />
              保存變更
            </Button>
          )}

          {/* 電子名片夾特定操作 */}
          {activeSection === 'cards' && customer.relationshipStatus === 'addedMe' && (
            <div className="flex space-x-2">
              <Button
                onClick={() => onAddFollower(customer.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
              >
                <UserCheck className="w-4 h-4 mr-1" />
                加回
              </Button>
              <Button
                onClick={() => onIgnoreFollower(customer.id)}
                variant="outline"
                className="flex-1 text-gray-600 border-gray-200 hover:bg-gray-50 text-sm"
              >
                <UserX className="w-4 h-4 mr-1" />
                忽略
              </Button>
            </div>
          )}

          {/* 聯絡人特定操作 */}
          {activeSection === 'contacts' && !customer.invitationSent && !customer.emailInvitationSent && (
            <div className="flex space-x-2">
              <Button
                onClick={() => onSendInvitation(customer.id, 'sms')}
                variant="outline"
                className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 text-sm"
              >
                簡訊邀請
              </Button>
              <Button
                onClick={() => onSendInvitation(customer.id, 'email')}
                variant="outline"
                className="flex-1 text-green-600 border-green-200 hover:bg-green-50 text-sm"
              >
                Email邀請
              </Button>
            </div>
          )}
        </div>

        {/* 日期信息 */}
        <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <p>加入時間: {formatDate(customer.addedDate)}</p>
          {(customer.invitationDate || customer.emailInvitationDate) && (
            <p>邀請時間: {formatDate(customer.invitationDate || customer.emailInvitationDate || '')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
