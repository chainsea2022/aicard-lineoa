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
import CustomerCard from './CustomerCard';
import ExpandedCard from './ExpandedCard';
import ContactCard from './ContactCard';
import { SmartRecommendation } from './SmartRecommendation';
import { Customer, RecommendedContact, CustomerRelationshipStatus } from './types';
import { getRandomProfessionalAvatar, generateMockCustomers, generateMockRecommendedContacts } from './utils';

interface MyCustomersProps {
  onClose: () => void;
  customers?: any[];
  onCustomersUpdate?: (customers: any[]) => void;
}

interface CustomerFilter {
  relationshipStatus?: CustomerRelationshipStatus | null;
  hasCard?: boolean | null;
  tags?: string[];
}

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
    const matchesSearch = searchRegex.test(customer.name) || searchRegex.test(customer.company) || searchRegex.test(customer.jobTitle);

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

          {/* Filter Options (Conditionally Rendered) */}
          {isFilterOpen && (
            <div className="mt-2 space-y-2">
              {/* Relationship Status Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700">關係狀態</h4>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={filter.relationshipStatus === 'lead' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, relationshipStatus: 'lead' })}
                  >
                    潛在客戶
                  </Button>
                  <Button
                    variant={filter.relationshipStatus === 'prospect' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, relationshipStatus: 'prospect' })}
                  >
                    機會客戶
                  </Button>
                  <Button
                    variant={filter.relationshipStatus === 'customer' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, relationshipStatus: 'customer' })}
                  >
                    正式客戶
                  </Button>
                </div>
              </div>

              {/* Has Card Filter */}
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

              {/* Clear Filter Button */}
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
                  onCardClick={() => setExpandedCardId(customer.id)}
                  onMessage={() => handleCardAction('message', customer)}
                  onPhone={() => handleCardAction('phone', customer)}
                  onMail={() => handleCardAction('mail', customer)}
                  onCalendar={() => handleCardAction('calendar', customer)}
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
          customer={localCustomers.find(c => c.id === expandedCardId)}
          onClose={() => setExpandedCardId(null)}
          onRemove={removeCustomer}
          onArchive={archiveCustomer}
          onEdit={editCustomer}
        />
      )}
    </div>
  );
};

export default MyCustomers;
