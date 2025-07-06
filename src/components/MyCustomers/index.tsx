
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, Filter, Users, Star, Plus, MessageSquare, Phone, Mail, Calendar, UserPlus, Bell, Settings, Eye, EyeOff, MoreVertical, Trash2, Edit, Archive, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { CustomerCard } from './CustomerCard';
import { ExpandedCard } from './ExpandedCard';
import { ContactCard } from './ContactCard';
import { SmartRecommendation } from './SmartRecommendation';
import { Customer, RecommendedContact } from './types';
import { getRandomProfessionalAvatar } from './utils';

interface MyCustomersProps {
  onClose: () => void;
  customers?: any[];
  onCustomersUpdate?: (customers: any[]) => void;
}

type CustomerRelationshipStatus = 'collected' | 'addedMe' | 'ignored' | 'archived';

interface CustomerFilter {
  relationshipStatus?: CustomerRelationshipStatus | null;
  hasCard?: boolean | null;
  tags?: string[];
}

const generateMockRecommendedContacts = (count: number): RecommendedContact[] => {
  const names = ['張志明', '李小美', '王大偉', '陳雅婷', '林俊傑'];
  const companies = ['科技公司', '貿易公司', '設計工作室', '顧問公司', '媒體公司'];
  const jobTitles = ['產品經理', '設計師', '工程師', '業務經理', '行銷專員'];
  const reasons = ['共同朋友', '同行業', '附近地區', '相似興趣', '專業推薦'];

  return Array.from({ length: count }, (_, i) => ({
    id: 1000 + i,
    name: names[i % names.length],
    company: companies[i % companies.length],
    jobTitle: jobTitles[i % jobTitles.length],
    photo: getRandomProfessionalAvatar(1000 + i),
    mutualFriends: ['共同朋友1', '共同朋友2'],
    reason: reasons[i % reasons.length],
    isPublicProfile: Math.random() > 0.3,
    allowDirectContact: Math.random() > 0.5
  }));
};

const generateMockCustomers = (): Customer[] => {
  const baseDate = new Date();
  
  return [
    {
      id: 1,
      name: '王小明',
      phone: '0912-345-678',
      email: 'wang.xiaoming@example.com',
      company: '台北科技公司',
      jobTitle: '軟體工程師',
      photo: getRandomProfessionalAvatar(1),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '在技術研討會認識的朋友',
      tags: ['工作', '朋友'],
      relationshipStatus: 'collected',
      isMyFriend: true,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: true
    },
    {
      id: 2,
      name: '李大華',
      phone: '0987-654-321',
      email: 'li.dahua@example.com',
      company: '創新設計工作室',
      jobTitle: '設計總監',
      photo: getRandomProfessionalAvatar(2),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '合作過的設計師夥伴',
      tags: ['工作', '合作夥伴'],
      relationshipStatus: 'collected',
      isMyFriend: true,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: false
    }
  ];
};

