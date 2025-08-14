import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, UserPlus, Send, Plus, X, Heart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Contact {
  id: string;
  name: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  email?: string;
  photo?: string;
  type: 'registered_favorite' | 'registered_normal' | 'unregistered' | 'smart_recommendation';
  isFavorite?: boolean;
  tags?: string[];
  isFollowing?: boolean;
}

interface ContactsPageProps {
  onClose: () => void;
}

const ContactsPage: React.FC<ContactsPageProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('全部');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Mock data - replace with real data
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: '張小明',
      company: 'ABC科技公司',
      jobTitle: '產品經理',
      phone: '0912-345-678',
      email: 'ming@abc.com',
      photo: '/api/placeholder/64/64',
      type: 'registered_favorite',
      isFavorite: true,
      tags: ['重要客戶', 'VIP'],
      isFollowing: true
    },
    {
      id: '2',
      name: '李美華',
      company: 'XYZ企業',
      jobTitle: '業務主管',
      phone: '0923-456-789',
      type: 'registered_normal',
      isFavorite: false,
      tags: ['合作夥伴']
    },
    {
      id: '3',
      name: '王大成',
      company: '123工作室',
      phone: '0934-567-890',
      type: 'unregistered',
      tags: ['潛在客戶']
    },
    {
      id: '4',
      name: '陳志強',
      company: 'DEF集團',
      jobTitle: 'CEO',
      type: 'smart_recommendation',
      tags: ['推薦聯絡人']
    }
  ]);

  const filterOptions = [
    { label: '全部', count: contacts.length },
    { label: '我的名片夾', count: contacts.filter(c => c.type.includes('registered')).length },
    { label: '未註冊', count: contacts.filter(c => c.type === 'unregistered').length },
    { label: '智能推薦', count: contacts.filter(c => c.type === 'smart_recommendation').length }
  ];

  const advancedFilterOptions = [
    { label: '被邀請', count: 2 },
    { label: '已邀請', count: 3 }
  ];

  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone?.includes(searchQuery) ||
        contact.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply selected filter
    if (selectedFilter !== '全部') {
      switch (selectedFilter) {
        case '我的名片夾':
          filtered = filtered.filter(c => c.type.includes('registered'));
          break;
        case '未註冊':
          filtered = filtered.filter(c => c.type === 'unregistered');
          break;
        case '智能推薦':
          filtered = filtered.filter(c => c.type === 'smart_recommendation');
          break;
        case '被邀請':
        case '已邀請':
          // Add specific logic for these filters
          break;
      }
    }

    // Sort favorites to top
    return filtered.sort((a, b) => {
      if (a.type === 'registered_favorite' && b.type !== 'registered_favorite') return -1;
      if (b.type === 'registered_favorite' && a.type !== 'registered_favorite') return 1;
      return 0;
    });
  }, [contacts, searchQuery, selectedFilter]);

  const getCardStyle = (type: Contact['type']) => {
    switch (type) {
      case 'registered_favorite':
        return 'border-2 border-blue-500 bg-blue-50';
      case 'registered_normal':
        return 'border border-gray-300 bg-white';
      case 'unregistered':
        return 'border border-gray-300 bg-white';
      case 'smart_recommendation':
        return 'border-2 border-dashed border-gray-400 bg-white';
      default:
        return 'border border-gray-300 bg-white';
    }
  };

  const getStatusBadge = (contact: Contact) => {
    switch (contact.type) {
      case 'registered_favorite':
        return <Badge className="bg-blue-600 text-white">最愛</Badge>;
      case 'unregistered':
        return <Badge className="bg-orange-500 text-white">未註冊</Badge>;
      case 'smart_recommendation':
        return <Badge className="bg-green-500 text-white">智能推薦</Badge>;
      default:
        return null;
    }
  };

  const getActionButtons = (contact: Contact) => {
    switch (contact.type) {
      case 'unregistered':
        return (
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
            <Send className="w-3 h-3 mr-1" />
            發送邀請
          </Button>
        );
      case 'smart_recommendation':
        return (
          <div className="flex space-x-2">
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="w-3 h-3 mr-1" />
              加入名片夾
            </Button>
            <Button size="sm" variant="outline" className="text-gray-600">
              略過
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Heart className={`w-3 h-3 mr-1 ${contact.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {contact.isFavorite ? '取消最愛' : '加入最愛'}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between flex-shrink-0">
        <h2 className="font-bold text-lg">名片夾</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜尋公司、姓名、手機號、職稱"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Tags */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex flex-wrap gap-2 mb-3">
          {filterOptions.map((option) => (
            <Button
              key={option.label}
              variant={selectedFilter === option.label ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(option.label)}
              className="text-xs"
            >
              {option.label} ({option.count})
            </Button>
          ))}
        </div>

        {/* Advanced Filters Dropdown */}
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="w-3 h-3 mr-1" />
                進階篩選
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border shadow-lg z-50">
              {advancedFilterOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.label}
                  onClick={() => setSelectedFilter(option.label)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {option.label} ({option.count})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Heart className="w-3 h-3 mr-1" />
              我關注的
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Tag className="w-3 h-3 mr-1" />
              標籤
            </Button>
          </div>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className={`p-4 ${getCardStyle(contact.type)}`}>
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <Avatar className="w-12 h-12">
                {contact.photo ? (
                  <AvatarImage src={contact.photo} alt={contact.name} />
                ) : (
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>

              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                    {getStatusBadge(contact)}
                    {contact.type === 'registered_favorite' && (
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                </div>

                {contact.company && (
                  <p className="text-sm text-gray-600 mb-1">{contact.company}</p>
                )}
                {contact.jobTitle && (
                  <p className="text-sm text-gray-500 mb-1">{contact.jobTitle}</p>
                )}
                {contact.phone && (
                  <p className="text-sm text-gray-500 mb-1">📱 {contact.phone}</p>
                )}
                {contact.email && (
                  <p className="text-sm text-gray-500 mb-1">✉️ {contact.email}</p>
                )}

                {/* Tags */}
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {contact.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end mt-2">
                  {getActionButtons(contact)}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredContacts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">沒有找到符合條件的聯絡人</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;