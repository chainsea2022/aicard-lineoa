import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { CustomerCard } from './CustomerCard';
import { ExpandedCard } from './ExpandedCard';
import { ContactCard } from './ContactCard';
import { SmartRecommendation } from './SmartRecommendation';
import { Customer, RecommendedContact, CustomerRelationshipStatus } from './types';
import { getRandomProfessionalAvatar } from './utils';
import { generateMockCustomers } from './mockData';

interface MyCustomersProps {
  onClose: () => void;
  customers?: any[];
  onCustomersUpdate?: (customers: any[]) => void;
}

interface CustomerFilter {
  hasCard?: boolean | null;
  tags?: string[];
  invitationStatus?: 'all' | 'invited' | 'not_invited' | 'invitation_history';
  followingMe?: boolean;
  iFollowing?: boolean;
  selectedTags?: string[];
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

const mockRecommendedContacts: RecommendedContact[] = generateMockRecommendedContacts(5);

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers = [], onCustomersUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<CustomerFilter>({});
  const [activeTab, setActiveTab] = useState<'digital' | 'paper'>('digital');
  const [isRecommendationCollapsed, setIsRecommendationCollapsed] = useState(false);
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

  const [invitationHistory, setInvitationHistory] = useState<{[key: number]: Array<{type: 'sms' | 'email', date: string, status: 'sent' | 'joined'}>}>(() => {
    const saved = localStorage.getItem('aile-invitation-history');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('aile-customers', JSON.stringify(localCustomers));
    localStorage.setItem('aile-invitation-history', JSON.stringify(invitationHistory));
    if (onCustomersUpdate) {
      onCustomersUpdate(localCustomers);
    }
  }, [localCustomers, invitationHistory, onCustomersUpdate]);

  const updateCustomers = (updatedCustomers: Customer[]) => {
    setLocalCustomers(updatedCustomers);
  };

  const getFilteredCustomers = (customerList: Customer[]) => {
    return customerList.filter(customer => {
      const searchRegex = new RegExp(searchQuery, 'i');
      const matchesSearch = searchRegex.test(customer.name) || searchRegex.test(customer.company || '') || searchRegex.test(customer.jobTitle || '');

      const matchesFilter = Object.keys(filter).every(key => {
        if (key === 'hasCard' && filter.hasCard !== null) {
          return customer.hasCard === filter.hasCard;
        }
        if (key === 'tags' && filter.tags && filter.tags.length > 0) {
          return filter.tags.every(tag => customer.tags?.includes(tag));
        }
        if (key === 'selectedTags' && filter.selectedTags && filter.selectedTags.length > 0) {
          return filter.selectedTags.some(tag => customer.tags?.includes(tag));
        }
        if (key === 'followingMe' && filter.followingMe) {
          return customer.isFollowingMe === true;
        }
        if (key === 'iFollowing' && filter.iFollowing) {
          return customer.isFavorite === true;
        }
        if (key === 'invitationStatus' && filter.invitationStatus && filter.invitationStatus !== 'all') {
          const isInvited = customer.invitationSent || customer.emailInvitationSent;
          const hasHistory = invitationHistory[customer.id] && invitationHistory[customer.id].length > 0;
          switch (filter.invitationStatus) {
            case 'invited':
              return isInvited;
            case 'not_invited':
              return !isInvited;
            case 'invitation_history':
              return hasHistory;
            default:
              return true;
          }
        }
        return true;
      });

      return matchesSearch && matchesFilter;
    });
  };

