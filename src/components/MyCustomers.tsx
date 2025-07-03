
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Star, Users, QrCode, UserPlus, MessageSquare, Mail, Share2, Tag, Filter, Edit, Save, X, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface MyCustomersProps {
  onClose: () => void;
  customers: any[];
  onCustomersUpdate: (customers: any[]) => void;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  line?: string;
  facebook?: string;
  instagram?: string;
  photo?: string;
  hasCard: boolean;
  addedDate: string;
  notes: string;
  isInvited?: boolean;
  invitationSent?: boolean;
  tags?: string[];
  isFavorite?: boolean;
}

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers, onCustomersUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSection, setActiveSection] = useState<'cards' | 'contacts'>('cards');
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(['工作', '朋友', '客戶', '合作夥伴', '潛在客戶']);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    setLocalCustomers(savedCustomers);
    onCustomersUpdate(savedCustomers);
  }, [onCustomersUpdate]);

  const filteredCustomers = localCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = activeSection === 'cards' ? customer.hasCard : !customer.hasCard;
    
    switch (activeFilter) {
      case 'favorites':
        return matchesSearch && customer.isFavorite && matchesSection;
      default:
        if (availableTags.includes(activeFilter)) {
          return matchesSearch && customer.tags?.includes(activeFilter) && matchesSection;
        }
        return matchesSearch && matchesSection;
    }
  });

  const toggleFavorite = (customerId: number) => {
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, isFavorite: !customer.isFavorite }
        : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
  };

  const startEditing = (customer: Customer) => {
    setEditingCard(customer.id);
    setEditingCustomer({ ...customer });
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setEditingCustomer(null);
  };

  const saveEditing = () => {
    if (!editingCustomer) return;
    
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === editingCustomer.id ? editingCustomer : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
    setEditingCard(null);
    setEditingCustomer(null);
    toast({ title: "客戶資料已更新" });
  };

  const addTag = (customerId: number, tag: string) => {
    if (!tag.trim()) return;
    
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, tags: [...(customer.tags || []), tag.trim()] }
        : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
    
    if (!availableTags.includes(tag.trim())) {
      setAvailableTags([...availableTags, tag.trim()]);
    }
  };

  const removeTag = (customerId: number, tag: string) => {
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, tags: customer.tags?.filter(t => t !== tag) || [] }
        : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
  };

  const renderCompactCard = (customer: Customer) => (
    <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm mb-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-sm text-gray-800">{customer.name}</h3>
            <Button
              onClick={() => toggleFavorite(customer.id)}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
            >
              <Star 
                className={`w-3 h-3 ${customer.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
              />
            </Button>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            {customer.company && <div>{customer.company}</div>}
            {customer.phone && <div>📱 {customer.phone}</div>}
            {customer.line && <div>💬 LINE</div>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
            variant="ghost"
            size="sm"
          >
            {expandedCard === customer.id ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </Button>
        </div>
      </div>
    </div>
  );

  const renderExpandedCard = (customer: Customer) => {
    const isEditing = editingCard === customer.id;
    const displayCustomer = isEditing ? editingCustomer! : customer;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
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
            <Button
              onClick={() => toggleFavorite(customer.id)}
              variant="ghost"
              size="sm"
            >
              <Star 
                className={`w-4 h-4 ${customer.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
              />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
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
          {/* 基本資訊 */}
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
                <div className="text-sm">{displayCustomer.phone || '-'}</div>
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
                <div className="text-sm">{displayCustomer.line || '-'}</div>
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

          {/* 邀請狀態 */}
          {customer.isInvited && (
            <div className="border-t pt-3">
              <label className="text-xs text-gray-500 mb-2 block">邀請狀態</label>
              <div className="flex items-center space-x-3">
                {customer.invitationSent && (
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">已發送簡訊</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-600">已發送Email</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-600">已分享</span>
                </div>
              </div>
            </div>
          )}

          {/* 標籤系統 */}
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
                      onClick={() => removeTag(customer.id, tag)}
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
                      addTag(customer.id, newTag);
                      setNewTag('');
                    }
                  }}
                  className="text-xs"
                />
                <Button
                  onClick={() => {
                    addTag(customer.id, newTag);
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

          {/* 備註 */}
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
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="text-white hover:bg-white/20 p-1.5 h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-base">名片人脈夾</h1>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜尋名片或聯絡人..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm h-9"
          />
        </div>
      </div>

      {/* Section Toggle */}
      <div className="flex bg-white border-b border-gray-200 flex-shrink-0">
        <Button
          onClick={() => setActiveSection('cards')}
          variant={activeSection === 'cards' ? 'default' : 'ghost'}
          className="flex-1 rounded-none border-r"
        >
          <QrCode className="w-4 h-4 mr-2" />
          我的名片夾
          <span className="ml-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {localCustomers.filter(c => c.hasCard).length}
          </span>
        </Button>
        <Button
          onClick={() => setActiveSection('contacts')}
          variant={activeSection === 'contacts' ? 'default' : 'ghost'}
          className="flex-1 rounded-none"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          我的聯絡人
          <span className="ml-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {localCustomers.filter(c => !c.hasCard).length}
          </span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex space-x-1 overflow-x-auto pb-1">
          <Button
            onClick={() => setActiveFilter('favorites')}
            variant={activeFilter === 'favorites' ? 'default' : 'outline'}
            size="sm"
            className="flex-shrink-0 text-xs h-7"
          >
            <Star className="w-3 h-3 mr-1" />
            關注
          </Button>
          
          {availableTags.map(tag => (
            <Button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              variant={activeFilter === tag ? 'default' : 'outline'}
              size="sm"
              className="flex-shrink-0 text-xs h-7"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Button>
          ))}
          
          <Button
            onClick={() => setActiveFilter('all')}
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="flex-shrink-0 text-xs h-7"
          >
            <Filter className="w-3 h-3 mr-1" />
            全部
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredCustomers.length > 0 ? (
          <div className="space-y-2">
            {filteredCustomers.map(customer => 
              expandedCard === customer.id 
                ? renderExpandedCard(customer)
                : renderCompactCard(customer)
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {searchTerm ? '找不到符合條件的聯絡人' : `還沒有任何${activeSection === 'cards' ? '名片' : '聯絡人'}`}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              使用掃描功能來新增{activeSection === 'cards' ? '名片' : '聯絡人'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCustomers;