const mockRecommendedContacts: RecommendedContact[] = generateMockRecommendedContacts(5);

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers = [], onCustomersUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<CustomerFilter>({});
  const [isRecommendationCollapsed, setIsRecommendationCollapsed] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [recommendedContacts, setRecommendedContacts] = useState<RecommendedContact[]>(mockRecommendedContacts);
  const [favoriteRecommendationIds, setFavoriteRecommendationIds] = useState<number[]>([]);
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(() => {
    const savedCustomers = localStorage.getItem('aile-customers');
    return savedCustomers ? JSON.parse(savedCustomers) : [...customers, ...generateMockCustomers()];
  });

  const [addedRecommendationsCount, setAddedRecommendationsCount] = useState<number>(() => {
    const saved = localStorage.getItem('aile-added-recommendations-count');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('aile-customers', JSON.stringify(localCustomers));
    if (onCustomersUpdate) {
      onCustomersUpdate(localCustomers);
    }
  }, [localCustomers, onCustomersUpdate]);

  const updateCustomers = (updatedCustomers: Customer[]) => {
    setLocalCustomers(updatedCustomers);
  };

  const filteredCustomers = localCustomers.filter(customer => {
    const searchRegex = new RegExp(searchQuery, 'i');
    const matchesSearch = searchRegex.test(customer.name) || searchRegex.test(customer.company || '') || searchRegex.test(customer.jobTitle || '');

    const matchesFilter = Object.keys(filter).every(key => {
      if (key === 'relationshipStatus' && filter.relationshipStatus) {
        return customer.relationshipStatus === filter.relationshipStatus;
      }
      if (key === 'hasCard' && filter.hasCard !== null) {
        return customer.hasCard === filter.hasCard;
      }
      if (key === 'tags' && filter.tags && filter.tags.length > 0) {
        return filter.tags.every(tag => customer.tags?.includes(tag));
      }
      return true;
    });

    return matchesSearch && matchesFilter;
  });

  const handlePhoneClick = (phoneNumber: string) => {
    toast({
      title: "撥打電話",
      description: `撥打電話給 ${phoneNumber}`
    });
  };

  const handleLineClick = (lineId: string) => {
    toast({
      title: "開啟 LINE",
      description: `開啟 LINE ID: ${lineId}`
    });
  };

  const toggleFavoriteRecommendation = (contactId: number) => {
    setFavoriteRecommendationIds(prev =>
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  };

  const addRecommendedContact = (contact: RecommendedContact) => {
    const newCustomer: Customer = {
      id: Date.now(),
      name: contact.name,
      phone: '',
      email: '',
      company: contact.company,
      jobTitle: contact.jobTitle,
      photo: contact.photo,
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: `推薦聯絡人 - ${contact.reason}`,
      tags: ['推薦聯絡人'],
      relationshipStatus: 'collected'
    };
    
    const updatedCustomers = [...localCustomers, newCustomer];
    updateCustomers(updatedCustomers);
    
    // Update added recommendations count
    const newCount = addedRecommendationsCount + 1;
    setAddedRecommendationsCount(newCount);
    localStorage.setItem('aile-added-recommendations-count', newCount.toString());
    
    toast({ 
      title: "已加入聯絡人", 
      description: `${contact.name} 已加入您的聯絡人列表` 
    });

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: { customerName: contact.name, action: 'added' }
      }));
    }, 1000);
  };

  const removeCustomer = (id: number) => {
    const updatedCustomers = localCustomers.filter(customer => customer.id !== id);
    updateCustomers(updatedCustomers);
    toast({
      title: "已移除聯絡人",
      description: "聯絡人已從您的列表中移除"
    });
  };

  const archiveCustomer = (id: number) => {
    const updatedCustomers = localCustomers.map(customer =>
      customer.id === id ? { ...customer, relationshipStatus: 'archived' as CustomerRelationshipStatus } : customer
    );
    updateCustomers(updatedCustomers);
    toast({
      title: "已封存聯絡人",
      description: "聯絡人已封存"
    });
  };

  const editCustomer = (id: number, updates: Partial<Customer>) => {
    const updatedCustomers = localCustomers.map(customer =>
      customer.id === id ? { ...customer, ...updates } : customer
    );
    updateCustomers(updatedCustomers);
    toast({
      title: "已編輯聯絡人",
      description: "聯絡人資訊已更新"
    });
  };

  const handleCardAction = (action: string, customer: Customer) => {
    switch (action) {
      case 'message':
        toast({ title: "傳送訊息", description: `傳送訊息給 ${customer.name}` });
        break;
      case 'phone':
        toast({ title: "撥打電話", description: `撥打電話給 ${customer.name}` });
        break;
      case 'mail':
        toast({ title: "傳送郵件", description: `傳送郵件給 ${customer.name}` });
        break;
      case 'calendar':
        toast({ title: "新增行程", description: `新增與 ${customer.name} 的行程` });
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Button onClick={onClose} variant="ghost" size="sm">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">名片人脈夾</h2>
        <div></div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search and Filter Section */}
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="搜尋聯絡人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-full"
            />
            <Button onClick={() => setIsFilterOpen(!isFilterOpen)} variant="outline" size="icon" className="shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter Options */}
          {isFilterOpen && (
            <div className="mt-2 space-y-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700">關係狀態</h4>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={filter.relationshipStatus === 'collected' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, relationshipStatus: 'collected' })}
                  >
                    已收藏
                  </Button>
                  <Button
                    variant={filter.relationshipStatus === 'addedMe' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, relationshipStatus: 'addedMe' })}
                  >
                    加我名片
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">名片狀態</h4>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={filter.hasCard === true ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, hasCard: true })}
                  >
                    有名片
                  </Button>
                  <Button
                    variant={filter.hasCard === false ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, hasCard: false })}
                  >
                    無名片
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter({})}
                className="w-full justify-center"
              >
                清除篩選
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-4">
              {filteredCustomers.map(customer => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onClick={() => setExpandedCardId(customer.id)}
                  onAddFollower={() => {}}
                  onPhoneClick={handlePhoneClick}
                  onLineClick={handleLineClick}
                />
              ))}
            </div>

            {/* Smart Recommendations */}
            <SmartRecommendation
              isCollapsed={isRecommendationCollapsed}
              onToggleCollapse={() => setIsRecommendationCollapsed(!isRecommendationCollapsed)}
              onAddRecommendation={addRecommendedContact}
              recommendations={recommendedContacts}
              onToggleFavorite={toggleFavoriteRecommendation}
              onPhoneClick={handlePhoneClick}
              onLineClick={handleLineClick}
              favoriteIds={favoriteRecommendationIds}
              addedCount={addedRecommendationsCount}
            />
          </ScrollArea>
        </div>
      </div>

      {/* Expanded Card Modal */}
      {expandedCardId !== null && (
        <ExpandedCard
          customer={localCustomers.find(c => c.id === expandedCardId)!}
          activeSection="cards"
          onToggleFavorite={() => {}}
          onAddFollower={() => {}}
          onIgnoreFollower={() => {}}
          onPhoneClick={handlePhoneClick}
          onLineClick={handleLineClick}
          onSendInvitation={() => {}}
          onAddTag={() => {}}
          onRemoveTag={() => {}}
          onSaveCustomer={editCustomer}
          onDeleteCustomer={removeCustomer}
          onCollapse={() => setExpandedCardId(null)}
        />
      )}
    </div>
  );
};

export default MyCustomers;
