
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Star, Users, QrCode, UserPlus, MessageSquare, Mail, Share2, Tag, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(['工作', '朋友', '客戶', '合作夥伴', '潛在客戶']);

  useEffect(() => {
    // 從 localStorage 載入客戶資料
    const savedCustomers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    setLocalCustomers(savedCustomers);
    onCustomersUpdate(savedCustomers);
  }, [onCustomersUpdate]);

  const filteredCustomers = localCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeFilter) {
      case 'favorites':
        return matchesSearch && customer.isFavorite;
      case 'cards':
        return matchesSearch && customer.hasCard;
      case 'contacts':
        return matchesSearch && !customer.hasCard;
      default:
        if (availableTags.includes(activeFilter)) {
          return matchesSearch && customer.tags?.includes(activeFilter);
        }
        return matchesSearch;
    }
  });

  const cardCustomers = filteredCustomers.filter(customer => customer.hasCard);
  const contactCustomers = filteredCustomers.filter(customer => !customer.hasCard);

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

  const addTag = (customerId: number, tag: string) => {
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, tags: [...(customer.tags || []), tag] }
        : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
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

  const renderCustomerCard = (customer: Customer) => (
    <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
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
          
          {customer.company && (
            <p className="text-xs text-gray-600 mb-1">{customer.company}</p>
          )}
          
          {customer.jobTitle && (
            <p className="text-xs text-gray-500 mb-1">{customer.jobTitle}</p>
          )}
          
          <div className="space-y-1 text-xs text-gray-600">
            {customer.phone && <div>📱 {customer.phone}</div>}
            {customer.email && <div>✉️ {customer.email}</div>}
            {customer.website && <div>🌐 {customer.website}</div>}
          </div>

          {/* 邀請狀態顯示 */}
          {customer.isInvited && (
            <div className="mt-2 flex items-center space-x-2">
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
          )}

          {/* 標籤系統 */}
          <div className="mt-2">
            <div className="flex flex-wrap gap-1 mb-1">
              {customer.tags?.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(customer.id, tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addTag(customer.id, e.target.value);
                  e.target.value = '';
                }
              }}
              className="text-xs border border-gray-200 rounded px-2 py-1"
            >
              <option value="">新增標籤</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {customer.hasCard ? (
            <QrCode className="w-4 h-4 text-green-500" />
          ) : (
            <UserPlus className="w-4 h-4 text-orange-500" />
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        加入時間: {new Date(customer.addedDate).toLocaleDateString('zh-TW')}
      </div>
    </div>
  );

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

      {/* Search and Filters */}
      <div className="p-3 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜尋名片或聯絡人..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm h-9"
          />
        </div>

        {/* Filter Tabs */}
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
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* 我的名片夾 (QR Code 掃描同步) */}
        {(activeFilter === 'all' || activeFilter === 'cards') && cardCustomers.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <QrCode className="w-4 h-4 text-green-500" />
              <h2 className="font-bold text-sm text-gray-800">我的名片夾</h2>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                {cardCustomers.length}
              </span>
            </div>
            <div className="space-y-2">
              {cardCustomers.map(renderCustomerCard)}
            </div>
          </div>
        )}

        {/* 我的聯絡人 (紙本掃描同步) */}
        {(activeFilter === 'all' || activeFilter === 'contacts') && contactCustomers.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <UserPlus className="w-4 h-4 text-orange-500" />
              <h2 className="font-bold text-sm text-gray-800">我的聯絡人</h2>
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                {contactCustomers.length}
              </span>
            </div>
            <div className="space-y-2">
              {contactCustomers.map(renderCustomerCard)}
            </div>
          </div>
        )}

        {/* 按標籤篩選的結果 */}
        {availableTags.includes(activeFilter) && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="w-4 h-4 text-blue-500" />
              <h2 className="font-bold text-sm text-gray-800">{activeFilter}</h2>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {filteredCustomers.length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredCustomers.map(renderCustomerCard)}
            </div>
          </div>
        )}

        {/* 關注列表 */}
        {activeFilter === 'favorites' && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-4 h-4 text-yellow-500" />
              <h2 className="font-bold text-sm text-gray-800">關注</h2>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                {filteredCustomers.length}
              </span>
            </div>
            <div className="space-y-2">
              {filteredCustomers.map(renderCustomerCard)}
            </div>
          </div>
        )}

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {searchTerm ? '找不到符合條件的聯絡人' : '還沒有任何名片或聯絡人'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              使用掃描功能來新增名片和聯絡人
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCustomers;
