
import React, { useState } from 'react';
import { ArrowLeft, Users, Phone, Crown, ChevronDown, ChevronRight, Edit, Save, X, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface FollowersPageProps {
  onBack: () => void;
  followersCount: number;
  customers: any[];
}

const FollowersPage: React.FC<FollowersPageProps> = ({ onBack, followersCount, customers }) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [newTag, setNewTag] = useState('');

  const professionalAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b1b4?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&crop=face'
  ];

  const getRandomProfessionalAvatar = (customerId: number) => {
    return professionalAvatars[customerId % professionalAvatars.length];
  };

  const handlePhoneClick = (phoneNumber: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const startEditing = (customer: any) => {
    setEditingCard(customer.id);
    setEditingCustomer({ ...customer });
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setEditingCustomer(null);
  };

  const saveEditing = () => {
    if (!editingCustomer) return;
    setEditingCard(null);
    setEditingCustomer(null);
    toast({ title: "客戶資料已更新" });
  };

  const renderCompactCard = (customer: any) => (
    <div key={customer.id} className="bg-white border border-gray-200 rounded-lg shadow-sm mb-1.5 overflow-hidden">
      <div className="flex items-center p-2 space-x-2">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage 
            src={customer.photo || getRandomProfessionalAvatar(customer.id)} 
            alt={customer.name} 
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xs">
            {customer.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <h3 className="font-bold text-xs text-gray-800 truncate">{customer.name}</h3>
            <Crown className="w-3 h-3 text-pink-500" />
          </div>
          
          <div className="text-xs text-gray-600 space-y-0.5">
            {customer.company && (
              <div className="truncate text-xs">{customer.company}</div>
            )}
            <div className="flex items-center space-x-2 text-xs">
              {customer.phone && (
                <button
                  onClick={() => handlePhoneClick(customer.phone)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span className="truncate text-xs">{customer.phone}</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
          variant="ghost"
          size="sm"
          className="flex-shrink-0 h-5 w-5 p-0"
        >
          {expandedCard === customer.id ? 
            <ChevronDown className="w-3 h-3" /> : 
            <ChevronRight className="w-3 h-3" />
          }
        </Button>
      </div>
    </div>
  );

  const renderExpandedCard = (customer: any) => {
    const isEditing = editingCard === customer.id;
    const displayCustomer = isEditing ? editingCustomer! : customer;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarImage 
                src={displayCustomer.photo || getRandomProfessionalAvatar(displayCustomer.id)} 
                alt={displayCustomer.name} 
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                {displayCustomer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
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
              <Crown className="w-4 h-4 text-pink-500 mt-1" />
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
              <Button onClick={() => startEditing(customer)} size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => setExpandedCard(null)}
              variant="ghost"
              size="sm"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

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
                      onClick={() => handlePhoneClick(displayCustomer.phone)}
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
          </div>

          <div className="border-t pt-3">
            <label className="text-xs text-gray-500 mb-2 block">標籤</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {displayCustomer.tags?.map((tag: string) => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
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

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-sm mx-auto">
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="text-white hover:bg-white/20 p-1.5 h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-base">關注我的</h1>
        </div>
      </div>

      <div className="p-3 bg-pink-50 border-b border-pink-200 flex-shrink-0">
        <div className="flex items-center justify-center space-x-2">
          <Crown className="w-5 h-5 text-pink-600" />
          <span className="text-sm text-pink-700">共有 {followersCount} 位好友關注您</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {customers.length > 0 ? (
            <div className="space-y-0">
              {customers.slice(0, followersCount).map(customer => 
                expandedCard === customer.id 
                  ? renderExpandedCard(customer)
                  : renderCompactCard(customer)
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Crown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">還沒有人關注您</p>
              <p className="text-gray-400 text-xs mt-1">分享您的名片來獲得更多關注</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FollowersPage;
