import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Mail, X, Plus, UserPlus, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { CustomerCard } from './CustomerCard';
import { CustomerDetailPage } from './CustomerDetailPage';
import { ContactCard } from './ContactCard';
import { ContactForm } from './ContactForm';
import { SmartRecommendation } from './SmartRecommendation';
import { InvitationDialog } from './InvitationDialog';
import { InvitationHistory } from './InvitationHistory';
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
  return Array.from({
    length: count
  }, (_, i) => ({
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
const MyCustomers: React.FC<MyCustomersProps> = ({
  onClose,
  customers = [],
  onCustomersUpdate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<CustomerFilter>({});
  const [activeTab, setActiveTab] = useState<'digital' | 'paper'>('digital');
  const [isRecommendationCollapsed, setIsRecommendationCollapsed] = useState(false);
  const [isInvitationSectionCollapsed, setIsInvitationSectionCollapsed] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [recommendedContacts, setRecommendedContacts] = useState<RecommendedContact[]>(mockRecommendedContacts);
  const [favoriteRecommendationIds, setFavoriteRecommendationIds] = useState<number[]>([]);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Customer | null>(null);
  const [invitationCustomer, setInvitationCustomer] = useState<Customer | null>(null);
  const [isInvitationHistoryOpen, setIsInvitationHistoryOpen] = useState(false);
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(() => {
    // 每次都清除舊的緩存資料，確保使用最新的模擬資料
    localStorage.removeItem('aile-customers');
    const mockData = generateMockCustomers();
    console.log('Mock data loaded:', mockData.filter(c => c.isRegisteredUser === false));
    return [...(customers || []), ...mockData];
  });
  const [addedRecommendationsCount, setAddedRecommendationsCount] = useState<number>(() => {
    const saved = localStorage.getItem('aile-added-recommendations-count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [invitationHistory, setInvitationHistory] = useState<{
    [key: number]: Array<{
      type: 'sms' | 'email';
      date: string;
      status: 'sent' | 'joined';
    }>;
  }>(() => {
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
    let filtered = customerList.filter(customer => {
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

    // Sort customers: new additions first, then by added date (newest first)
    return filtered.sort((a, b) => {
      // First, prioritize new additions
      if (a.isNewAddition && !b.isNewAddition) return -1;
      if (!a.isNewAddition && b.isNewAddition) return 1;

      // Then sort by added date (newest first)
      const dateA = new Date(a.addedDate || 0).getTime();
      const dateB = new Date(b.addedDate || 0).getTime();
      return dateB - dateA;
    });
  };
  const allDigitalCards = localCustomers.filter(customer => customer.isDigitalCard !== false);
  const allPaperCards = localCustomers.filter(customer => customer.isDigitalCard === false);
  const filteredDigitalCards = getFilteredCustomers(allDigitalCards);
  const filteredPaperCards = getFilteredCustomers(allPaperCards);
  const followingMeCount = allDigitalCards.filter(customer => customer.isFollowingMe && customer.relationshipStatus === 'addedMe').length;
  const handlePhoneClick = (phoneNumber: string) => {
    toast({
      title: "撥打電話",
      description: `撥打電話給 ${phoneNumber}`,
      className: "max-w-[280px] mx-auto"
    });
  };
  const handleLineClick = (lineId: string) => {
    toast({
      title: "開啟 LINE",
      description: `開啟 LINE ID: ${lineId}`,
      className: "max-w-[280px] mx-auto"
    });
  };
  const handleShowInvitation = (customerId: number) => {
    const customer = localCustomers.find(c => c.id === customerId);
    if (customer) {
      setInvitationCustomer(customer);
    }
  };
  const handleSendInvitationFromDialog = () => {
    if (invitationCustomer) {
      toast({
        title: "邀請已發送",
        description: `已向 ${invitationCustomer.name} 發送電子名片邀請`,
        className: "max-w-[280px] mx-auto"
      });
      setInvitationCustomer(null);
    }
  };
  const handleShareLine = () => {
    if (invitationCustomer) {
      // 這裡可以實現 LINE 分享功能
      toast({
        title: "分享邀請",
        description: "邀請連結已複製，可分享給 LINE 好友",
        className: "max-w-[280px] mx-auto"
      });
      setInvitationCustomer(null);
    }
  };
  const toggleFavoriteRecommendation = (contactId: number) => {
    setFavoriteRecommendationIds(prev => prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]);
  };
  const addRecommendedContact = (contact: RecommendedContact) => {
    // Generate mock public contact information for registered digital cards
    const publicContactInfo = contact.isPublicProfile ? {
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      line: `line_${contact.name.toLowerCase()}`,
      website: Math.random() > 0.5 ? `https://www.${contact.company?.toLowerCase().replace(/\s+/g, '')}.com` : undefined,
      email: `${contact.name.toLowerCase()}@${contact.company?.toLowerCase().replace(/\s+/g, '')}.com`
    } : {};
    const newCustomer: Customer = {
      id: Date.now(),
      name: contact.name,
      phone: publicContactInfo.phone || '',
      email: publicContactInfo.email || '',
      line: publicContactInfo.line || '',
      website: publicContactInfo.website || '',
      company: contact.company,
      jobTitle: contact.jobTitle,
      photo: contact.photo,
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: `推薦聯絡人 - ${contact.reason}`,
      tags: ['推薦聯絡人'],
      relationshipStatus: 'collected',
      isDigitalCard: true,
      isNewAddition: true // Mark as new addition
    };
    const updatedCustomers = [...localCustomers, newCustomer];
    updateCustomers(updatedCustomers);
    const newCount = addedRecommendationsCount + 1;
    setAddedRecommendationsCount(newCount);
    localStorage.setItem('aile-added-recommendations-count', newCount.toString());
    toast({
      title: "已加入聯絡人",
      description: `${contact.name} 已加入您的名片夾`,
      className: "max-w-[280px] mx-auto"
    });
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: {
          customerName: contact.name,
          action: 'added'
        }
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
      [id]: [...(prev[id] || []), {
        type,
        date: new Date().toISOString(),
        status: 'sent'
      }]
    }));
    toast({
      title: `已發送${type === 'sms' ? '簡訊' : 'Email'}邀請`,
      description: `邀請已成功發送`,
      className: "max-w-[280px] mx-auto"
    });
  };
  const handleAddFollower = (customerId: number) => {
    const updatedCustomers = localCustomers.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          relationshipStatus: 'collected' as CustomerRelationshipStatus,
          isNewAddition: false
        };
      }
      return customer;
    });
    updateCustomers(updatedCustomers);
    const customer = localCustomers.find(c => c.id === customerId);
    if (customer) {
      toast({
        title: "已加入聯絡人",
        description: `${customer.name} 已加入您的聯絡人列表`,
        className: "max-w-[280px] mx-auto"
      });
    }
  };
  const handleCreateContact = () => {
    setEditingContact(null);
    setIsContactFormOpen(true);
  };
  const handleEditContact = (customer: Customer) => {
    setEditingContact(customer);
    setIsContactFormOpen(true);
  };
  const handleSaveContact = (customer: Customer) => {
    if (editingContact) {
      // Update existing contact
      const updatedCustomers = localCustomers.map(c => c.id === editingContact.id ? {
        ...customer,
        id: editingContact.id
      } : c);
      updateCustomers(updatedCustomers);
    } else {
      // Add new contact
      const updatedCustomers = [...localCustomers, customer];
      updateCustomers(updatedCustomers);
    }
  };
  const handleCardClick = (customerId: number) => {
    const customer = localCustomers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);

      // If clicking on a new addition, remove the new indicator
      if (customer.isNewAddition) {
        const updatedCustomers = localCustomers.map(c => c.id === customerId ? {
          ...c,
          isNewAddition: false
        } : c);
        updateCustomers(updatedCustomers);
      }
    }
  };

  // 如果選中了客戶，顯示詳情頁面
  if (selectedCustomer) {
    return <CustomerDetailPage customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onToggleFavorite={id => {
      const updatedCustomers = localCustomers.map(c => c.id === id ? {
        ...c,
        isFavorite: !c.isFavorite
      } : c);
      updateCustomers(updatedCustomers);
      setSelectedCustomer(prev => prev && prev.id === id ? {
        ...prev,
        isFavorite: !prev.isFavorite
      } : prev);
    }} onAddFollower={handleAddFollower} onPhoneClick={handlePhoneClick} onLineClick={handleLineClick} onSendInvitation={handleSendInvitation} onSaveCustomer={(customerId: number, updates: Partial<Customer>) => {
      console.log('onSaveCustomer called in main component', { customerId, updates });
      const updatedCustomers = localCustomers.map(c => c.id === customerId ? {
        ...c,
        ...updates
      } : c);
      console.log('Updated customers:', updatedCustomers.find(c => c.id === customerId)?.tags);
      updateCustomers(updatedCustomers);
      setSelectedCustomer(prev => {
        const newSelected = prev && prev.id === customerId ? {
          ...prev,
          ...updates
        } : prev;
        console.log('Updated selectedCustomer:', newSelected?.tags);
        return newSelected;
      });
    }} onDeleteCustomer={id => {
      const updatedCustomers = localCustomers.filter(customer => customer.id !== id);
      updateCustomers(updatedCustomers);
      setSelectedCustomer(null);
    }} activeSection={activeTab === 'digital' ? 'cards' : 'contacts'} />;
  }
  return <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{
    maxWidth: '375px',
    margin: '0 auto'
  }}>
      {/* Header - LIFF style with back and close */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">名片夾</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'digital' | 'paper')} className="flex-1 flex flex-col min-h-0">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="digital" className="relative">
                我的名片夾
                {followingMeCount > 0 && <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-5 h-5 flex items-center justify-center rounded-full">
                    {followingMeCount}
                  </Badge>}
              </TabsTrigger>
              <TabsTrigger value="paper">我的聯絡人</TabsTrigger>
            </TabsList>

            <div className="mt-2">
              <Input type="search" placeholder="可搜尋公司、姓名、手機號、職稱" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full rounded-full" />
            </div>

            {activeTab === 'digital' && <div className="mt-3">
                {/* All filters in a single scrollable row */}
                <div className="overflow-x-auto">
                  <div className="flex gap-2 pb-2" style={{
                minWidth: 'max-content'
              }}>
                    <Button variant={filter.followingMe ? 'default' : 'outline'} size="sm" onClick={() => setFilter({
                  ...filter,
                  followingMe: !filter.followingMe,
                  iFollowing: filter.followingMe ? filter.iFollowing : false
                })} className="relative flex items-center justify-center text-xs h-8 px-3 whitespace-nowrap">
                      <Users className="w-3 h-3 mr-1" />
                      被加入
                      {followingMeCount > 0 && !filter.followingMe && <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-4 h-4 flex items-center justify-center rounded-full">
                          {followingMeCount}
                        </Badge>}
                    </Button>
                    <Button variant={filter.iFollowing ? 'default' : 'outline'} size="sm" onClick={() => setFilter({
                  ...filter,
                  iFollowing: !filter.iFollowing,
                  followingMe: filter.iFollowing ? filter.followingMe : false
                })} className="relative flex items-center justify-center text-xs h-8 px-3 whitespace-nowrap">
                      <Users className="w-3 h-3 mr-1" />
                      我關注的
                    </Button>
                    
                    {/* Tag filters */}
                    {(() => {
                  const allTags = Array.from(new Set(allDigitalCards.flatMap(customer => customer.tags || [])));
                  return allTags.map(tag => <Button key={tag} variant={filter.selectedTags?.includes(tag) ? 'default' : 'outline'} size="sm" onClick={() => {
                    const currentTags = filter.selectedTags || [];
                    const newTags = currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
                    setFilter({
                      ...filter,
                      selectedTags: newTags.length > 0 ? newTags : undefined
                    });
                  }} className="text-xs h-8 px-3 whitespace-nowrap">
                          {tag}
                        </Button>);
                })()}

                    {/* Clear filters button */}
                    {(filter.followingMe || filter.iFollowing || filter.selectedTags && filter.selectedTags.length > 0) && <Button variant="ghost" size="sm" onClick={() => setFilter({})} className="text-xs text-gray-500 hover:text-gray-700 h-8 px-3 whitespace-nowrap">
                        <X className="w-3 h-3 mr-1" />
                        清除篩選
                      </Button>}
                  </div>
                </div>
              </div>}

            {activeTab === 'paper' && <div className="mt-3">
                {/* Following and tags filters in a single scrollable row like digital cards */}
                <div className="overflow-x-auto">
                  <div className="flex gap-2 pb-2" style={{
                minWidth: 'max-content'
              }}>
                    {/* Following filters */}
                    <Button variant={filter.iFollowing ? 'default' : 'outline'} size="sm" onClick={() => setFilter({
                  ...filter,
                  iFollowing: !filter.iFollowing
                })} className="relative flex items-center justify-center text-xs h-8 px-3 whitespace-nowrap">
                      <Users className="w-3 h-3 mr-1" />
                      我關注的
                    </Button>
                    
                    {/* Tag filters */}
                    {(() => {
                  const allTags = Array.from(new Set(allPaperCards.flatMap(customer => customer.tags || [])));
                  return allTags.map(tag => <Button key={tag} variant={filter.selectedTags?.includes(tag) ? 'default' : 'outline'} size="sm" onClick={() => {
                    const currentTags = filter.selectedTags || [];
                    const newTags = currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
                    setFilter({
                      ...filter,
                      selectedTags: newTags.length > 0 ? newTags : undefined
                    });
                  }} className="text-xs h-8 px-3 whitespace-nowrap">
                          {tag}
                        </Button>);
                })()}

                    {/* Clear filters button */}
                    {(filter.iFollowing || filter.selectedTags && filter.selectedTags.length > 0) && <Button variant="ghost" size="sm" onClick={() => setFilter({
                  ...filter,
                  iFollowing: false,
                  selectedTags: undefined
                })} className="text-xs text-gray-500 hover:text-gray-700 h-8 px-3 whitespace-nowrap">
                        <X className="w-3 h-3 mr-1" />
                        清除篩選
                      </Button>}
                  </div>
                </div>

                {/* Compact invitation status section */}
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 flex-shrink-0">邀請狀態:</span>
                    <div className="flex gap-1 flex-1">
                      <Button variant={filter.invitationStatus === 'all' || !filter.invitationStatus ? 'default' : 'outline'} size="sm" onClick={() => setFilter({
                    ...filter,
                    invitationStatus: 'all'
                  })} className="text-xs h-6 px-2 py-0">
                        全部
                      </Button>
                      <Button variant={filter.invitationStatus === 'invited' ? 'default' : 'outline'} size="sm" onClick={() => setFilter({
                    ...filter,
                    invitationStatus: 'invited'
                  })} className="text-xs h-6 px-2 py-0">
                        已邀請
                      </Button>
                      <Button variant={filter.invitationStatus === 'not_invited' ? 'default' : 'outline'} size="sm" onClick={() => setFilter({
                    ...filter,
                    invitationStatus: 'not_invited'
                  })} className="text-xs h-6 px-2 py-0">
                        未邀請
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsInvitationHistoryOpen(true)} className="text-xs h-6 px-2 py-0">
                        紀錄
                      </Button>
                    </div>
                  </div>
                </div>
              </div>}
          </div>

          <div className="flex-1 min-h-0 relative">
            <TabsContent value="digital" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{
              paddingBottom: '120px',
              WebkitOverflowScrolling: 'touch'
            }}>
                <div className="p-3 space-y-2">
                  {filteredDigitalCards.map(customer => <CustomerCard key={customer.id} customer={customer} onClick={() => handleCardClick(customer.id)} onAddFollower={handleAddFollower} onPhoneClick={handlePhoneClick} onLineClick={handleLineClick} onToggleFavorite={id => {
                  const updatedCustomers = localCustomers.map(c => c.id === id ? {
                    ...c,
                    isFavorite: !c.isFavorite
                  } : c);
                  updateCustomers(updatedCustomers);
                }} onShowInvitation={handleShowInvitation} />)}
                  {filteredDigitalCards.length === 0 && <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">沒有符合條件的名片</p>
                    </div>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="paper" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{
              paddingBottom: '20px',
              WebkitOverflowScrolling: 'touch'
            }}>
                <div className="p-3 space-y-2">
                  {filteredPaperCards.length > 0 ? filteredPaperCards.map(customer => <ContactCard key={customer.id} customer={customer} onClick={() => handleCardClick(customer.id)} onSendInvitation={handleSendInvitation} onEdit={() => handleEditContact(customer)} onToggleFavorite={id => {
                  const updatedCustomers = localCustomers.map(c => c.id === id ? {
                    ...c,
                    isFavorite: !c.isFavorite
                  } : c);
                  updateCustomers(updatedCustomers);
                }} />) : <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">沒有符合條件的聯絡人</p>
                      <p className="text-gray-400 text-xs mt-1">點擊上方按鈕來建立新的聯絡人</p>
                      <Button onClick={handleCreateContact} className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm" size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        建立第一個聯絡人
                      </Button>
                    </div>}
                </div>
              </div>
            </TabsContent>

            {activeTab === 'digital' && <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
                <SmartRecommendation isCollapsed={isRecommendationCollapsed} onToggleCollapse={() => setIsRecommendationCollapsed(!isRecommendationCollapsed)} onAddRecommendation={addRecommendedContact} recommendations={recommendedContacts} onToggleFavorite={toggleFavoriteRecommendation} onPhoneClick={handlePhoneClick} onLineClick={handleLineClick} favoriteIds={favoriteRecommendationIds} addedCount={addedRecommendationsCount} />
              </div>}
          </div>
        </Tabs>
      </div>

      {/* Contact Form Dialog */}
      <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} onSave={handleSaveContact} editingCustomer={editingContact} />

      {/* Invitation Dialog */}
      <InvitationDialog customer={invitationCustomer} open={!!invitationCustomer} onClose={() => setInvitationCustomer(null)} onSendInvitation={handleSendInvitationFromDialog} onShareLine={handleShareLine} />

      {/* Invitation History Dialog */}
      <InvitationHistory isOpen={isInvitationHistoryOpen} onClose={() => setIsInvitationHistoryOpen(false)} customers={localCustomers} invitationHistory={invitationHistory} />
    </div>;
};
export default MyCustomers;