  const filteredDigitalCards = getFilteredCustomers(localCustomers.filter(customer => customer.isDigitalCard !== false));
  const filteredPaperCards = getFilteredCustomers(localCustomers.filter(customer => customer.isDigitalCard === false));

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
      relationshipStatus: 'collected',
      isDigitalCard: true
    };
    
    const updatedCustomers = [...localCustomers, newCustomer];
    updateCustomers(updatedCustomers);
    
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

  const handleSendInvitation = (id: number, type: 'sms' | 'email') => {
    const updatedCustomers = localCustomers.map(customer => {
      if (customer.id === id) {
        const now = new Date().toISOString();
        if (type === 'sms') {
          return { 
            ...customer, 
            invitationSent: true,
            invitationDate: now
          };
        } else {
          return { 
            ...customer, 
            emailInvitationSent: true,
            emailInvitationDate: now
          };
        }
      }
      return customer;
    });
    updateCustomers(updatedCustomers);
    
    setInvitationHistory(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), { type, date: new Date().toISOString(), status: 'sent' }]
    }));
    
    toast({
      title: `已發送${type === 'sms' ? '簡訊' : 'Email'}邀請`,
      description: `邀請已成功發送`
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">名片人脈夾</h2>
        <div></div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'digital' | 'paper')} className="flex-1 flex flex-col min-h-0">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="digital" className="relative">
                我的電子名片夾
                {filteredDigitalCards.filter(customer => customer.isFollowingMe && customer.relationshipStatus === 'addedMe').length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-5 h-5 flex items-center justify-center rounded-full">
                    {filteredDigitalCards.filter(customer => customer.isFollowingMe && customer.relationshipStatus === 'addedMe').length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="paper">我的聯絡人</TabsTrigger>
            </TabsList>

            <div className="mt-2">
              <Input
                type="search"
                placeholder="搜尋聯絡人..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full"
              />
            </div>

            {activeTab === 'digital' && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={filter.followingMe ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, followingMe: !filter.followingMe })}
                    className="relative flex items-center justify-center text-xs h-9"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    追蹤我
                  </Button>
                  <Button
                    variant={filter.iFollowing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, iFollowing: !filter.iFollowing })}
                    className="relative flex items-center justify-center text-xs h-9"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    我關注的
                  </Button>
                </div>

                {Object.keys(filter).some(key => filter[key]) && (
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilter({})}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      清除篩選
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'paper' && (
              <div className="mt-3 space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">邀請狀態</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filter.invitationStatus === 'all' || !filter.invitationStatus ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter({ ...filter, invitationStatus: 'all' })}
                      className="text-xs h-8"
                    >
                      全部
                    </Button>
                    <Button
                      variant={filter.invitationStatus === 'invited' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter({ ...filter, invitationStatus: 'invited' })}
                      className="text-xs h-8"
                    >
                      已邀請
                    </Button>
                    <Button
                      variant={filter.invitationStatus === 'not_invited' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter({ ...filter, invitationStatus: 'not_invited' })}
                      className="text-xs h-8"
                    >
                      未邀請
                    </Button>
                    <Button
                      variant={filter.invitationStatus === 'invitation_history' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter({ ...filter, invitationStatus: 'invitation_history' })}
                      className="text-xs h-8"
                    >
                      邀請紀錄
                    </Button>
                  </div>
                </div>

                {Object.keys(filter).some(key => filter[key]) && (
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilter({})}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      清除篩選
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 relative">
            <TabsContent value="digital" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: '120px', WebkitOverflowScrolling: 'touch' }}>
                <div className="p-3 space-y-2">
                  {filteredDigitalCards.map(customer => (
                    <div key={customer.id} className="space-y-2">
                      <CustomerCard
                        customer={customer}
                        onClick={() => setExpandedCardId(expandedCardId === customer.id ? null : customer.id)}
                        onAddFollower={() => {}}
                        onPhoneClick={handlePhoneClick}
                        onLineClick={handleLineClick}
                        onToggleFavorite={(id) => {
                          const updatedCustomers = localCustomers.map(c =>
                            c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
                          );
                          updateCustomers(updatedCustomers);
                        }}
                      />
                      {expandedCardId === customer.id && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mx-1 shadow-sm">
                          <ExpandedCard
                            customer={customer}
                            activeSection="cards"
                            onToggleFavorite={(id) => {
                              const updatedCustomers = localCustomers.map(c =>
                                c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
                              );
                              updateCustomers(updatedCustomers);
                            }}
                            onAddFollower={() => {}}
                            onIgnoreFollower={() => {}}
                            onPhoneClick={handlePhoneClick}
                            onLineClick={handleLineClick}
                            onSendInvitation={handleSendInvitation}
                            onAddTag={() => {}}
                            onRemoveTag={() => {}}
                            onSaveCustomer={(customerId: number, updates: Partial<Customer>) => {
                              const updatedCustomers = localCustomers.map(c =>
                                c.id === customerId ? { ...c, ...updates } : c
                              );
                              updateCustomers(updatedCustomers);
                            }}
                            onDeleteCustomer={(id) => {
                              const updatedCustomers = localCustomers.filter(customer => customer.id !== id);
                              updateCustomers(updatedCustomers);
                            }}
                            onCollapse={() => setExpandedCardId(null)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredDigitalCards.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">沒有符合條件的名片</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="paper" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: '20px', WebkitOverflowScrolling: 'touch' }}>
                <div className="p-3 space-y-2">
                  {filteredPaperCards.length > 0 ? (
                    filteredPaperCards.map(customer => (
                      <div key={customer.id} className="space-y-2">
                        <ContactCard
                          customer={customer}
                          onClick={() => setExpandedCardId(expandedCardId === customer.id ? null : customer.id)}
                          onSendInvitation={handleSendInvitation}
                        />
                        {expandedCardId === customer.id && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mx-1 shadow-sm">
                            <ExpandedCard
                              customer={customer}
                              activeSection="contacts"
                              onToggleFavorite={(id) => {
                                const updatedCustomers = localCustomers.map(c =>
                                  c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
                                );
                                updateCustomers(updatedCustomers);
                              }}
                              onAddFollower={() => {}}
                              onIgnoreFollower={() => {}}
                              onPhoneClick={handlePhoneClick}
                              onLineClick={handleLineClick}
                              onSendInvitation={handleSendInvitation}
                              onAddTag={() => {}}
                              onRemoveTag={() => {}}
                              onSaveCustomer={(customerId: number, updates: Partial<Customer>) => {
                                const updatedCustomers = localCustomers.map(c =>
                                  c.id === customerId ? { ...c, ...updates } : c
                                );
                                updateCustomers(updatedCustomers);
                              }}
                              onDeleteCustomer={(id) => {
                                const updatedCustomers = localCustomers.filter(customer => customer.id !== id);
                                updateCustomers(updatedCustomers);
                              }}
                              onCollapse={() => setExpandedCardId(null)}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">沒有符合條件的聯絡人</p>
                      <p className="text-gray-400 text-xs mt-1">使用掃描功能來新增紙本名片</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {activeTab === 'digital' && (
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
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
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MyCustomers;
